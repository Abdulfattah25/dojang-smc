<template>
  <div class="space-y-4 sm:space-y-5">
    <!-- View Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <div class="flex items-center gap-2">
          <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-brand whitespace-nowrap">
            Manajemen Akun Pengurus
          </h2>
        </div>
        <p class="text-xs sm:text-sm text-slate-500 mt-0.5">
          Kelola kredensial dan hak akses administrator sistem.
        </p>
      </div>

      <!-- Action Buttons (Simple & Minimalist on Mobile) -->
      <div class="flex items-center gap-2 self-stretch sm:self-auto">
        <button
          type="button"
          @click="openWhatsappModal"
          class="flex-1 sm:flex-initial h-8 px-2.5 sm:px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-emerald-700 font-semibold text-xs rounded-[6px] flex items-center justify-center gap-1.5 transition-all shadow-2xs active:scale-[0.98] whitespace-nowrap"
          title="Atur Nomor WhatsApp Pengurus"
        >
          <!-- Authentic WhatsApp Brand SVG Icon -->
          <svg class="w-3.5 h-3.5 fill-[#25D366] shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          <span>No. WhatsApp</span>
        </button>

        <button
          type="button"
          @click="openAddModal"
          class="flex-1 sm:flex-initial h-8 px-2.5 sm:px-3 bg-satria-red hover:bg-satria-red-hover text-white font-bold text-xs rounded-[6px] flex items-center justify-center gap-1.5 transition-all shadow-2xs active:scale-[0.98] whitespace-nowrap"
        >
          <UserPlus class="w-3.5 h-3.5" />
          <span>Tambah Admin</span>
        </button>
      </div>
    </div>

    <!-- Users Table & Mobile Card List -->
    <div class="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
      <div v-if="loading" class="p-12 text-center text-slate-500 text-xs">
        <Loader2 class="w-6 h-6 animate-spin text-satria-red mx-auto mb-2" />
        <span>Memuat data pengurus...</span>
      </div>

      <div v-else>
        <!-- Desktop Table View (>= md) -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-slate-50/90 text-slate-500 border-b border-slate-200 font-mono tracking-wider uppercase text-xs">
                <th class="p-3.5 pl-5 whitespace-nowrap">Pengurus</th>
                <th class="p-3.5 whitespace-nowrap">Username</th>
                <th class="p-3.5 whitespace-nowrap">Peran (Role)</th>
                <th class="p-3.5 whitespace-nowrap">Status Akun</th>
                <th class="p-3.5 whitespace-nowrap">Terdaftar Sejak</th>
                <th class="p-3.5 pr-5 text-right whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
              <tr
                v-for="u in users"
                :key="u.id"
                class="hover:bg-slate-50/70 transition-colors"
              >
                <td class="p-3.5 pl-5">
                  <div class="flex items-center gap-3 min-w-0">
                    <div
                      :class="[
                        'w-8 h-8 rounded-full flex items-center justify-center font-bold font-mono text-xs shrink-0 shadow-2xs border',
                        u.role === 'superadmin'
                          ? 'bg-amber-50 border-amber-300 text-[#8C6918]'
                          : 'bg-slate-100 border-slate-200 text-slate-700'
                      ]"
                    >
                      {{ u.full_name?.charAt(0) || 'A' }}
                    </div>
                    <div class="min-w-0">
                      <span class="font-semibold text-slate-900 text-xs sm:text-sm block truncate">
                        {{ u.full_name }}
                      </span>
                      <span v-if="u.id === currentUserId" class="text-[10px] text-satria-red font-mono font-bold block">
                        (Sesi Anda)
                      </span>
                    </div>
                  </div>
                </td>

                <td class="p-3.5 font-mono text-slate-600 whitespace-nowrap">
                  @{{ u.username }}
                </td>

                <td class="p-3.5 whitespace-nowrap">
                  <span
                    :class="[
                      'inline-block px-2 py-0.5 rounded text-[11px] font-bold uppercase font-mono whitespace-nowrap',
                      u.role === 'superadmin' ? 'bg-amber-50 text-[#8C6918] border border-amber-300' : 'bg-slate-100 text-slate-700 border border-slate-200'
                    ]"
                  >
                    {{ u.role }}
                  </span>
                </td>

                <td class="p-3.5 whitespace-nowrap">
                  <span
                    :class="[
                      'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold whitespace-nowrap',
                      u.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                    ]"
                  >
                    <span :class="['w-1.5 h-1.5 rounded-full shrink-0', u.is_active ? 'bg-emerald-600' : 'bg-red-600']"></span>
                    {{ u.is_active ? 'Aktif' : 'Nonaktif' }}
                  </span>
                </td>

                <td class="p-3.5 font-mono text-slate-500 whitespace-nowrap">
                  {{ u.created_at ? u.created_at.substring(0, 10) : '-' }}
                </td>

                <td class="p-3.5 pr-5 text-right whitespace-nowrap">
                  <div class="inline-flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      @click="openEditModal(u)"
                      class="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                      title="Ubah Data / Password"
                    >
                      <KeyRound class="w-4 h-4" />
                    </button>
                    <button
                      v-if="u.id !== currentUserId"
                      type="button"
                      @click="deleteUser(u.id)"
                      class="p-1.5 text-slate-400 hover:text-satria-red hover:bg-red-50 rounded transition-colors"
                      title="Hapus Akun"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Card List View (Identical to MembersView & ApplicantsView) -->
        <div class="md:hidden divide-y divide-slate-100">
          <div
            v-for="u in users"
            :key="u.id"
            class="p-3.5 sm:p-4 space-y-2.5 hover:bg-slate-50/70 transition-colors"
          >
            <!-- Card Header: Avatar, Name, Actions (Beside Name) -->
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2.5 min-w-0">
                <!-- Avatar Initial -->
                <div
                  :class="[
                    'w-9 h-9 rounded-full flex items-center justify-center font-bold font-mono text-xs shrink-0 shadow-2xs border',
                    u.role === 'superadmin'
                      ? 'bg-amber-50 border-amber-300 text-[#8C6918]'
                      : 'bg-slate-100 border-slate-200 text-slate-700'
                  ]"
                >
                  {{ u.full_name?.charAt(0) || 'A' }}
                </div>
                <div class="min-w-0">
                  <div class="flex items-center gap-1.5">
                    <span class="font-semibold text-slate-900 text-xs sm:text-sm truncate block mt-0.5">
                      {{ u.full_name }}
                    </span>
                    <span v-if="u.id === currentUserId" class="text-[10px] text-satria-red font-mono font-bold whitespace-nowrap">
                      (Anda)
                    </span>
                  </div>
                </div>
              </div>

              <!-- Mobile Actions (Beside Name) -->
              <div class="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  @click="openEditModal(u)"
                  class="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                  title="Ubah Data / Password"
                >
                  <KeyRound class="w-4 h-4" />
                </button>
                <button
                  v-if="u.id !== currentUserId"
                  type="button"
                  @click="deleteUser(u.id)"
                  class="p-1.5 text-slate-400 hover:text-satria-red hover:bg-red-50 rounded transition-colors"
                  title="Hapus Akun"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Card Badges: Role & Status -->
            <div class="flex items-center gap-2 flex-wrap text-xs">
              <span
                :class="[
                  'inline-block px-2 py-0.5 rounded text-[11px] font-bold uppercase font-mono whitespace-nowrap',
                  u.role === 'superadmin' ? 'bg-amber-50 text-[#8C6918] border border-amber-300' : 'bg-slate-100 text-slate-700 border border-slate-200'
                ]"
              >
                {{ u.role }}
              </span>
              <span
                :class="[
                  'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold whitespace-nowrap',
                  u.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                ]"
              >
                <span :class="['w-1.5 h-1.5 rounded-full shrink-0', u.is_active ? 'bg-emerald-600' : 'bg-red-600']"></span>
                {{ u.is_active ? 'Aktif' : 'Nonaktif' }}
              </span>
            </div>

            <!-- Card Info Details Grid (Consistent hierarchy with MembersView) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-slate-500 font-mono">
              <p>Username: <span class="text-slate-800 font-semibold font-mono">@{{ u.username }}</span></p>
              <p>Terdaftar: <span class="text-slate-700">{{ u.created_at ? u.created_at.substring(0, 10) : '-' }}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Form (Tambah / Edit Admin) -->
    <Teleport to="body">
      <div
        v-if="showModal"
        @click.self="showModal = false"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 p-0 sm:p-4 backdrop-blur-xs transition-opacity"
      >
        <div class="w-full max-w-md bg-white border-t sm:border border-slate-200 rounded-t-2xl sm:rounded-xl p-5 sm:p-6 shadow-2xl text-slate-800 max-h-[92vh] overflow-y-auto">
          
          <!-- Mobile Pull Handle -->
          <div class="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-3 sm:hidden"></div>

          <!-- Modal Header -->
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h3 class="font-bold text-base text-slate-900">
              {{ isEditing ? 'Ubah Akun / Reset Password' : 'Buat Akun Admin Baru' }}
            </h3>
            <button @click="showModal = false" class="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100">
              <X class="w-5 h-5" />
            </button>
          </div>

          <form @submit.prevent="submitUserForm" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap Pengurus</label>
              <input
                type="text"
                v-model="userForm.full_name"
                required
                placeholder="Contoh: Budi Santoso"
                class="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-[6px] text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-satria-red focus:ring-1 focus:ring-satria-red"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Username Login</label>
              <input
                type="text"
                v-model="userForm.username"
                :disabled="isEditing"
                required
                placeholder="Contoh: budi_smc"
                class="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-[6px] text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-satria-red focus:ring-1 focus:ring-satria-red disabled:opacity-50 font-mono"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">
                Kata Sandi {{ isEditing ? '(Kosongkan bila tidak diubah)' : '' }}
              </label>
              <input
                type="password"
                v-model="userForm.password"
                :required="!isEditing"
                placeholder="Minimal 6 karakter"
                class="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-[6px] text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-satria-red focus:ring-1 focus:ring-satria-red"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Peran (Role)</label>
                <select
                  v-model="userForm.role"
                  class="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-[6px] text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-satria-red focus:ring-1 focus:ring-satria-red"
                >
                  <option value="admin">Admin</option>
                  <option value="superadmin">Superadmin</option>
                </select>
              </div>

              <div v-if="isEditing">
                <label class="block text-xs font-semibold text-slate-700 mb-1">Status Keaktifan</label>
                <select
                  v-model="userForm.is_active"
                  class="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-[6px] text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-satria-red focus:ring-1 focus:ring-satria-red"
                >
                  <option :value="1">Aktif</option>
                  <option :value="0">Nonaktif</option>
                </select>
              </div>
            </div>

            <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                @click="showModal = false"
                class="px-4 h-9 border border-slate-300 rounded-[6px] text-xs font-medium text-slate-700 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="px-4 h-9 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-[6px] flex items-center gap-1.5 shadow-sm disabled:opacity-50 active:scale-[0.98]"
              >
                <Loader2 v-if="saving" class="w-3.5 h-3.5 animate-spin" />
                <span>Simpan Akun</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Modal Setting WhatsApp Pengurus -->
    <Teleport to="body">
      <div
        v-if="showWhatsappModal"
        @click.self="showWhatsappModal = false"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 p-0 sm:p-4 backdrop-blur-xs transition-opacity"
      >
        <div class="w-full max-w-md bg-white border-t sm:border border-slate-200 rounded-t-2xl sm:rounded-xl p-5 sm:p-6 shadow-2xl text-slate-800 max-h-[92vh] overflow-y-auto">
          <!-- Mobile Pull Handle -->
          <div class="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-3 sm:hidden"></div>

          <!-- Modal Header -->
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div class="flex items-center gap-2.5 min-w-0">
              <div class="w-8 h-8 rounded-lg bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] flex items-center justify-center shrink-0">
                <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </div>
              <div class="min-w-0">
                <h3 class="font-bold text-base text-slate-900 truncate">No. WhatsApp Pengurus</h3>
                <p class="text-xs text-slate-500">Tujuan konfirmasi pendaftaran calon siswa</p>
              </div>
            </div>
            <button @click="showWhatsappModal = false" class="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100">
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Modal Body & Form -->
          <form @submit.prevent="saveWhatsappSetting" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">
                Nomor WhatsApp Resmi Dojang
              </label>
              <input
                type="text"
                v-model="whatsappSetting"
                placeholder="Contoh: 081234567890"
                required
                class="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-[6px] text-xs font-mono font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
              <p class="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                Nomor ini akan dihubungi oleh calon siswa baru secara otomatis melalui tombol WhatsApp pada halaman konfirmasi setelah submit pendaftaran.
              </p>
            </div>

            <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                @click="showWhatsappModal = false"
                class="px-4 h-9 border border-slate-300 rounded-[6px] text-xs font-medium text-slate-700 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="savingWhatsapp"
                class="px-4 h-9 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-[6px] flex items-center gap-1.5 shadow-sm disabled:opacity-50 active:scale-[0.98]"
              >
                <Loader2 v-if="savingWhatsapp" class="w-3.5 h-3.5 animate-spin" />
                <Check v-else class="w-3.5 h-3.5" />
                <span>Simpan Nomor</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { apiRequest } from '../../utils/api.js';
import { showConfirm, toastSuccess, toastError } from '../../utils/swal.js';
import { useAuth } from '../../stores/auth.js';
import {
  UserPlus,
  KeyRound,
  Trash2,
  Loader2,
  X,
  RefreshCw,
  Check
} from 'lucide-vue-next';

const auth = useAuth();
const currentUserId = computed(() => auth.state.user?.id);

const users = ref([]);
const loading = ref(false);
const saving = ref(false);

const showWhatsappModal = ref(false);
const whatsappSetting = ref('081234567890');
const savingWhatsapp = ref(false);

const showModal = ref(false);
const isEditing = ref(false);
const editingUserId = ref(null);

const userForm = reactive({
  full_name: '',
  username: '',
  password: '',
  role: 'admin',
  is_active: 1,
});

async function fetchUsers() {
  loading.value = true;
  try {
    const data = await apiRequest('/api/admin/users');
    users.value = data.users || [];
  } catch (err) {
    toastError(err.message || 'Gagal memuat data pengurus.');
  } finally {
    loading.value = false;
  }
}

async function fetchWhatsappSetting() {
  try {
    const data = await apiRequest('/api/admin/settings');
    if (data?.settings?.admin_whatsapp) {
      whatsappSetting.value = data.settings.admin_whatsapp;
    }
  } catch (_) {}
}

function openWhatsappModal() {
  fetchWhatsappSetting();
  showWhatsappModal.value = true;
}

async function saveWhatsappSetting() {
  savingWhatsapp.value = true;
  try {
    const data = await apiRequest('/api/admin/settings/whatsapp', {
      method: 'PUT',
      body: { whatsapp_number: whatsappSetting.value }
    });
    whatsappSetting.value = data.whatsapp_number || whatsappSetting.value;
    showWhatsappModal.value = false;
    toastSuccess('Nomor WhatsApp pengurus berhasil disimpan!');
  } catch (err) {
    toastError(err.message || 'Gagal menyimpan nomor WhatsApp.');
  } finally {
    savingWhatsapp.value = false;
  }
}

function openAddModal() {
  isEditing.value = false;
  editingUserId.value = null;
  userForm.full_name = '';
  userForm.username = '';
  userForm.password = '';
  userForm.role = 'admin';
  userForm.is_active = 1;
  showModal.value = true;
}

function openEditModal(u) {
  isEditing.value = true;
  editingUserId.value = u.id;
  userForm.full_name = u.full_name;
  userForm.username = u.username;
  userForm.password = '';
  userForm.role = u.role;
  userForm.is_active = u.is_active;
  showModal.value = true;
}

async function submitUserForm() {
  saving.value = true;
  try {
    if (isEditing.value) {
      await apiRequest(`/api/admin/users/${editingUserId.value}`, {
        method: 'PUT',
        body: userForm,
      });
      toastSuccess('Data pengurus berhasil diperbarui!');
    } else {
      await apiRequest('/api/admin/users', {
        method: 'POST',
        body: userForm,
      });
      toastSuccess('Akun pengurus baru berhasil ditambahkan!');
    }
    showModal.value = false;
    await fetchUsers();
  } catch (err) {
    toastError(err.message || 'Gagal menyimpan user.');
  } finally {
    saving.value = false;
  }
}

async function deleteUser(id) {
  const confirmed = await showConfirm({
    title: 'Hapus Akun Pengurus?',
    text: 'Akun pengurus ini akan dihapus dari sistem dan tidak dapat login kembali.',
    confirmButtonText: 'Ya, Hapus',
    cancelButtonText: 'Batal',
    confirmButtonColor: '#dc2626',
    icon: 'warning',
  });
  if (!confirmed) return;

  try {
    await apiRequest(`/api/admin/users/${id}`, { method: 'DELETE' });
    toastSuccess('Akun pengurus berhasil dihapus.');
    await fetchUsers();
  } catch (err) {
    toastError(err.message || 'Gagal menghapus user.');
  }
}

onMounted(() => {
  fetchUsers();
  fetchWhatsappSetting();
});
</script>
