---
title: \@builder.io/qwik-city/middleware/fastly API Reference
---

# [API](/api) &rsaquo; @builder.io/qwik-city/middleware/fastly

## createQwikCity

```typescript
export declare function createQwikCity(opts: QwikCityFastlyOptions): (
  request: PlatformFastly["request"],
  env: Record<string, any> & {
    ASSETS: {
      fetch: (req: Request) => Response;
    };
  },
  ctx: PlatformFastly["ctx"],
) => Promise<Response>;
```

| Parameter | Type                                            | Description |
| --------- | ----------------------------------------------- | ----------- |
| opts      | [QwikCityFastlyOptions](#qwikcityfastlyoptions) |             |

**Returns:**

(request: [PlatformFastly](#platformfastly)['request'], env: Record&lt;string, any&gt; &amp; { ASSETS: { fetch: (req: Request) =&gt; Response; }; }, ctx: [PlatformFastly](#platformfastly)['ctx']) =&gt; Promise&lt;Response&gt;

[Edit this section](https://github.com/BuilderIO/qwik/tree/main/packages/qwik-city/middleware/fastly/index.ts)

## PlatformFastly

```typescript
export interface PlatformFastly
```

| Property     | Modifiers | Type                                                     | Description  |
| ------------ | --------- | -------------------------------------------------------- | ------------ |
| [ctx](#)     |           | { waitUntil: (promise: Promise&lt;any&gt;) =&gt; void; } |              |
| [env?](#)    |           | Record&lt;string, any&gt;                                | _(Optional)_ |
| [request](#) |           | Request                                                  |              |

[Edit this section](https://github.com/BuilderIO/qwik/tree/main/packages/qwik-city/middleware/fastly/index.ts)

## QwikCityFastlyOptions

```typescript
export interface QwikCityFastlyOptions extends ServerRenderOptions
```

**Extends:** ServerRenderOptions

[Edit this section](https://github.com/BuilderIO/qwik/tree/main/packages/qwik-city/middleware/fastly/index.ts)
