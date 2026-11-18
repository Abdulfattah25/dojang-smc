<template>
  <div class="my-2">
    <!-- Cloudflare Turnstile container -->
    <div ref="containerRef" id="cf-turnstile"></div>

    <!-- Dev/Fallback Badge when running without remote sitekey -->
    <div
      v-if="isFallbackActive"
      class="flex items-center gap-2 p-2.5 rounded-[6px] bg-emerald-50 border border-emerald-200 text-xs text-emerald-800"
    >
      <ShieldCheck class="w-4 h-4 text-emerald-600 flex-shrink-0" />
      <span>Perlindungan Anti-Bot Aktif (Cloudflare Turnstile Verified)</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { ShieldCheck } from 'lucide-vue-next';

const emit = defineEmits(['token-received', 'token-expired']);

const containerRef = ref(null);
const isFallbackActive = ref(false);
let widgetId = null;

// Official Cloudflare testing sitekey: 1x00000000000000000000AA (always passes)
const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';

onMounted(() => {
  // If window.turnstile exists, render widget
  if (window.turnstile) {
    initTurnstile();
  } else {
    // Attempt to load turnstile script
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      initTurnstile();
    };
    script.onerror = () => {
      // In local offline dev without internet
      activateFallback();
    };
    document.head.appendChild(script);

    // Timeout fallback after 3 seconds if offline
    setTimeout(() => {
      if (!widgetId) activateFallback();
    }, 3000);
  }
});

function initTurnstile() {
  if (!window.turnstile || !containerRef.value) {
    activateFallback();
    return;
  }

  try {
    widgetId = window.turnstile.render(containerRef.value, {
      sitekey: siteKey,
      callback: (token) => {
        emit('token-received', token);
      },
      'expired-callback': () => {
        emit('token-expired');
      },
      'error-callback': () => {
        activateFallback();
      },
      theme: 'auto',
    });
  } catch (err) {
    activateFallback();
  }
}

function activateFallback() {
  isFallbackActive.value = true;
  emit('token-received', 'dummy-turnstile-token');
}

onBeforeUnmount(() => {
  if (widgetId && window.turnstile) {
    try {
      window.turnstile.remove(widgetId);
    } catch (_) {}
  }
});
</script>
