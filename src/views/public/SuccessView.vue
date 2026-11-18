<template>
  <div class="max-w-xl mx-auto py-2 sm:py-4">
    <!-- Main Confirmation Card with 8-pointed star motif -->
    <div class="relative bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-8 overflow-hidden text-center">
      
      <!-- 8-Pointed Star Watermark Motif (Opacity 6%) -->
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-[0.06]">
        <svg viewBox="0 0 100 100" class="w-96 h-96 fill-satria-gold transform rotate-12">
          <polygon points="50,0 62,35 98,35 68,57 79,92 50,70 21,92 32,57 2,35 38,35" />
        </svg>
      </div>

      <div class="relative z-10">
        <!-- Success Badge & Icon -->
        <div class="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-sm">
          <CheckCircle2 class="w-9 h-9" />
        </div>

        <span class="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold tracking-wider uppercase mb-2">
          Pendaftaran Berhasil Dikirim
        </span>

        <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight font-brand mb-2">
          Selamat Bergabung!
        </h2>
        <p class="text-sm text-slate-600 mb-6 max-w-md mx-auto">
          Data calon anggota telah aman tercatat di sistem <strong>Taekwondo Satria Muda Club</strong>.
        </p>

        <!-- Registration Code Box (Geist / JetBrains Mono) -->
        <div class="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6 max-w-sm mx-auto">
          <span class="text-xs text-slate-500 uppercase tracking-widest font-semibold block mb-1">
            Nomor Registrasi Calon Anggota
          </span>
          <div class="flex items-center justify-center gap-3">
            <span class="font-mono text-xl sm:text-2xl font-extrabold text-satria-red tracking-wider">
              {{ registrationCode }}
            </span>
            <button
              type="button"
              @click="copyCode"
              class="p-2 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-200 transition-colors"
              title="Salin Kode"
            >
              <Copy v-if="!copied" class="w-4 h-4" />
              <Check v-else class="w-4 h-4 text-emerald-600" />
            </button>
          </div>
          <span v-if="copied" class="text-[11px] text-emerald-600 font-medium block mt-1">
            Kode berhasil disalin!
          </span>
        </div>

        <!-- Next Steps Instruction Box -->
        <div class="bg-amber-50/70 border border-amber-200/80 rounded-lg p-4 text-left text-xs text-amber-950 mb-6 space-y-2">
          <p class="font-bold flex items-center gap-1.5 text-amber-900">
            <Info class="w-4 h-4 text-amber-600 shrink-0" />
            Langkah Selanjutnya:
          </p>
          <ol class="list-decimal list-inside space-y-1.5 text-amber-900/90 pl-1">
            <li>Simpan atau tangkap layar (screenshot) kode pendaftaran di atas.</li>
            <li>Pengurus Dojang akan memeriksa dan memverifikasi berkas akta kelahiran dalam 1x24 jam.</li>
            <li>Konfirmasikan pendaftaran Anda ke nomor WhatsApp resmi pengurus dojang melalui tombol di bawah.</li>
          </ol>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-3">
          <a
            :href="whatsappUrl"
            target="_blank"
            class="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-lg flex items-center justify-center gap-2 shadow-xs transition-all active:translate-y-[1px]"
          >
            <MessageCircle class="w-5 h-5" />
            <span>Konfirmasi ke WhatsApp Pengurus</span>
          </a>

          <router-link
            to="/"
            class="inline-block text-xs font-semibold text-slate-500 hover:text-satria-red transition-colors py-2"
          >
            ← Kembali ke Halaman Utama
          </router-link>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { CheckCircle2, Copy, Check, MessageCircle, Info } from 'lucide-vue-next';

const route = useRoute();
const copied = ref(false);
const memberData = ref(null);

const registrationCode = computed(() => {
  return route.query.code || memberData.value?.code || 'TKD-202611-001';
});

const whatsappUrl = computed(() => {
  const code = registrationCode.value;
  const name = memberData.value?.name ? ` atas nama *${memberData.value.name}*` : '';
  const message = `Halo Pengurus Taekwondo Satria Muda Club, saya ingin konfirmasi bahwa telah mengisi formulir pendaftaran siswa baru${name} dengan Kode Registrasi: *${code}*. Mohon informasinya untuk jadwal latihan perdana. Terima kasih!`;
  return `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`;
});

function copyCode() {
  navigator.clipboard.writeText(registrationCode.value);
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 2500);
}

onMounted(() => {
  try {
    const raw = sessionStorage.getItem('smc_registration_result');
    if (raw) {
      memberData.value = JSON.parse(raw);
    }
  } catch (_) {}
});
</script>
