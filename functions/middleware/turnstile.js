export async function verifyTurnstileToken(c, token) {
  const secretKey = c.env.TURNSTILE_SECRET_KEY;
  const isDev = !secretKey || c.env.ENVIRONMENT === 'development' || secretKey.startsWith('1x000000');

  // Allow bypass in local dev or test mode
  if (isDev && (!token || token === 'dummy-turnstile-token' || token.startsWith('dummy'))) {
    return true;
  }

  if (!token) return false;

  try {
    const ip = c.req.header('CF-Connecting-IP') || c.req.header('x-forwarded-for') || '';
    const formData = new FormData();
    formData.append('secret', secretKey);
    formData.append('response', token);
    if (ip) formData.append('remoteip', ip);

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData
    });

    const outcome = await res.json();
    if (outcome.success) {
      return true;
    }

    // In local development, if remote siteverify rejected (e.g. localhost domain not registered or test secret mismatch)
    if (isDev) {
      console.warn('[Turnstile Dev Bypass] Verification rejected by Cloudflare, but bypassed because ENVIRONMENT === development:', outcome['error-codes']);
      return true;
    }

    return false;
  } catch (err) {
    // shortcut: when turnstile endpoint is unreachable in edge dev, log and allow if dev
    if (isDev) return true;
    return false;
  }
}
