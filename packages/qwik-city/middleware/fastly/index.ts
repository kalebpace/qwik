import type {
  ServerRenderOptions,
  ServerRequestEvent,
} from '@builder.io/qwik-city/middleware/request-handler';
import {
  mergeHeadersCookies,
  requestHandler,
} from '@builder.io/qwik-city/middleware/request-handler';
import { getNotFound } from '@qwik-city-not-found-paths';
import { isStaticPath } from '@qwik-city-static-paths';
import { _deserializeData, _serializeData, _verifySerializable } from '@builder.io/qwik';
import { setServerPlatform } from '@builder.io/qwik/server';

import { env } from "fastly:env"
import { SimpleCache } from "fastly:cache";

// @builder.io/qwik-city/middleware/fastly

/**
 * @public
 */
export function createQwikCity(opts: QwikCityFastlyOptions) {
  const qwikSerializer = {
    _deserializeData,
    _serializeData,
    _verifySerializable,
  };
  if (opts.manifest) {
    setServerPlatform(opts.manifest);
  }
  async function onFastlyFetch(platform: PlatformFastly) {
    (globalThis as any).TextEncoderStream = TextEncoderStream;
    try {
      const { request, client } = platform;
      const url = new URL(request.url);

      if (isStaticPath(request.method, url)) {
        // known static path, let fastly handle it.
        return fetch(request, { backend: platform.request.backend });
      }

      const useCache =
        url.hostname !== '127.0.0.1' &&
        url.hostname !== 'localhost' &&
        url.port === '' &&
        request.method === 'GET';
      const cacheKey = request.method.concat(url.href);
      const cachedResponse = useCache ? SimpleCache.get(cacheKey) : null
      if (cachedResponse) {
        return cachedResponse
      }

      const serverRequestEv: ServerRequestEvent<Response> = {
        mode: 'server',
        locale: undefined,
        url,
        request,
        env: {
          get(key) {
            return env(key);
          },
        },
        getWritableStream: (status, headers, cookies, resolve) => {
          const { readable, writable } = new TransformStream<Uint8Array>();
          const response = new Response(readable, {
            status,
            headers: mergeHeadersCookies(headers, cookies),
          });
          resolve(response);
          return writable;
        },
        getClientConn: () => {
          return {
            ip: client.address,
            country: client.geo.country_name || undefined
          };
        },
        platform,
      };

      // send request to qwik city request handler
      const handledResponse = await requestHandler(serverRequestEv, opts, qwikSerializer);
      if (handledResponse) {
        handledResponse.completion.then((v) => {
          if (v) {
            console.error(v);
          }
        });
        const response = await handledResponse.response;
        if (response) {
          if (useCache && response.ok && response.body && response.headers.has('Cache-Control')) {
            platform.waitUntil(SimpleCache.getOrSet(cacheKey, async () => {
              return {
                value: response.body!,
                ttl: 60
              }
            }))
          }
          return response;
        }
      }

      // qwik city did not have a route for this request
      // response with 404 for this pathname
      const notFoundHtml = getNotFound(url.pathname);
      return new Response(notFoundHtml, {
        status: 404,
        headers: { 'Content-Type': 'text/html; charset=utf-8', 'X-Not-Found': url.pathname },
      });
    } catch (e: any) {
      console.error(e);
      return new Response(String(e || 'Error'), {
        status: 500,
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Error': 'fastly' },
      });
    }
  }

  return onFastlyFetch;
}

/**
 * @public
 */
export interface QwikCityFastlyOptions extends ServerRenderOptions { }

/**
 * @public
 */
export interface PlatformFastly {
  // Extending from or using FetchEvent found in @fastly/js-compute causes the following error:
  //   ❌ Error: Internal Error: Unable to follow symbol for "FetchEvent"
  //   https://js-compute-reference-docs.edgecompute.app/docs/globals/FetchEvent/
  readonly client: ClientInfo;
  readonly request: Request;
  respondWith(response: Response | PromiseLike<Response>): void;
  waitUntil(promise: Promise<any>): void;
}

const resolved = Promise.resolve();
class TextEncoderStream {
  // minimal polyfill implementation of TextEncoderStream
  // borrowed from Cloudflare Pages adapter
  _writer: any;
  readable: any;
  writable: any;

  constructor() {
    this._writer = null;
    this.readable = {
      pipeTo: (writableStream: any) => {
        this._writer = writableStream.getWriter();
      },
    };
    this.writable = {
      getWriter: () => {
        if (!this._writer) {
          throw new Error('No writable stream');
        }
        const encoder = new TextEncoder();
        return {
          write: async (chunk: any) => {
            if (chunk != null) {
              await this._writer.write(encoder.encode(chunk));
            }
          },
          close: () => this._writer.close(),
          ready: resolved,
        };
      },
    };
  }
}