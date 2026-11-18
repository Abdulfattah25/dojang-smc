<template>
  <div class="space-y-5 sm:space-y-6">
    <!-- Dashboard Heading -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
      <div>
        <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-brand whitespace-nowrap">
          Dashboard Operasional
        </h2>
        <p class="text-xs sm:text-sm text-slate-500 mt-0.5">
          Pantau ringkasan pendaftaran siswa baru.
        </p>
      </div>

    </div>

    <!-- 4 KPI Metric Cards (Modern & Stylish) -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4.5">
      <!-- KPI 1: Calon Pendaftar (Pending) -->
      <div class="group relative bg-white border border-slate-200/90 rounded-xl p-3.5 sm:p-5 overflow-hidden shadow-2xs hover:shadow-md hover:border-amber-300 hover:-translate-y-0.5 transition-all duration-200 ease-out flex flex-col justify-between">
        <!-- Top accent gradient hairline -->
        <div class="absolute inset-x-0 top-0 h-[2.5px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
        <!-- Ambient background glow -->
        <div class="pointer-events-none absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-amber-400/10 blur-xl group-hover:bg-amber-400/20 transition-all duration-300"></div>
        <!-- Ghost watermark icon -->
        <Clock class="pointer-events-none absolute -right-2 -bottom-2 w-16 h-16 text-amber-600/5 group-hover:text-amber-600/10 group-hover:scale-110 transition-all duration-300" />

        <div>
          <div class="flex items-center justify-between gap-2 mb-2 sm:mb-2.5">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
              Menunggu Review
            </span>
            <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-50 border border-amber-200/80 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:bg-amber-100/80 transition-all duration-200">
              <Clock class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p class="text-2xl sm:text-3xl font-extrabold text-slate-900 group-hover:text-amber-600 font-mono tracking-tight tabular-nums whitespace-nowrap transition-colors">
            {{ metrics.total_pending }}
          </p>
        </div>

        <div class="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span class="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 animate-pulse"></span>
          <span class="truncate">Calon siswa belum divalidasi</span>
        </div>
      </div>

      <!-- KPI 2: Anggota Terverifikasi -->
      <div class="group relative bg-white border border-slate-200/90 rounded-xl p-3.5 sm:p-5 overflow-hidden shadow-2xs hover:shadow-md hover:border-amber-300 hover:-translate-y-0.5 transition-all duration-200 ease-out flex flex-col justify-between">
        <div class="absolute inset-x-0 top-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#C9A85B] to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
        <div class="pointer-events-none absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-[#C9A85B]/10 blur-xl group-hover:bg-[#C9A85B]/20 transition-all duration-300"></div>
        <ShieldCheck class="pointer-events-none absolute -right-2 -bottom-2 w-16 h-16 text-[#8C6918]/5 group-hover:text-[#8C6918]/10 group-hover:scale-110 transition-all duration-300" />

        <div>
          <div class="flex items-center justify-between gap-2 mb-2 sm:mb-2.5">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
              Anggota Aktif
            </span>
            <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/10 border border-amber-300/60 text-[#8C6918] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:bg-amber-500/15 transition-all duration-200">
              <ShieldCheck class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p class="text-2xl sm:text-3xl font-extrabold text-slate-900 group-hover:text-[#8C6918] font-mono tracking-tight tabular-nums whitespace-nowrap transition-colors">
            {{ metrics.total_verified }}
          </p>
        </div>

        <div class="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span class="w-1.5 h-1.5 rounded-full bg-[#C9A85B] shrink-0"></span>
          <span class="truncate">Telah diverifikasi pelatih</span>
        </div>
      </div>

      <!-- KPI 3: Belum Bayar -->
      <div class="group relative bg-white border border-slate-200/90 rounded-xl p-3.5 sm:p-5 overflow-hidden shadow-2xs hover:shadow-md hover:border-red-300 hover:-translate-y-0.5 transition-all duration-200 ease-out flex flex-col justify-between">
        <div class="absolute inset-x-0 top-0 h-[2.5px] bg-gradient-to-r from-transparent via-satria-red to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
        <div class="pointer-events-none absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-satria-red/10 blur-xl group-hover:bg-satria-red/20 transition-all duration-300"></div>
        <AlertCircle class="pointer-events-none absolute -right-2 -bottom-2 w-16 h-16 text-satria-red/5 group-hover:text-satria-red/10 group-hover:scale-110 transition-all duration-300" />

        <div>
          <div class="flex items-center justify-between gap-2 mb-2 sm:mb-2.5">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
              Belum Bayar
            </span>
            <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-red-50 border border-red-200 text-satria-red flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:bg-red-100/80 transition-all duration-200">
              <AlertCircle class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p class="text-2xl sm:text-3xl font-extrabold text-slate-900 group-hover:text-satria-red font-mono tracking-tight tabular-nums whitespace-nowrap transition-colors">
            {{ metrics.total_unpaid }}
          </p>
        </div>

        <div class="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span class="w-1.5 h-1.5 rounded-full bg-satria-red shrink-0"></span>
          <span class="truncate">Tunggakan iuran / formulir</span>
        </div>
      </div>

      <!-- KPI 4: Penerimaan Bulan Berjalan -->
      <div class="group relative bg-white border border-slate-200/90 rounded-xl p-3.5 sm:p-5 overflow-hidden shadow-2xs hover:shadow-md hover:border-emerald-300 hover:-translate-y-0.5 transition-all duration-200 ease-out flex flex-col justify-between">
        <div class="absolute inset-x-0 top-0 h-[2.5px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
        <div class="pointer-events-none absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-emerald-400/10 blur-xl group-hover:bg-emerald-400/20 transition-all duration-300"></div>
        <Wallet class="pointer-events-none absolute -right-2 -bottom-2 w-16 h-16 text-emerald-600/5 group-hover:text-emerald-600/10 group-hover:scale-110 transition-all duration-300" />

        <div>
          <div class="flex items-center justify-between gap-2 mb-2 sm:mb-2.5">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
              Penerimaan Bulan Ini
            </span>
            <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:bg-emerald-100/80 transition-all duration-200">
              <Wallet class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div class="flex items-baseline gap-1">
            <span class="text-xs sm:text-sm font-bold text-emerald-700/80 font-mono">Rp</span>
            <p class="text-xl sm:text-2xl font-extrabold text-slate-900 group-hover:text-emerald-600 font-mono tracking-tight tabular-nums truncate whitespace-nowrap transition-colors">
              {{ Number(metrics.total_revenue_month).toLocaleString('id-ID') }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
          <span class="truncate">Pembayaran terkonfirmasi</span>
        </div>
      </div>
    </div>

    <!-- Latest Applicants Section -->
    <div class="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
      <div class="p-3.5 sm:p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 class="font-bold text-base text-slate-900 whitespace-nowrap">Pendaftar Terbaru</h3>
          <p class="text-xs text-slate-500 mt-0.5">5 calon siswa terakhir yang masuk ke sistem.</p>
        </div>
        <router-link
          to="/admin/applicants"
          class="text-xs font-semibold text-satria-red hover:underline flex items-center gap-1 whitespace-nowrap"
        >
          <span>Lihat Semua</span>
          <ChevronRight class="w-4 h-4" />
        </router-link>
      </div>

      <!-- Data Table / Mobile Card List -->
      <div v-if="recentApplicants.length" class="divide-y divide-slate-100">
        <div
          v-for="applicant in recentApplicants"
          :key="applicant.id"
          class="p-3.5 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
        >
          <div class="flex items-center gap-3 min-w-0">
            <div class="relative shrink-0">
              <img
                v-if="applicant.doc_photo_key && !avatarErrors[applicant.id]"
                :src="'/api/admin/documents/' + applicant.doc_photo_key"
                @error="avatarErrors[applicant.id] = true"
                :alt="applicant.full_name"
                class="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-slate-200 shadow-2xs"
              />
              <div
                v-else
                class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-satria-red/10 border border-satria-red/20 text-satria-red flex items-center justify-center font-bold font-mono text-xs sm:text-sm shrink-0 shadow-2xs"
              >
                {{ applicant.full_name?.charAt(0) || 'A' }}
              </div>
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-semibold text-slate-900 text-xs sm:text-sm truncate">{{ applicant.full_name }}</span>
              </div>
              <div class="flex items-center gap-2 text-xs text-slate-500 mt-0.5 font-mono flex-wrap">
                <span class="font-semibold text-slate-700 whitespace-nowrap">{{ applicant.registration_code }}</span>
                <span class="whitespace-nowrap">Sabuk: {{ applicant.belt_rank || 'Putih' }}</span>
              </div>
            </div>
          </div>

          <div class="hidden sm:flex items-center gap-2 self-end sm:self-auto shrink-0 pt-1 sm:pt-0">
            <a
              :href="'https://wa.me/' + cleanPhone(applicant.phone_number)"
              target="_blank"
              class="h-8 px-2.5 sm:px-3 rounded bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <MessageSquare class="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <router-link
              to="/admin/applicants"
              class="h-8 px-2.5 sm:px-3 rounded bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors whitespace-nowrap"
            >
              <span>Periksa</span>
              <ChevronRight class="w-3.5 h-3.5" />
            </router-link>
          </div>
        </div>
      </div>

      <div v-else class="p-8 text-center text-slate-400 text-xs">
        Belum ada calon pendaftar dalam sistem.
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { apiRequest } from '../../utils/api.js';
import {
  Clock,
  ShieldCheck,
  AlertCircle,
  Wallet,
  UserCheck,
  RefreshCw,
  ChevronRight,
  MessageSquare
} from 'lucide-vue-next';
import StatusBadge from '../../components/common/StatusBadge.vue';

const emit = defineEmits(['pending-count-updated']);

const loading = ref(false);
const metrics = reactive({
  total_pending: 0,
  total_verified: 0,
  total_unpaid: 0,
  total_revenue_month: 0,
});
const recentApplicants = ref([]);
const avatarErrors = reactive({});

async function fetchDashboardData() {
  loading.value = true;
  try {
    const data = await apiRequest('/api/admin/dashboard');
    if (data.metrics) {
      Object.assign(metrics, data.metrics);
      emit('pending-count-updated', metrics.total_pending);
    }
    recentApplicants.value = data.recent_applicants || [];
  } catch (err) {
    console.error('Failed to load dashboard:', err);
  } finally {
    loading.value = false;
  }
}

function cleanPhone(phone) {
  if (!phone) return '';
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  }
  return cleaned;
}

onMounted(() => {
  fetchDashboardData();
});
</script>
