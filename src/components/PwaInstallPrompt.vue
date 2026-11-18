<template>
  <div
    v-if="showPrompt"
    class="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:w-96 z-40 bg-white border border-slate-200 text-slate-800 rounded-lg p-3.5 shadow-xl flex items-center justify-between gap-3 animate-fade-in"
  >
    <div class="flex items-center gap-3 min-w-0">
      <img src="/logo-satria-muda.png" alt="SMC Logo" class="w-10 h-10 rounded-full border border-satria-gold/40 shrink-0" />
      <div class="min-w-0">
        <p class="text-xs font-bold text-slate-900 uppercase tracking-wider whitespace-nowrap">Pasang Aplikasi SMC</p>
        <p class="text-[11px] text-slate-500 truncate">Akses cepat satu ketukan langsung dari layar utama.</p>
      </div>
    </div>

    <div class="flex items-center gap-2 shrink-0">
      <button
        type="button"
        @click="installPwa"
        class="h-8 px-3 bg-satria-red hover:bg-satria-red-hover text-white text-xs font-bold rounded-[4px] shadow-sm active:translate-y-[1px] whitespace-nowrap"
      >
        Pasang
      </button>
      <button
        type="button"
        @click="dismissPrompt"
        class="p-1 text-slate-400 hover:text-slate-700"
      >
        <X class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { X } from 'lucide-vue-next';

const deferredPrompt = ref(null);
const showPrompt = ref(false);

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt.value = e;
    // Don't show if user already dismissed today
    const dismissed = localStorage.getItem('smc_pwa_dismissed');
    if (!dismissed) {
      showPrompt.value = true;
    }
  });

  window.addEventListener('appinstalled', () => {
    showPrompt.value = false;
    deferredPrompt.value = null;
  });
});

async function installPwa() {
  if (!deferredPrompt.value) return;
  deferredPrompt.value.prompt();
  const choice = await deferredPrompt.value.userChoice;
  if (choice.outcome === 'accepted') {
    showPrompt.value = false;
  }
  deferredPrompt.value = null;
}

function dismissPrompt() {
  showPrompt.value = false;
  localStorage.setItem('smc_pwa_dismissed', '1');
}
</script>
