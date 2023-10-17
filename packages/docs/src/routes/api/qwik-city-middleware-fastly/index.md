---
title: \@builder.io/qwik-city/middleware/fastly API Reference
---

# [API](/api) &rsaquo; @builder.io/qwik-city/middleware/fastly

## createQwikCity

```typescript
export declare function createQwikCity(
  opts: QwikCityFastlyOptions,
): (
  platform: PlatformFastly,
) => Promise<Response | import("fastly:cache").SimpleCacheEntry>;
```

| Parameter | Type                                            | Description |
| --------- | ----------------------------------------------- | ----------- |
| opts      | [QwikCityFastlyOptions](#qwikcityfastlyoptions) |             |

**Returns:**

(platform: [PlatformFastly](#platformfastly)) =&gt; Promise&lt;Response \| import("fastly:cache").SimpleCacheEntry&gt;

[Edit this section](https://github.com/BuilderIO/qwik/tree/main/packages/qwik-city/middleware/fastly/index.ts)

## PlatformFastly

```typescript
export interface PlatformFastly extends FetchEvent
```

**Extends:** FetchEvent

[Edit this section](https://github.com/BuilderIO/qwik/tree/main/packages/qwik-city/middleware/fastly/index.ts)

## QwikCityFastlyOptions

```typescript
export interface QwikCityFastlyOptions extends ServerRenderOptions
```

**Extends:** ServerRenderOptions

[Edit this section](https://github.com/BuilderIO/qwik/tree/main/packages/qwik-city/middleware/fastly/index.ts)
