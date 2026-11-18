<template>
  <div class="space-y-5 sm:space-y-6">
    <!-- View Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <div class="flex items-center gap-2">
          <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-brand whitespace-nowrap">
            Manajemen Akun Pengurus
          </h2>
          <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-satria-red/10 text-satria-red border border-satria-red/20 uppercase whitespace-nowrap">
            Superadmin
          </span>
        </div>
        <p class="text-xs sm:text-sm text-slate-500 mt-0.5">
          Kelola kredensial dan hak akses administrator sistem.
        </p>
      </div>

      <button
        type="button"
        @click="openAddModal"
        class="h-9 px-3.5 bg-satria-red hover:bg-satria-red-hover text-white font-bold text-xs rounded-[6px] flex items-center gap-1.5 transition-colors shadow-satria self-start sm:self-auto whitespace-nowrap"
      >
        <UserPlus class="w-4 h-4" />
        <span>Tambah Akun Admin</span>
      </button>
    </div>

    <!-- Users Table & Mobile Card List -->
    <div class="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
      <div v-if="loading" class="p-12 text-center text-slate-500 text-xs">
        <Loader2 class="w-6 h-6 animate-spin text-satria-red mx-auto mb-2" />
        <span>Memuat data pengurus...</span>
      </div>

      <div v-else>
        <!-- Desktop Table View (Hidden on mobile) -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-slate-50 text-slate-600 border-b border-slate-200 font-mono tracking-wider uppercase text-[10px]">
                <th class="p-3.5 pl-5 whitespace-nowrap">Nama Lengkap</th>
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
                <td class="p-3.5 pl-5 font-semibold text-slate-900 whitespace-nowrap">
                  {{ u.full_name }}
                  <span v-if="u.id === currentUserId" class="ml-1 text-[10px] text-satria-red font-mono font-bold">(Anda)</span>
                </td>
                <td class="p-3.5 font-mono text-slate-600 whitespace-nowrap">{{ u.username }}</td>
                <td class="p-3.5 whitespace-nowrap">
                  <span
                    :class="[
                      'inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono whitespace-nowrap',
                      u.role === 'superadmin' ? 'bg-amber-50 text-[#8C6918] border border-amber-300' : 'bg-slate-100 text-slate-700 border border-slate-200'
                    ]"
                  >
                    {{ u.role }}
                  </span>
                </td>
                <td class="p-3.5 whitespace-nowrap">
                  <span
                    :class="[
                      'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap',
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

        <!-- Mobile Card List View (Visible on mobile) -->
        <div class="md:hidden divide-y divide-slate-100">
          <div
            v-for="u in users"
            :key="u.id"
            class="p-3.5 sm:p-4 space-y-2 hover:bg-slate-50/70 transition-colors"
          >
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-1.5 min-w-0">
                <span class="font-bold text-slate-900 text-sm truncate">{{ u.full_name }}</span>
                <span v-if="u.id === currentUserId" class="text-[10px] text-satria-red font-mono font-bold whitespace-nowrap">(Anda)</span>
              </div>

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

            <div class="flex items-center justify-between gap-2 text-xs flex-wrap">
              <span class="font-mono text-slate-500 whitespace-nowrap">@{{ u.username }}</span>
              <div class="flex items-center gap-2">
                <span
                  :class="[
                    'inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono whitespace-nowrap',
                    u.role === 'superadmin' ? 'bg-amber-50 text-[#8C6918] border border-amber-300' : 'bg-slate-100 text-slate-700 border border-slate-200'
                  ]"
                >
                  {{ u.role }}
                </span>
                <span
                  :class="[
                    'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap',
                    u.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                  ]"
                >
                  <span :class="['w-1.5 h-1.5 rounded-full shrink-0', u.is_active ? 'bg-emerald-600' : 'bg-red-600']"></span>
                  {{ u.is_active ? 'Aktif' : 'Nonaktif' }}
                </span>
              </div>
            </div>

            <p class="text-[11px] font-mono text-slate-400 whitespace-nowrap">
              Dibuat: {{ u.created_at ? u.created_at.substring(0, 10) : '-' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Form (Tambah / Edit) -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs"
    >
      <div class="w-full max-w-md bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xl text-slate-800">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <h3 class="font-bold text-base text-slate-900">
            {{ isEditing ? 'Ubah Akun / Reset Password' : 'Buat Akun Admin Baru' }}
          </h3>
          <button @click="showModal = false" class="text-slate-400 hover:text-slate-700">
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
              class="px-4 h-9 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-[6px] flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              <Loader2 v-if="saving" class="w-3.5 h-3.5 animate-spin" />
              <span>Simpan Akun</span>
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { apiRequest } from '../../utils/api.js';
import { showConfirm, toastSuccess, toastError } from '../../utils/swal.js';
import { useAuth } from '../../stores/auth.js';
import { UserPlus, KeyRound, Trash2, Loader2, X } from 'lucide-vue-next';

const auth = useAuth();
const currentUserId = computed(() => auth.state.user?.id);

const users = ref([]);
const loading = ref(false);
const saving = ref(false);

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
});
</script>
