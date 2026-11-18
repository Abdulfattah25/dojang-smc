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
          Data atlet berhasil tercatat di sistem.
        </p>

        <!-- Next Steps Instruction Box -->
        <div class="bg-amber-50/70 border border-amber-200/80 rounded-lg p-4 text-left text-xs text-amber-950 mb-6 space-y-2">
          <p class="font-bold flex items-center gap-1.5 text-amber-900">
            <Info class="w-4 h-4 text-amber-600 shrink-0" />
            Langkah Selanjutnya:
          </p>
          <ol class="list-decimal list-inside space-y-1.5 text-amber-900/90 pl-1">
            <li>Konfirmasikan pendaftaran Anda ke nomor WhatsApp resmi pengurus dojang melalui tombol di bawah.</li>
            <li>Pengurus Dojang akan memeriksa dan memverifikasi data dalam 1x24 jam.</li>
          </ol>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-3">
          <a
            :href="whatsappUrl"
            target="_blank"
            class="w-full h-12 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm rounded-lg flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all active:translate-y-[1px]"
          >
            <!-- Authentic WhatsApp Brand SVG Icon -->
            <svg class="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
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
import { CheckCircle2, Info } from 'lucide-vue-next';
import { cleanPhone } from '../../utils/date.js';

const route = useRoute();
const memberData = ref(null);
const adminWhatsapp = ref('6281234567890');

const whatsappUrl = computed(() => {
  const name = memberData.value?.name ? ` atas nama *${memberData.value.name}*` : '';
  const message = `Halo Pengurus Taekwondo Satria Muda Club, saya ingin konfirmasi bahwa telah mengisi formulir pendaftaran siswa baru${name}. Mohon konfirmasinya ya. Terima kasih!`;
  const phone = cleanPhone(adminWhatsapp.value, '6281234567890');
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
});

async function fetchAdminWhatsapp() {
  try {
    const res = await fetch('/api/settings/whatsapp');
    if (res.ok) {
      const data = await res.json();
      if (data?.whatsapp_number) {
        adminWhatsapp.value = cleanPhone(data.whatsapp_number, '6281234567890');
      }
    }
  } catch (_) {}
}

onMounted(() => {
  fetchAdminWhatsapp();
  try {
    const raw = sessionStorage.getItem('smc_registration_result');
    if (raw) {
      memberData.value = JSON.parse(raw);
    }
  } catch (_) {}
});
</script>
