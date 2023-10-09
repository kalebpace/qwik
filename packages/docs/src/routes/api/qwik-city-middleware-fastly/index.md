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
export interface PlatformFastly
```

| Property     | Modifiers             | Type       | Description |
| ------------ | --------------------- | ---------- | ----------- |
| [client](#)  | <code>readonly</code> | ClientInfo |             |
| [request](#) | <code>readonly</code> | Request    |             |

| Method                                               | Description |
| ---------------------------------------------------- | ----------- |
| [respondWith(response)](#platformfastly-respondwith) |             |
| [waitUntil(promise)](#platformfastly-waituntil)      |             |

[Edit this section](https://github.com/BuilderIO/qwik/tree/main/packages/qwik-city/middleware/fastly/index.ts)

## QwikCityFastlyOptions

```typescript
export interface QwikCityFastlyOptions extends ServerRenderOptions
```

**Extends:** ServerRenderOptions

[Edit this section](https://github.com/BuilderIO/qwik/tree/main/packages/qwik-city/middleware/fastly/index.ts)

## respondWith

```typescript
respondWith(response: Response | PromiseLike<Response>): void;
```

| Parameter | Type                                    | Description |
| --------- | --------------------------------------- | ----------- |
| response  | Response \| PromiseLike&lt;Response&gt; |             |

**Returns:**

void

## waitUntil

```typescript
waitUntil(promise: Promise<any>): void;
```

| Parameter | Type               | Description |
| --------- | ------------------ | ----------- |
| promise   | Promise&lt;any&gt; |             |

**Returns:**

void
