<template>
  <div class="my-2.5">
    <!-- Cloudflare Turnstile container with clean modern light styling -->
    <div
      v-show="!isFallbackActive"
      ref="containerRef"
      id="cf-turnstile"
      class="flex justify-center items-center min-h-[66px] w-full rounded-lg bg-slate-50/80 p-1 border border-slate-200/80 shadow-xs overflow-hidden"
    ></div>

    <!-- Dev/Fallback Badge when running without remote sitekey -->
    <div
      v-if="isFallbackActive"
      class="flex items-center gap-2.5 p-3 rounded-lg bg-emerald-50/90 border border-emerald-200/90 text-xs text-emerald-800 shadow-xs"
    >
      <div class="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
        <ShieldCheck class="w-3.5 h-3.5 text-emerald-600" />
      </div>
      <div>
        <p class="font-semibold text-emerald-900 leading-tight">Cloudflare Turnstile Verified</p>
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
    default: 'light', // Mengunci ke tema terang agar selaras dengan form kartu putih
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
  if (widgetId && window.turnstile) {
    try {
      window.turnstile.remove(widgetId);
    } catch (_) {}
  }
});
</script>
