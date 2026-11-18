<template>
  <div class="max-w-xl mx-auto space-y-4 sm:space-y-6">
    <!-- Header Navigation & Title -->
    <div>
      <router-link
        to="/"
        class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-satria-red transition-colors mb-2.5"
      >
        <ArrowLeft class="w-3.5 h-3.5" />
        <span>Kembali ke Formulir Pendaftaran</span>
      </router-link>

      <div class="text-left">
        <h2 class="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight font-brand">
          Cek Status Pendaftaran
        </h2>
        <p class="text-xs sm:text-sm text-slate-500 mt-1">
          Pantau proses verifikasi berkas dan pembayaran calon atlet.
        </p>
      </div>
    </div>

    <!-- Search Form Card -->
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-6 md:p-8">
      <form @submit.prevent="handleCheckStatus" class="space-y-3.5 sm:space-y-5">
        <div class="flex items-center gap-2 pb-2 border-b border-slate-100">
          <span class="w-1.5 h-3.5 rounded-full bg-satria-red"></span>
          <h3 class="font-bold text-xs text-slate-900">
            Pencarian Data Atlet
          </h3>
        </div>

        <BaseInput
          v-model="form.full_name"
          label="Nama Lengkap Atlet"
          placeholder="Sesuai nama saat mendaftar"
          required
          :error="errors.full_name"
        />

        <BaseInput
          v-model="form.birth_date"
          type="date"
          label="Tanggal Lahir"
          required
          :error="errors.birth_date"
        />

        <button
          type="submit"
          :disabled="loading"
          class="w-full h-10 sm:h-11 rounded-lg sm:rounded-xl bg-satria-red hover:bg-satria-darkred active:scale-[0.99] text-white font-bold text-xs sm:text-sm tracking-wide shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
          <Search v-else class="w-4 h-4" />
          <span>{{ loading ? 'Mencocokkan Data...' : 'Periksa Status' }}</span>
        </button>
      </form>
    </div>

    <!-- Search Result Card: Found -->
    <div
      v-if="hasSearched && member"
      class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 animate-fade-in"
    >
      <!-- Result Card Header: Registration Code & Timestamp -->
      <div class="flex items-center justify-between gap-2 pb-3.5 border-b border-slate-100 flex-wrap">
        <div class="flex items-center gap-2">
          <span class="text-[11px] sm:text-xs text-slate-500">Kode Registrasi:</span>
          <span class="font-mono font-bold text-xs sm:text-sm text-satria-red bg-satria-red/5 px-2 py-0.5 rounded border border-satria-red/20">
            {{ member.registration_code }}
          </span>
        </div>
        <div class="text-[11px] sm:text-xs text-slate-400 font-mono">
          Daftar: {{ formatWitaDate(member.created_at) }}
        </div>
      </div>

      <!-- Applicant Identity Row -->
      <div class="flex items-center gap-3 sm:gap-3.5">
        <!-- Avatar Photo / Graceful Initial Fallback -->
        <div class="relative shrink-0">
          <img
            v-if="member.doc_photo_key && !avatarError"
            :src="'/api/avatar/' + member.doc_photo_key"
            @error="avatarError = true"
            :alt="member.full_name"
            class="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-slate-200 shadow-2xs"
          />
          <div
            v-else
            class="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-satria-red/10 border-2 border-satria-red/20 text-satria-red flex items-center justify-center font-bold font-mono text-base sm:text-lg shrink-0 shadow-2xs"
          >
            {{ member.full_name?.charAt(0) || 'A' }}
          </div>
        </div>

        <div class="min-w-0 flex-1">
          <h3 class="text-sm sm:text-base font-bold text-slate-900 truncate">
            {{ member.full_name }}
          </h3>
          <div class="flex items-center gap-2 mt-0.5 text-[11px] sm:text-xs text-slate-500 font-mono flex-wrap">
            <span class="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
              Sabuk: {{ member.belt_rank || 'Putih' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Dual Status Information Boxes -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5">
        <!-- 1. Verification Status Box -->
        <div class="bg-slate-50/80 rounded-xl p-3 sm:p-3.5 border border-slate-200/60 flex flex-col justify-between gap-2">
          <div class="flex items-center justify-between gap-2">
            <span class="text-[11px] sm:text-xs font-bold text-slate-500">
              Status Berkas
            </span>
            <StatusBadge :status="member.registration_status" type="registration" />
          </div>
          <p class="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
            <template v-if="member.registration_status === 'verified'">
              Berkas telah diperiksa dan disetujui oleh pengurus dojang.
            </template>
            <template v-else-if="member.registration_status === 'rejected'">
              Berkas ditolak atau memerlukan perbaikan. Silakan hubungi pengurus.
            </template>
            <template v-else>
              Berkas pendaftaran sedang dalam antrean review oleh tim pengurus.
            </template>
          </p>
        </div>

        <!-- 2. Payment Status Box -->
        <div class="bg-slate-50/80 rounded-xl p-3 sm:p-3.5 border border-slate-200/60 flex flex-col justify-between gap-2">
          <div class="flex items-center justify-between gap-2">
            <span class="text-[11px] sm:text-xs font-bold text-slate-500">
              Pembayaran
            </span>
            <StatusBadge :status="member.payment_status" type="payment" />
          </div>
          <p class="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
            <template v-if="member.payment_status === 'paid'">
              Administrasi telah lunas. Selamat bergabung di Satria Muda Club!
            </template>
            <template v-else>
              Silakan lakukan pembayaran administrasi pendaftaran ke pengurus dojang.
            </template>
          </p>
        </div>
      </div>

      <!-- Action Area: WhatsApp Chat & Reset -->
      <div class="space-y-2.5 pt-1">
        <a
          :href="whatsappUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="w-full h-10 sm:h-11 rounded-lg sm:rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-xs sm:text-sm tracking-wide shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 select-none"
        >
          <!-- Authentic WhatsApp Icon -->
          <svg class="w-4.5 h-4.5 fill-current shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          <span>Chat WhatsApp Pengurus</span>
        </a>

        <button
          type="button"
          @click="resetSearch"
          class="w-full py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          Cek Pendaftar Lain
        </button>
      </div>
    </div>

    <!-- Search Result: Not Found Alert -->
    <div
      v-else-if="hasSearched && !member"
      class="bg-white rounded-2xl border border-amber-200/80 shadow-xs p-4 sm:p-6 space-y-3.5 animate-fade-in"
    >
      <div class="flex items-start gap-3">
        <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
          <AlertCircle class="w-4 h-4 sm:w-4.5 sm:h-4.5" />
        </div>
        <div class="space-y-0.5">
          <h4 class="font-bold text-xs sm:text-sm text-slate-900">
            Data Pendaftaran Tidak Ditemukan
          </h4>
          <p class="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
            Data dengan nama <strong>"{{ lastSearchedName }}"</strong> dan tanggal lahir tersebut tidak ditemukan. Pastikan nama lengkap dan tanggal lahir sama persis dengan formulir pendaftaran.
          </p>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-100">
        <button
          type="button"
          @click="resetSearch"
          class="h-9 px-3.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
        >
          <span>Coba Cari Lagi</span>
        </button>

        <router-link
          to="/"
          class="h-9 px-3.5 rounded-lg bg-satria-red/10 hover:bg-satria-red/20 text-satria-red text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
        >
          <span>Buka Formulir Pendaftaran</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { Search, Loader2, ArrowLeft, AlertCircle } from 'lucide-vue-next';
import BaseInput from '../../components/common/BaseInput.vue';
import StatusBadge from '../../components/common/StatusBadge.vue';
import { formatWitaDate, cleanPhone } from '../../utils/date.js';

const form = reactive({
  full_name: '',
  birth_date: '',
});

const errors = reactive({
  full_name: '',
  birth_date: '',
});

const loading = ref(false);
const hasSearched = ref(false);
const member = ref(null);
const adminWhatsapp = ref('6281234567890');
const avatarError = ref(false);
const lastSearchedName = ref('');

const whatsappUrl = computed(() => {
  const name = member.value?.full_name ? ` atas nama *${member.value.full_name}*` : '';
  const code = member.value?.registration_code ? ` (Kode: ${member.value.registration_code})` : '';
  const message = `Halo Pengurus Taekwondo Satria Muda Club, saya ingin menanyakan update status pendaftaran${name}${code}. Mohon informasinya. Terima kasih!`;
  const phone = cleanPhone(adminWhatsapp.value, '6281234567890');
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
});

async function handleCheckStatus() {
  errors.full_name = '';
  errors.birth_date = '';

  if (!form.full_name.trim()) {
    errors.full_name = 'Nama lengkap wajib diisi.';
    return;
  }
  if (!form.birth_date) {
    errors.birth_date = 'Tanggal lahir wajib diisi.';
    return;
  }

  loading.value = true;
  avatarError.value = false;
  lastSearchedName.value = form.full_name.trim();

  try {
    const res = await fetch('/api/check-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: form.full_name.trim(),
        birth_date: form.birth_date,
      }),
    });

    const data = await res.json();
    hasSearched.value = true;

    if (data.found && data.member) {
      member.value = data.member;
      if (data.whatsapp) {
        adminWhatsapp.value = data.whatsapp;
      }
    } else {
      member.value = null;
    }
  } catch (err) {
    console.error('Failed to check status:', err);
    hasSearched.value = true;
    member.value = null;
  } finally {
    loading.value = false;
  }
}

function resetSearch() {
  hasSearched.value = false;
  member.value = null;
  errors.full_name = '';
  errors.birth_date = '';
}
</script>