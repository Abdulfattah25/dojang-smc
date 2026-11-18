<template>
  <div>
    <!-- Cloudflare Turnstile container: Otomatis 0px jika mode Invisible, atau ukuran pas jika mode Interaktif -->
    <div
      v-show="!isFallbackActive"
      ref="containerRef"
      id="cf-turnstile"
      class="flex justify-center items-center w-full transition-all"
    ></div>

    <!-- Dev/Fallback Badge when running in offline dev mode -->
    <div
      v-if="isFallbackActive"
      class="flex items-center gap-2.5 p-2.5 my-2 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 shadow-xs"
    >
      <div class="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
        <ShieldCheck class="w-3.5 h-3.5 text-amber-600" />
      </div>
      <div>
        <p class="font-semibold text-amber-900 leading-tight">Mode Simulasi Offline (Dev Bypass)</p>
        <p class="text-[11px] text-amber-700 mt-0.5">Cloudflare Turnstile tidak dapat dijangkau.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { ShieldCheck } from 'lucide-vue-next';

const props = defineProps({
  theme: {
    type: String,
    default: 'light', // Mengunci ke tema terang jika widget interaktif tampil
  },
  size: {
    type: String,
    default: 'normal',
  },
});

const emit = defineEmits(['token-received', 'token-expired']);

const containerRef = ref(null);
const isFallbackActive = ref(false);
let widgetId = null;
let pollTimer = null;
let fallbackTimer = null;

// Official Cloudflare testing sitekey: 1x00000000000000000000AA (always passes)
const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';
if (!import.meta.env.VITE_TURNSTILE_SITE_KEY && import.meta.env.PROD) {
  console.warn('[Turnstile Warning] VITE_TURNSTILE_SITE_KEY belum diatur di environment produksi. Menggunakan test key.');
}

onMounted(() => {
  if (window.turnstile) {
    initTurnstile();
  } else {
    // If script is not yet in head, add it
    let script = document.querySelector('script[src*="turnstile/v0/api.js"]');
    if (!script) {
      script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.onerror = () => {
        activateFallback();
      };
      document.head.appendChild(script);
    }

    // Poll for window.turnstile readiness
    pollTimer = setInterval(() => {
      if (window.turnstile) {
        clearInterval(pollTimer);
        pollTimer = null;
        initTurnstile();
      }
    }, 150);

    // Safety timeout: only fallback if network really blocks Cloudflare after 15s (realistic for slow mobile)
    fallbackTimer = setTimeout(() => {
      if (pollTimer) {
        clearInterval(pollTimer);
        pollTimer = null;
      }
      if (!widgetId) activateFallback();
    }, 15000);
  }
});

function initTurnstile() {
  if (!window.turnstile || !containerRef.value) {
    activateFallback();
    return;
  }

  // Clear pending timers
  if (pollTimer) clearInterval(pollTimer);
  if (fallbackTimer) clearTimeout(fallbackTimer);

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
      theme: props.theme,
      size: props.size,
    });
  } catch (err) {
    activateFallback();
  }
}

function activateFallback() {
  isFallbackActive.value = true;
  emit('token-received', 'dummy-turnstile-token');
}

function reset() {
  if (widgetId && window.turnstile) {
    try {
      window.turnstile.reset(widgetId);
    } catch (_) {}
  }
}

defineExpose({
  reset,
});

onBeforeUnmount(() => {
  if (pollTimer) clearInterval(pollTimer);
  if (fallbackTimer) clearTimeout(fallbackTimer);
  if (widgetId && window.turnstile) {
    try {
      window.turnstile.remove(widgetId);
    } catch (_) {}
  }
});
</script>
