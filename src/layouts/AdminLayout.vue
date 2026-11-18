<template>
  <div class="min-h-screen bg-slate-50 text-slate-800 flex flex-col antialiased selection:bg-satria-red/15 selection:text-satria-red">
    
    <!-- Top Header Bar -->
    <header class="w-full h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 lg:px-8 shadow-2xs">
      <div class="max-w-[1680px] 2xl:max-w-[1840px] w-full h-full mx-auto flex items-center justify-between">
        <div class="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
          <img
            src="/logo-satria-muda.png"
            alt="SMC Emblem"
            class="w-9 h-9 sm:w-10 sm:h-10 object-contain rounded-full border border-satria-gold/40 shadow-xs shrink-0"
          />
          <div class="min-w-0">
            <div class="flex items-center gap-1.5">
              <span class="font-extrabold text-sm sm:text-base tracking-wide text-slate-900 uppercase font-brand whitespace-nowrap">
                Satria Muda Club
              </span>
            </div>
            <p class="text-xs text-slate-500 font-mono hidden sm:block whitespace-nowrap">
              Management & Verification Portal
            </p>
          </div>
        </div>

        <!-- Right User Chip & Actions -->
        <div class="flex items-center gap-2.5 sm:gap-4 shrink-0">
          <div class="text-right hidden sm:block">
            <p class="text-sm font-semibold text-slate-900 truncate max-w-[180px] whitespace-nowrap">
              {{ auth.state.user?.full_name || 'Admin' }}
            </p>
            <span class="text-xs text-[#8C6918] font-bold uppercase tracking-wider font-mono whitespace-nowrap">
              {{ auth.state.user?.role === 'superadmin' ? 'Superadmin' : 'Pengurus' }}
            </span>
          </div>

          <button
            type="button"
            @click="handleLogout"
            class="px-3 py-1.5 text-slate-600 hover:text-satria-red rounded-lg hover:bg-slate-100 border border-slate-200/80 transition-colors text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap"
            title="Keluar Sesi"
          >
            <LogOut class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </div>
    </header>

    <div class="flex-1 flex max-w-[1680px] 2xl:max-w-[1840px] w-full mx-auto pb-20 md:pb-6 px-0 sm:px-4 lg:px-6">
      <!-- Desktop Sidebar Navigation -->
      <aside class="hidden md:flex flex-col w-60 lg:w-64 p-4 border-r border-slate-200 bg-white shrink-0 shadow-2xs">
        <nav class="space-y-1.5 text-sm font-medium">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            :class="[
              'flex items-center justify-between px-3.5 py-2.5 rounded-lg transition-colors whitespace-nowrap text-sm',
              $route.path === item.path
                ? 'bg-amber-500/10 text-[#8C6918] border border-[#C9A85B]/40 font-bold shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 font-medium'
            ]"
          >
            <div class="flex items-center gap-3">
              <component :is="item.icon" class="w-4.5 h-4.5 shrink-0" />
              <span class="truncate">{{ item.label }}</span>
            </div>
            <span
              v-if="item.badge && pendingCount > 0"
              class="px-2 py-0.5 text-xs font-bold rounded-full bg-satria-red text-white whitespace-nowrap"
            >
              {{ pendingCount }}
            </span>
          </router-link>
        </nav>

        <div class="mt-auto pt-4 border-t border-slate-200 text-xs text-slate-400 font-mono text-center whitespace-nowrap">
          Dojang Management v2.0
        </div>
      </aside>

      <!-- Main Admin Content Area -->
      <main class="flex-1 p-3.5 sm:p-6 lg:p-8 overflow-x-hidden min-w-0">
        <router-view @pending-count-updated="updatePendingCount" />
      </main>
    </div>

    <!-- Mobile Bottom Navigation Bar (PWA 64px) -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 z-40 flex items-center justify-around px-1 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        :class="[
          'flex flex-col items-center justify-center flex-1 py-1 relative text-[10px] transition-colors min-w-0 px-1',
          $route.path === item.path ? 'text-[#8C6918] font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'
        ]"
      >
        <div class="relative">
          <component :is="item.icon" class="w-5 h-5 mb-0.5" />
          <span
            v-if="item.badge && pendingCount > 0"
            class="absolute -top-1 -right-2.5 w-4 h-4 text-[9px] font-bold rounded-full bg-satria-red text-white flex items-center justify-center whitespace-nowrap"
          >
            {{ pendingCount }}
          </span>
        </div>
        <span class="whitespace-nowrap tracking-tight text-[10px] truncate max-w-full">
          {{ item.shortLabel || item.label }}
        </span>
      </router-link>
    </nav>

    <!-- PWA Install prompt -->
    <PwaInstallPrompt />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../stores/auth.js';
import { apiRequest } from '../utils/api.js';
import { showConfirm, toastSuccess } from '../utils/swal.js';
import {
  LayoutDashboard,
  UserCheck,
  Users,
  FileSpreadsheet,
  ShieldAlert,
  LogOut
} from 'lucide-vue-next';
import PwaInstallPrompt from '../components/PwaInstallPrompt.vue';

const router = useRouter();
const auth = useAuth();
const pendingCount = ref(0);

const navItems = computed(() => {
  const items = [
    { label: 'Beranda', shortLabel: 'Beranda', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Pendaftar', shortLabel: 'Pendaftar', path: '/admin/applicants', icon: UserCheck, badge: true },
    { label: 'Anggota', shortLabel: 'Anggota', path: '/admin/members', icon: Users },
    { label: 'Laporan', shortLabel: 'Laporan', path: '/admin/reports', icon: FileSpreadsheet },
  ];

  if (auth.isSuperadmin.value) {
    items.push({
      label: 'Pengguna',
      shortLabel: 'Admin',
      path: '/admin/users',
      icon: ShieldAlert
    });
  }

  return items;
});

async function fetchPendingCount() {
  try {
    const data = await apiRequest('/api/admin/dashboard');
    if (data?.metrics?.total_pending !== undefined) {
      pendingCount.value = data.metrics.total_pending;
    }
  } catch (_) {}
}

function updatePendingCount(count) {
  pendingCount.value = count;
}

async function handleLogout() {
  const confirmed = await showConfirm({
    title: 'Keluar dari Portal?',
    text: 'Sesi login Anda akan diakhiri.',
    confirmButtonText: 'Ya, Keluar',
    cancelButtonText: 'Batal',
    confirmButtonColor: '#dc2626',
    icon: 'question',
  });
  if (confirmed) {
    await auth.logout();
    toastSuccess('Berhasil keluar dari sistem.');
    router.push('/admin/login');
  }
}

onMounted(() => {
  fetchPendingCount();
});
</script>
