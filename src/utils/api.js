/**
 * Minimal HTTP client wrapper using native fetch.
 */

export async function apiRequest(endpoint, options = {}) {
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(options.headers || {}),
  };

  // Only set application/json when not sending FormData
  if (!isFormData && options.body && typeof options.body === 'object') {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  // Include credentials for HttpOnly cookie sessions
  const config = {
    ...options,
    headers,
    credentials: 'include',
  };

  const response = await fetch(endpoint, config);

  if (!response.ok) {
    let errorMsg = `Permintaan gagal (${response.status})`;
    try {
      const errData = await response.json();
      if (errData && errData.error) {
        errorMsg = errData.error;
      }
    } catch (_) {}
    const err = new Error(errorMsg);
    err.status = response.status;
    throw err;
  }

  // If the caller requested blob or raw response
  if (options.responseType === 'blob') {
    return await response.blob();
  }

  try {
    return await response.json();
  } catch (_) {
    return {};
  }
}
