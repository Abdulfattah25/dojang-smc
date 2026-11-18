<template>
  <div class="space-y-5 sm:space-y-6">
    <!-- View Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
      <div>
        <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-brand whitespace-nowrap">
          Laporan & Rekapitulasi Data
        </h2>
        <p class="text-xs sm:text-sm text-slate-500 mt-0.5">
          Filter dan cetak laporan data anggota
        </p>
      </div>

      <!-- Export Action Buttons (Centered on mobile) -->
      <div class="flex items-center justify-center gap-2.5 w-full sm:w-auto shrink-0">
        <button
          type="button"
          @click="handleExportExcel"
          :disabled="loading || !records.length"
          class="flex-1 sm:flex-initial h-9 px-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-[6px] flex items-center justify-center gap-1.5 transition-colors shadow-2xs whitespace-nowrap disabled:opacity-50"
        >
          <FileSpreadsheet class="w-4 h-4 text-emerald-200 shrink-0" />
          <span>Ekspor Excel</span>
        </button>

        <button
          type="button"
          @click="handleExportPdf"
          :disabled="loading || !records.length"
          class="flex-1 sm:flex-initial h-9 px-3.5 bg-satria-red hover:bg-satria-red-hover text-white font-bold text-xs rounded-[6px] flex items-center justify-center gap-1.5 transition-colors shadow-satria whitespace-nowrap disabled:opacity-50"
        >
          <Printer class="w-4 h-4 shrink-0" />
          <span>Cetak PDF</span>
        </button>
      </div>
    </div>

    <!-- Multi-Criteria Filter Bar -->
    <div class="bg-white border border-slate-200 rounded-lg p-3.5 sm:p-5 shadow-2xs space-y-4">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        <!-- Start Date -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Dari Tanggal</label>
          <input
            type="date"
            v-model="filters.start_date"
            class="w-full h-10 px-2.5 sm:px-3 bg-slate-50 border border-slate-300 rounded-[6px] text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-satria-red focus:ring-1 focus:ring-satria-red font-mono"
          />
        </div>

        <!-- End Date -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Sampai Tanggal</label>
          <input
            type="date"
            v-model="filters.end_date"
            class="w-full h-10 px-2.5 sm:px-3 bg-slate-50 border border-slate-300 rounded-[6px] text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-satria-red focus:ring-1 focus:ring-satria-red font-mono"
          />
        </div>

        <!-- Payment Status -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Status Pembayaran</label>
          <select
            v-model="filters.payment_status"
            class="w-full h-10 px-2.5 sm:px-3 bg-slate-50 border border-slate-300 rounded-[6px] text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-satria-red focus:ring-1 focus:ring-satria-red"
          >
            <option value="all">Semua Status</option>
            <option value="paid">Lunas (Paid)</option>
            <option value="unpaid">Belum Bayar (Unpaid)</option>
          </select>
        </div>

        <!-- Registration Status -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Status Pendaftaran</label>
          <select
            v-model="filters.registration_status"
            class="w-full h-10 px-2.5 sm:px-3 bg-slate-50 border border-slate-300 rounded-[6px] text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-satria-red focus:ring-1 focus:ring-satria-red"
          >
            <option value="all">Semua Status</option>
            <option value="verified">Verified (Aktif)</option>
            <option value="pending">Pending (Menunggu)</option>
            <option value="rejected">Rejected (Ditolak)</option>
          </select>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row items-center justify-between pt-2 border-t border-slate-100 gap-2.5">

        <button
          type="button"
          @click="fetchReportData"
          class="w-full sm:w-auto h-9 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-[6px] flex items-center justify-center gap-1.5 transition-colors shadow-sm whitespace-nowrap active:translate-y-[1px]"
        >
          <Filter class="w-3.5 h-3.5" />
          <span>Terapkan Filter</span>
        </button>
      </div>
    </div>

    <!-- Preview Table -->
    <div class="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
      <div v-if="loading" class="p-12 text-center text-slate-500 text-xs">
        <Loader2 class="w-6 h-6 animate-spin text-satria-red mx-auto mb-2" />
        <span>Menghasilkan rekapitulasi data...</span>
      </div>

      <div v-else-if="!records.length" class="p-12 text-center text-slate-500 text-xs">
        Tidak ada data yang memenuhi kriteria filter di atas.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-50/90 text-slate-500 border-b border-slate-200 font-mono tracking-wider uppercase text-xs">
              <th class="p-3 pl-4 whitespace-nowrap">No</th>
              <th class="p-3 whitespace-nowrap">Kode / Nama</th>
              <th class="p-3 whitespace-nowrap">Gender</th>
              <th class="p-3 whitespace-nowrap">WhatsApp</th>
              <th class="p-3 whitespace-nowrap">Sabuk</th>
              <th class="p-3 whitespace-nowrap">Status Reg</th>
              <th class="p-3 whitespace-nowrap">Status Bayar</th>
              <th class="p-3 whitespace-nowrap">Nominal</th>
              <th class="p-3 pr-4 whitespace-nowrap">Tgl Daftar</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700">
            <tr
              v-for="(r, idx) in records"
              :key="r.id"
              class="hover:bg-slate-50/70 transition-colors"
            >
              <td class="p-3 pl-4 font-mono text-slate-400 whitespace-nowrap">{{ idx + 1 }}</td>
              <td class="p-3">
                <span class="font-mono text-[#8C6918] font-bold block whitespace-nowrap">{{ r.registration_code }}</span>
                <span class="text-slate-900 font-semibold whitespace-nowrap">{{ r.full_name }}</span>
              </td>
              <td class="p-3 whitespace-nowrap">{{ r.gender === 'Laki-laki' ? 'L' : 'P' }}</td>
              <td class="p-3 font-mono text-slate-600 whitespace-nowrap">{{ r.phone_number }}</td>
              <td class="p-3 whitespace-nowrap">{{ r.belt_rank || 'Putih' }}</td>
              <td class="p-3 whitespace-nowrap"><StatusBadge :status="r.registration_status" /></td>
              <td class="p-3 whitespace-nowrap"><StatusBadge :status="r.payment_status" type="payment" /></td>
              <td class="p-3 font-mono font-semibold text-slate-900 whitespace-nowrap">
                {{ r.payment_amount ? 'Rp ' + Number(r.payment_amount).toLocaleString('id-ID') : '-' }}
              </td>
              <td class="p-3 pr-4 font-mono text-slate-500 whitespace-nowrap">
                {{ formatWitaDate(r.created_at) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { apiRequest } from '../../utils/api.js';
import { toastSuccess, toastError } from '../../utils/swal.js';
import { formatWitaDate } from '../../utils/date.js';
import { FileSpreadsheet, Printer, Filter, Loader2 } from 'lucide-vue-next';
import StatusBadge from '../../components/common/StatusBadge.vue';

const loading = ref(false);
const records = ref([]);

const filters = reactive({
  start_date: '',
  end_date: '',
  registration_status: 'all',
  payment_status: 'all',
});

async function fetchReportData() {
  loading.value = true;
  try {
    const params = new URLSearchParams();
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);
    if (filters.registration_status) params.append('registration_status', filters.registration_status);
    if (filters.payment_status) params.append('payment_status', filters.payment_status);

    const data = await apiRequest(`/api/admin/reports?${params.toString()}`);
    records.value = data.records || [];
  } catch (err) {
    toastError(err.message || 'Gagal memuat rekap laporan.');
  } finally {
    loading.value = false;
  }
}

async function handleExportExcel() {
  try {
    const { exportMembersToExcel } = await import('../../utils/exportExcel.js');
    exportMembersToExcel(records.value, `Rekap_Anggota_SMC_${new Date().toISOString().substring(0, 10)}.xlsx`);
    toastSuccess('Laporan Excel berhasil diunduh!');
  } catch (err) {
    toastError('Gagal mengekspor berkas Excel.');
  }
}

async function handleExportPdf() {
  try {
    const { exportMembersToPdf } = await import('../../utils/exportPdf.js');
    exportMembersToPdf(records.value, {
      startDate: filters.start_date,
      endDate: filters.end_date,
    });
    toastSuccess('Laporan PDF berhasil disiapkan!');
  } catch (err) {
    toastError('Gagal mengekspor berkas PDF.');
  }
}

onMounted(() => {
  fetchReportData();
});
</script>
