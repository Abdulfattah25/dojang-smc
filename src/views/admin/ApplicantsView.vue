<template>
  <div class="space-y-4 sm:space-y-5">
    <!-- View Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-brand whitespace-nowrap">
          Verifikasi Calon Pendaftar
        </h2>
        <p class="text-xs sm:text-sm text-slate-500 mt-0.5">
          Periksa dokumen Akta Kelahiran dan validasi pendaftaran.
        </p>
      </div>
    </div>

    <!-- 4 Summary KPI Cards (Modern & Stylish) -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4.5">
      <!-- Card 1: Menunggu Validasi -->
      <div class="group relative bg-white border border-slate-200/90 rounded-xl p-3.5 sm:p-5 overflow-hidden shadow-2xs hover:shadow-md hover:border-amber-300 hover:-translate-y-0.5 transition-all duration-200 ease-out flex flex-col justify-between">
        <div class="absolute inset-x-0 top-0 h-[2.5px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
        <div class="pointer-events-none absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-amber-400/10 blur-xl group-hover:bg-amber-400/20 transition-all duration-300"></div>
        <Clock class="pointer-events-none absolute -right-2 -bottom-2 w-16 h-16 text-amber-600/5 group-hover:text-amber-600/10 group-hover:scale-110 transition-all duration-300" />

        <div>
          <div class="flex items-center justify-between gap-2 mb-2 sm:mb-2.5">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
              Menunggu Validasi
            </span>
            <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-50 border border-amber-200/80 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:bg-amber-100/80 transition-all duration-200">
              <Clock class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p class="text-2xl sm:text-3xl font-extrabold text-slate-900 group-hover:text-amber-600 font-mono tracking-tight tabular-nums whitespace-nowrap transition-colors">
            {{ stats.total }}
          </p>
        </div>

        <div class="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span class="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 animate-pulse"></span>
          <span class="truncate">Perlu verifikasi berkas</span>
        </div>
      </div>

      <!-- Card 2: Calon Putra -->
      <div class="group relative bg-white border border-slate-200/90 rounded-xl p-3.5 sm:p-5 overflow-hidden shadow-2xs hover:shadow-md hover:border-blue-300 hover:-translate-y-0.5 transition-all duration-200 ease-out flex flex-col justify-between">
        <div class="absolute inset-x-0 top-0 h-[2.5px] bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
        <div class="pointer-events-none absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-blue-400/10 blur-xl group-hover:bg-blue-400/20 transition-all duration-300"></div>
        <User class="pointer-events-none absolute -right-2 -bottom-2 w-16 h-16 text-blue-600/5 group-hover:text-blue-600/10 group-hover:scale-110 transition-all duration-300" />

        <div>
          <div class="flex items-center justify-between gap-2 mb-2 sm:mb-2.5">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
              Calon Putra
            </span>
            <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-50 border border-blue-200/80 text-blue-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:bg-blue-100/80 transition-all duration-200">
              <User class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p class="text-2xl sm:text-3xl font-extrabold text-slate-900 group-hover:text-blue-600 font-mono tracking-tight tabular-nums whitespace-nowrap transition-colors">
            {{ stats.male }}
          </p>
        </div>

        <div class="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span class="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
          <span class="truncate">Pendaftar laki-laki</span>
        </div>
      </div>

      <!-- Card 3: Calon Putri -->
      <div class="group relative bg-white border border-slate-200/90 rounded-xl p-3.5 sm:p-5 overflow-hidden shadow-2xs hover:shadow-md hover:border-rose-300 hover:-translate-y-0.5 transition-all duration-200 ease-out flex flex-col justify-between">
        <div class="absolute inset-x-0 top-0 h-[2.5px] bg-gradient-to-r from-transparent via-rose-400 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
        <div class="pointer-events-none absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-rose-400/10 blur-xl group-hover:bg-rose-400/20 transition-all duration-300"></div>
        <Users class="pointer-events-none absolute -right-2 -bottom-2 w-16 h-16 text-rose-600/5 group-hover:text-rose-600/10 group-hover:scale-110 transition-all duration-300" />

        <div>
          <div class="flex items-center justify-between gap-2 mb-2 sm:mb-2.5">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
              Calon Putri
            </span>
            <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-rose-50 border border-rose-200/80 text-rose-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:bg-rose-100/80 transition-all duration-200">
              <Users class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p class="text-2xl sm:text-3xl font-extrabold text-slate-900 group-hover:text-rose-600 font-mono tracking-tight tabular-nums whitespace-nowrap transition-colors">
            {{ stats.female }}
          </p>
        </div>

        <div class="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span class="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
          <span class="truncate">Pendaftar perempuan</span>
        </div>
      </div>

      <!-- Card 4: Sabuk Pemula / Putih -->
      <div class="group relative bg-white border border-slate-200/90 rounded-xl p-3.5 sm:p-5 overflow-hidden shadow-2xs hover:shadow-md hover:border-emerald-300 hover:-translate-y-0.5 transition-all duration-200 ease-out flex flex-col justify-between">
        <div class="absolute inset-x-0 top-0 h-[2.5px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
        <div class="pointer-events-none absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-emerald-400/10 blur-xl group-hover:bg-emerald-400/20 transition-all duration-300"></div>
        <Award class="pointer-events-none absolute -right-2 -bottom-2 w-16 h-16 text-emerald-600/5 group-hover:text-emerald-600/10 group-hover:scale-110 transition-all duration-300" />

        <div>
          <div class="flex items-center justify-between gap-2 mb-2 sm:mb-2.5">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
              Sabuk Putih
            </span>
            <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-50 border border-emerald-200/80 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:bg-emerald-100/80 transition-all duration-200">
              <Award class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p class="text-2xl sm:text-3xl font-extrabold text-slate-900 group-hover:text-emerald-600 font-mono tracking-tight tabular-nums whitespace-nowrap transition-colors">
            {{ stats.whiteBelt }}
          </p>
        </div>

        <div class="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
          <span class="truncate">Murid tingkat pemula</span>
        </div>
      </div>
    </div>

    <!-- Search Toolbar (Di Bawah Card Summary) -->
    <div class="bg-white border border-slate-200 rounded-lg p-3 sm:p-3.5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
      <div class="relative w-full sm:max-w-md">
        <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          v-model="searchQuery"
          @input="currentPage = 1"
          placeholder="Cari nama calon siswa, kode registrasi, atau no WA..."
          class="w-full h-9 pl-9 pr-8 bg-slate-50 border border-slate-200 rounded-[6px] text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-satria-red focus:ring-1 focus:ring-satria-red transition-colors"
        />
        <button
          v-if="searchQuery"
          type="button"
          @click="searchQuery = ''; currentPage = 1"
          class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
          title="Hapus pencarian"
        >
          <X class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- Applicants List Card -->
    <div class="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
      <div v-if="loading && !applicants.length" class="p-12 text-center text-slate-500 text-xs">
        <Loader2 class="w-6 h-6 animate-spin text-satria-red mx-auto mb-2" />
        <span>Memuat data pendaftar...</span>
      </div>

      <div v-else-if="!applicants.length" class="p-12 text-center text-slate-500 text-xs">
        <CheckCircle2 class="w-8 h-8 text-emerald-500 mx-auto mb-2" />
        <p class="font-bold text-slate-900 text-sm">Semua Pendaftar Sudah Diproses</p>
        <p class="text-slate-500 mt-1">Tidak ada calon siswa baru yang berstatus Menunggu Review.</p>
      </div>

      <div v-else-if="!filteredApplicants.length" class="p-12 text-center text-slate-500 text-xs">
        <Search class="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p class="font-bold text-slate-900 text-sm">Tidak Ada Hasil Ditemukan</p>
        <p class="text-slate-500 mt-1">Tidak ada calon pendaftar yang cocok dengan "{{ searchQuery }}".</p>
      </div>

      <div v-else class="divide-y divide-slate-100">
        <div
          v-for="item in paginatedApplicants"
          :key="item.id"
          class="p-3.5 sm:p-4.5 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 hover:bg-slate-50/70 transition-colors"
        >
          <!-- Left Info Column with Uploaded Photo Avatar -->
          <div class="flex-1 min-w-0">
            <!-- Header: Avatar + Name + Mobile Action Buttons (Beside Name) -->
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <!-- Profile Avatar (Uploaded photo with graceful fallback) -->
                <div class="relative shrink-0">
                  <img
                    v-if="item.doc_photo_key && !avatarErrors[item.id]"
                    :src="'/api/admin/documents/' + item.doc_photo_key"
                    @error="avatarErrors[item.id] = true"
                    :alt="item.full_name"
                    class="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-slate-200 shadow-2xs"
                  />
                  <div
                    v-else
                    class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-satria-red/10 border border-satria-red/20 text-satria-red flex items-center justify-center font-bold font-mono text-xs sm:text-sm shrink-0 shadow-2xs"
                  >
                    {{ item.full_name?.charAt(0) || 'A' }}
                  </div>
                </div>

                <div class="min-w-0">
                  <span class="font-semibold text-slate-900 text-xs sm:text-sm truncate block">{{ item.full_name }}</span>
                </div>
              </div>

              <!-- Mobile Action Buttons (Beside Name, identical style to MembersView.vue) -->
              <div class="flex md:hidden items-center gap-1 shrink-0">
                <button
                  type="button"
                  @click="openDocumentPreview(item)"
                  class="p-1.5 text-slate-400 hover:text-satria-red hover:bg-slate-100 rounded transition-colors"
                  title="Lihat Akta Kelahiran"
                >
                  <FileText class="w-4 h-4 text-satria-red" />
                </button>
                <button
                  type="button"
                  @click="verifyApplicant(item.id)"
                  :disabled="actionLoading"
                  class="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors disabled:opacity-40"
                  title="Terima Pendaftaran"
                >
                  <Check class="w-4 h-4 text-emerald-600" />
                </button>
                <button
                  type="button"
                  @click="rejectApplicant(item.id)"
                  :disabled="actionLoading"
                  class="p-1.5 text-slate-400 hover:text-satria-red hover:bg-red-50 rounded transition-colors disabled:opacity-40"
                  title="Batal / Tolak Pendaftaran"
                >
                  <X class="w-4 h-4 text-satria-red" />
                </button>
              </div>
            </div>

            <!-- Detail Information Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-0.5 text-xs text-slate-500 font-mono mt-2 sm:mt-1.5 pl-11.5 sm:pl-13">
              <p>Tgl Lahir: <span class="text-slate-800 font-semibold whitespace-nowrap">{{ item.birth_date }}</span></p>
              <p>Sabuk: <span class="text-[#8C6918] font-semibold whitespace-nowrap">{{ item.belt_rank || 'Putih' }}</span></p>
              <p>WhatsApp: 
                <a
                  :href="'https://wa.me/' + cleanPhone(item.phone_number)"
                  target="_blank"
                  class="text-emerald-700 font-medium hover:underline whitespace-nowrap"
                >
                  {{ item.phone_number }}
                </a>
              </p>
              <p class="sm:col-span-2 md:col-span-3 truncate font-sans text-slate-600">Alamat: <span class="text-slate-700">{{ item.address }}</span></p>
            </div>
          </div>

          <!-- Desktop Action Buttons (Identical style to MembersView.vue) -->
          <div class="hidden md:inline-flex items-center gap-1.5 shrink-0 self-center">
            <button
              type="button"
              @click="openDocumentPreview(item)"
              class="p-1.5 text-slate-400 hover:text-satria-red hover:bg-slate-100 rounded transition-colors"
              title="Lihat Akta Kelahiran"
            >
              <FileText class="w-4 h-4 text-satria-red" />
            </button>
            <button
              type="button"
              @click="verifyApplicant(item.id)"
              :disabled="actionLoading"
              class="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors disabled:opacity-40"
              title="Terima Pendaftaran"
            >
              <Check class="w-4 h-4 text-emerald-600" />
            </button>
            <button
              type="button"
              @click="rejectApplicant(item.id)"
              :disabled="actionLoading"
              class="p-1.5 text-slate-400 hover:text-satria-red hover:bg-red-50 rounded transition-colors disabled:opacity-40"
              title="Batal / Tolak Pendaftaran"
            >
              <X class="w-4 h-4 text-satria-red" />
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination Toolbar -->
      <div
        v-if="filteredApplicants.length > 0"
        class="p-3 sm:px-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
      >
        <div class="text-slate-500 whitespace-nowrap order-2 sm:order-1">
          Menampilkan <span class="font-semibold text-slate-800 font-mono">{{ startRecord }}</span> - <span class="font-semibold text-slate-800 font-mono">{{ endRecord }}</span> dari <span class="font-semibold text-slate-800 font-mono">{{ totalRecords }}</span> calon
        </div>

        <div class="flex items-center gap-1.5 order-1 sm:order-2">
          <button
            type="button"
            @click="currentPage--"
            :disabled="currentPage <= 1"
            class="h-8 px-2.5 rounded-[5px] bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors whitespace-nowrap"
          >
            <ChevronLeft class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">Sebelumnya</span>
          </button>
          
          <div class="flex items-center gap-1 font-mono">
            <button
              v-for="page in totalPages"
              :key="page"
              @click="currentPage = page"
              :class="[
                'w-8 h-8 rounded-[5px] font-semibold transition-colors flex items-center justify-center',
                currentPage === page
                  ? 'bg-satria-red text-white font-bold shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              ]"
            >
              {{ page }}
            </button>
          </div>

          <button
            type="button"
            @click="currentPage++"
            :disabled="currentPage >= totalPages"
            class="h-8 px-2.5 rounded-[5px] bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors whitespace-nowrap"
          >
            <span class="hidden sm:inline">Selanjutnya</span>
            <ChevronRight class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>

    <!-- The Dojo Darkroom Document Modal -->
    <DocumentModal
      :is-open="modalOpen"
      :doc-key="selectedDocKey"
      :member="selectedApplicant"
      :action-loading="actionLoading"
      @close="closeModal"
      @verify="(applicant) => { verifyApplicant(applicant.id); closeModal(); }"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { apiRequest } from '../../utils/api.js';
import { showConfirm, toastSuccess, toastError } from '../../utils/swal.js';
import {
  RefreshCw,
  Loader2,
  CheckCircle2,
  MessageSquare,
  FileText,
  Check,
  X,
  Clock,
  User,
  Users,
  Award,
  ShieldCheck,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-vue-next';
import DocumentModal from '../../components/DocumentModal.vue';

const emit = defineEmits(['pending-count-updated']);

const applicants = ref([]);
const loading = ref(false);
const actionLoading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const pageSize = ref(5);
const avatarErrors = reactive({});

const stats = computed(() => {
  const total = applicants.value.length;
  const male = applicants.value.filter(a => a.gender === 'Laki-laki').length;
  const female = applicants.value.filter(a => a.gender === 'Perempuan').length;
  const whiteBelt = applicants.value.filter(a => (a.belt_rank || 'Putih') === 'Putih').length;
  return { total, male, female, whiteBelt };
});

const filteredApplicants = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return applicants.value;
  return applicants.value.filter((item) => {
    const name = (item.full_name || '').toLowerCase();
    const code = (item.registration_code || '').toLowerCase();
    const phone = (item.phone_number || '').toLowerCase();
    const address = (item.address || '').toLowerCase();
    return name.includes(query) || code.includes(query) || phone.includes(query) || address.includes(query);
  });
});

const totalPages = computed(() => Math.max(1, Math.ceil(filteredApplicants.value.length / pageSize.value)));

const paginatedApplicants = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredApplicants.value.slice(start, start + pageSize.value);
});

const totalRecords = computed(() => filteredApplicants.value.length);
const startRecord = computed(() => totalRecords.value === 0 ? 0 : (currentPage.value - 1) * pageSize.value + 1);
const endRecord = computed(() => Math.min(currentPage.value * pageSize.value, totalRecords.value));

watch(totalPages, (newVal) => {
  if (currentPage.value > newVal) {
    currentPage.value = Math.max(1, newVal);
  }
});

const modalOpen = ref(false);
const selectedDocKey = ref('');
const selectedApplicant = ref(null);

async function fetchApplicants() {
  loading.value = true;
  try {
    const data = await apiRequest('/api/admin/applicants');
    applicants.value = data.applicants || [];
    emit('pending-count-updated', applicants.value.length);
  } catch (err) {
    toastError(err.message || 'Gagal memuat data pendaftar.');
  } finally {
    loading.value = false;
  }
}

function openDocumentPreview(applicant) {
  selectedApplicant.value = applicant;
  selectedDocKey.value = applicant.doc_birth_cert_key;
  modalOpen.value = true;
}

function closeModal() {
  modalOpen.value = false;
  selectedDocKey.value = '';
  selectedApplicant.value = null;
}

async function verifyApplicant(id) {
  const confirmed = await showConfirm({
    title: 'Terima Calon Anggota?',
    text: 'Calon siswa ini akan diverifikasi dan dipindahkan ke daftar anggota aktif.',
    confirmButtonText: 'Ya, Terima',
    cancelButtonText: 'Batal',
    confirmButtonColor: '#059669',
    icon: 'question',
  });
  if (!confirmed) return;

  actionLoading.value = true;
  try {
    await apiRequest(`/api/admin/applicants/${id}/verify`, { method: 'PUT' });
    toastSuccess('Calon anggota berhasil diterima & diverifikasi!');
    await fetchApplicants();
  } catch (err) {
    toastError(err.message || 'Gagal memverifikasi pendaftar.');
  } finally {
    actionLoading.value = false;
  }
}

async function rejectApplicant(id) {
  const confirmed = await showConfirm({
    title: 'Tolak Pendaftaran?',
    text: 'Apakah Anda yakin ingin menolak calon pendaftar ini?',
    confirmButtonText: 'Ya, Tolak',
    cancelButtonText: 'Batal',
    confirmButtonColor: '#dc2626',
    icon: 'warning',
  });
  if (!confirmed) return;

  actionLoading.value = true;
  try {
    await apiRequest(`/api/admin/applicants/${id}/reject`, { method: 'PUT' });
    toastSuccess('Pendaftaran calon siswa berhasil ditolak.');
    await fetchApplicants();
  } catch (err) {
    toastError(err.message || 'Gagal menolak pendaftar.');
  } finally {
    actionLoading.value = false;
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
  fetchApplicants();
});
</script>
