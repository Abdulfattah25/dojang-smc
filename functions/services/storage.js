/**
 * R2 Storage operations abstraction.
 */

// In-memory fallback map for environments where R2 binding is not active during unit tests/dev
const fallbackStore = new Map();

export async function putDocument(env, key, arrayBuffer, contentType) {
  if (env.R2_BUCKET && typeof env.R2_BUCKET.put === 'function') {
    return await env.R2_BUCKET.put(key, arrayBuffer, {
      httpMetadata: { contentType: contentType || 'image/jpeg' }
    });
  }

  // Fallback storage in dev/test
  fallbackStore.set(key, { buffer: arrayBuffer, contentType: contentType || 'image/jpeg' });
  return { key };
}

export async function getDocument(env, key) {
  if (env.R2_BUCKET && typeof env.R2_BUCKET.get === 'function') {
    const object = await env.R2_BUCKET.get(key);
    if (!object) return null;
    return {
      body: object.body,
      contentType: object.httpMetadata?.contentType || 'image/jpeg',
      size: object.size
    };
  }

  // Fallback
  const item = fallbackStore.get(key);
  if (!item) return null;
  return {
    body: item.buffer,
    contentType: item.contentType,
    size: item.buffer.byteLength
  };
}

export async function deleteDocument(env, key) {
  if (!key) return;
  if (env.R2_BUCKET && typeof env.R2_BUCKET.delete === 'function') {
    return await env.R2_BUCKET.delete(key);
  }
  fallbackStore.delete(key);
}
