import type { StaticGenerateRenderOptions } from '@builder.io/qwik-city/static';
import { type ServerAdapterOptions, viteAdapter } from '../../shared/vite';
import fs from 'node:fs';
import { join, relative } from 'node:path';
import { normalizePathSlash } from '../../../utils/fs';

/**
 * @public
 */
export function fastlyAdapter(opts: FastlyAdapterOptions = {}): any {
  const env = process?.env;
  return viteAdapter({
    name: 'fastly',
    origin: env?.FASTLY_URL ?? env?.ORIGIN ?? 'https://example.edgecompute.app',
    ssg: opts.ssg,
    staticPaths: opts.staticPaths,
    cleanStaticGenerated: true,

    config() {
      return {
        resolve: {
          conditions: ['webworker', 'worker'],
        },
        ssr: {
          target: 'webworker',
          noExternal: true,
        },
        build: {
          ssr: true,
          rollupOptions: {
            output: {
              format: 'es',
              hoistTransitiveImports: false,
            },
            external: [/fastly:.*/],
          },
        },
        publicDir: false,
      };
    },

    async generate({ clientOutDir, serverOutDir, basePathname }) {
      const computeJsPath = join(clientOutDir, 'index.js');
      const hasComputeJs = fs.existsSync(computeJsPath);
      if (!hasComputeJs) {
        const importPath = relative(clientOutDir, join(serverOutDir, 'entry.fastly'));
        await fs.promises.writeFile(
          computeJsPath,
          [
            `import { fetch } from "${normalizePathSlash(importPath)}"; export default { fetch };`,
            `addEventListener('fetch', (event) => event.respondWith(fetch(event)))`,
          ].join('\n')
        );
      }
    },
  });
}

/**
 * @public
 */
export interface FastlyAdapterOptions extends ServerAdapterOptions {
  /**
   * Manually add pathnames that should be treated as static paths and not SSR.
   * For example, when these pathnames are requested, their response should
   * come from a static file, rather than a server-side rendered response.
   */
  staticPaths?: string[];
}

/**
 * @public
 */
export type { StaticGenerateRenderOptions };
