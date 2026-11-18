<template>
  <div class="space-y-5 sm:space-y-6">
    <!-- View Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-brand whitespace-nowrap">
          Pencatatan Status Pembayaran
        </h2>
        <p class="text-xs sm:text-sm text-slate-500 mt-0.5">
          Kelola pembayaran biaya pendaftaran & iuran bulanan siswa Satria Muda Club.
        </p>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <select
          v-model="statusFilter"
          @change="currentPage = 1; fetchPayments()"
          class="h-9 px-3 bg-white border border-slate-200 rounded-[6px] text-xs text-slate-800 focus:outline-none focus:border-satria-red shadow-2xs whitespace-nowrap"
        >
          <option value="">Semua Status</option>
          <option value="unpaid">Belum Bayar (Unpaid)</option>
          <option value="paid">Lunas (Paid)</option>
        </select>
      </div>
    </div>

    <!-- Payments List -->
    <div class="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
      <div v-if="loading && !payments.length" class="p-12 text-center text-slate-500 text-xs">
        <Loader2 class="w-6 h-6 animate-spin text-satria-red mx-auto mb-2" />
        <span>Memuat data transaksi...</span>
      </div>

      <div v-else-if="!payments.length" class="p-12 text-center text-slate-500 text-xs">
        Tidak ada data pembayaran yang sesuai dengan kriteria.
      </div>

      <div v-else>
        <!-- Desktop Table View (Hidden on mobile) -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-slate-50/90 text-slate-500 border-b border-slate-200 font-mono tracking-wider uppercase text-xs">
                <th class="p-3.5 pl-5">Kode / Siswa</th>
                <th class="p-3.5">Status</th>
                <th class="p-3.5">Nominal Bayar</th>
                <th class="p-3.5">Metode Bayar</th>
                <th class="p-3.5">Tanggal Bayar (WITA)</th>
                <th class="p-3.5">Catatan</th>
                <th class="p-3.5 pr-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
              <tr
                v-for="p in payments"
                :key="p.id"
                class="hover:bg-slate-50/70 transition-colors"
              >
                <td class="p-3.5 pl-5">
                  <span class="font-mono text-[#8C6918] font-bold block text-xs whitespace-nowrap">{{ p.registration_code }}</span>
                  <span class="text-slate-900 font-semibold text-xs sm:text-sm">{{ p.full_name }}</span>
                </td>

                <td class="p-3.5">
                  <StatusBadge :status="p.payment_status" type="payment" />
                </td>

                <td class="p-3.5">
                  <span class="font-mono font-bold text-slate-900 text-xs sm:text-sm whitespace-nowrap">
                    Rp {{ Number(p.payment_amount || 0).toLocaleString('id-ID') }}
                  </span>
                </td>

                <td class="p-3.5">
                  <span v-if="p.payment_method" class="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px] whitespace-nowrap">
                    {{ p.payment_method }}
                  </span>
                  <span v-else class="text-slate-400">-</span>
                </td>

                <td class="p-3.5 font-mono text-slate-600 whitespace-nowrap">
                  {{ formatWitaDate(p.payment_date) }}
                </td>

                <td class="p-3.5 text-slate-500 max-w-[180px] truncate">
                  {{ p.payment_notes || '-' }}
                </td>

                <td class="p-3.5 pr-5 text-right">
                  <button
                    type="button"
                    @click="openPaymentModal(p)"
                    class="h-8 px-3 rounded bg-amber-50 hover:bg-amber-100 border border-amber-300 text-[#8C6918] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
                  >
                    <CreditCard class="w-3.5 h-3.5" />
                    <span>Catat</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Proportional Card List (Visible on mobile) -->
        <div class="md:hidden divide-y divide-slate-100">
          <div
            v-for="p in payments"
            :key="p.id"
            class="p-3.5 sm:p-4 space-y-2.5 hover:bg-slate-50/70 transition-colors"
          >
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2 min-w-0">
                <span class="font-mono text-xs font-bold text-[#8C6918] bg-amber-50 px-2 py-0.5 rounded border border-amber-200 whitespace-nowrap shrink-0">
                  {{ p.registration_code }}
                </span>
                <span class="font-bold text-slate-900 text-sm truncate">{{ p.full_name }}</span>
              </div>
              <StatusBadge :status="p.payment_status" type="payment" />
            </div>

            <div class="flex items-center justify-between gap-2 text-xs">
              <div>
                <span class="text-slate-400 text-[11px] block">Nominal:</span>
                <span class="font-mono font-bold text-slate-900 text-sm whitespace-nowrap">
                  Rp {{ Number(p.payment_amount || 0).toLocaleString('id-ID') }}
                </span>
              </div>

              <div class="text-right">
                <span class="text-slate-400 text-[11px] block">Metode / Tanggal:</span>
                <span class="font-mono text-slate-600 text-xs whitespace-nowrap">
                  {{ p.payment_method || 'Tunai' }} • {{ p.payment_date ? p.payment_date.substring(0, 10) : '-' }}
                </span>
              </div>
            </div>

            <p v-if="p.payment_notes" class="text-xs text-slate-500 truncate bg-slate-50 p-2 rounded border border-slate-100">
              Catatan: {{ p.payment_notes }}
            </p>

            <button
              type="button"
              @click="openPaymentModal(p)"
              class="w-full h-8 px-3 rounded bg-amber-50 hover:bg-amber-100 border border-amber-300 text-[#8C6918] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <CreditCard class="w-3.5 h-3.5" />
              <span>Catat Transaksi</span>
            </button>
          </div>
        </div>

        <!-- Pagination Controls -->
        <div
          v-if="totalRecords > 0"
          class="p-3.5 sm:px-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
        >
          <div class="text-slate-500 whitespace-nowrap order-2 sm:order-1">
            Menampilkan <span class="font-semibold text-slate-800 font-mono">{{ startRecord }}</span> - <span class="font-semibold text-slate-800 font-mono">{{ endRecord }}</span> dari <span class="font-semibold text-slate-800 font-mono">{{ totalRecords }}</span> transaksi
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
    </div>

    <!-- Record Payment Modal -->
    <div
      v-if="activePayment"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs"
    >
      <div class="w-full max-w-md bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xl text-slate-800">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div>
            <h3 class="font-bold text-base text-slate-900">Catat Transaksi Pembayaran</h3>
            <span class="text-xs font-mono text-[#8C6918]">{{ activePayment.full_name }} ({{ activePayment.registration_code }})</span>
          </div>
          <button @click="activePayment = null" class="text-slate-400 hover:text-slate-700">
            <X class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="savePaymentRecord" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Status Pembayaran</label>
            <select
              v-model="paymentForm.payment_status"
              class="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-[6px] text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-satria-red focus:ring-1 focus:ring-satria-red"
            >
              <option value="paid">Lunas (Paid)</option>
              <option value="unpaid">Belum Bayar (Unpaid)</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Nominal Pembayaran (Rp)</label>
            <input
              type="number"
              v-model.number="paymentForm.payment_amount"
              min="0"
              step="5000"
              placeholder="Contoh: 250000"
              required
              class="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-[6px] text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-satria-red focus:ring-1 focus:ring-satria-red font-mono"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Tanggal Pembayaran</label>
              <input
                type="date"
                v-model="paymentForm.payment_date"
                required
                class="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-[6px] text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-satria-red focus:ring-1 focus:ring-satria-red font-mono"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Metode</label>
              <select
                v-model="paymentForm.payment_method"
                class="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-[6px] text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-satria-red focus:ring-1 focus:ring-satria-red"
              >
                <option value="Tunai">Tunai</option>
                <option value="Transfer">Transfer Bank</option>
                <option value="QRIS">QRIS</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Catatan Transaksi</label>
            <textarea
              v-model="paymentForm.payment_notes"
              rows="2"
              placeholder="Contoh: Pembayaran pendaftaran + seragam dobok..."
              class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-[6px] text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-satria-red focus:ring-1 focus:ring-satria-red"
            ></textarea>
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              @click="activePayment = null"
              class="px-4 h-9 border border-slate-300 rounded-[6px] text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="px-4 h-9 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-[6px] flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              <Loader2 v-if="saving" class="w-3.5 h-3.5 animate-spin" />
              <span>Simpan Pembayaran</span>
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { apiRequest } from '../../utils/api.js';
import { toastSuccess, toastError } from '../../utils/swal.js';
import { getWitaToday, formatWitaDate } from '../../utils/date.js';
import { RefreshCw, Loader2, CreditCard, ChevronLeft, ChevronRight, X } from 'lucide-vue-next';
import StatusBadge from '../../components/common/StatusBadge.vue';

const payments = ref([]);
const loading = ref(false);
const saving = ref(false);
const statusFilter = ref('');

const currentPage = ref(1);
const pageSize = ref(10);
const totalRecords = ref(0);

const totalPages = computed(() => Math.max(1, Math.ceil(totalRecords.value / pageSize.value)));
const startRecord = computed(() => totalRecords.value === 0 ? 0 : (currentPage.value - 1) * pageSize.value + 1);
const endRecord = computed(() => Math.min(currentPage.value * pageSize.value, totalRecords.value));

watch(currentPage, () => {
  fetchPayments();
});

const activePayment = ref(null);
const paymentForm = reactive({
  id: null,
  payment_status: 'paid',
  payment_amount: 250000,
  payment_date: getWitaToday(),
  payment_method: 'Tunai',
  payment_notes: '',
});

async function fetchPayments() {
  loading.value = true;
  try {
    const params = new URLSearchParams();
    params.append('page', String(currentPage.value));
    params.append('limit', String(pageSize.value));
    if (statusFilter.value) params.append('status', statusFilter.value);

    const data = await apiRequest(`/api/admin/payments?${params.toString()}`);
    payments.value = data.payments || [];
    totalRecords.value = data.total || 0;
  } catch (err) {
    toastError(err.message || 'Gagal memuat data pembayaran.');
  } finally {
    loading.value = false;
  }
}

function openPaymentModal(item) {
  activePayment.value = item;
  paymentForm.id = item.id;
  paymentForm.payment_status = item.payment_status || 'paid';
  paymentForm.payment_amount = item.payment_amount || 250000;
  paymentForm.payment_date = item.payment_date ? item.payment_date.substring(0, 10) : getWitaToday();
  paymentForm.payment_method = item.payment_method || 'Tunai';
  paymentForm.payment_notes = item.payment_notes || '';
}

async function savePaymentRecord() {
  saving.value = true;
  try {
    await apiRequest(`/api/admin/payments/${paymentForm.id}`, {
      method: 'PUT',
      body: paymentForm,
    });
    activePayment.value = null;
    toastSuccess('Transaksi pembayaran berhasil disimpan!');
    await fetchPayments();
  } catch (err) {
    toastError(err.message || 'Gagal menyimpan transaksi pembayaran.');
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  fetchPayments();
});
</script>
