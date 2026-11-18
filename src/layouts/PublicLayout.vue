<template>
  <div class="min-h-screen bg-dobok-canvas flex flex-col justify-between">
    <!-- Public Header -->
    <header class="w-full bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <router-link to="/" class="flex items-center gap-2.5 sm:gap-3 group min-w-0">
          <img
            src="/logo-satria-muda.png"
            alt="Logo Taekwondo Satria Muda Club"
            class="w-9 h-9 sm:w-10 sm:h-10 object-contain rounded-full border border-satria-gold/30 shadow-sm shrink-0 group-hover:scale-105 transition-transform"
          />
          <div class="min-w-0">
            <h1 class="font-extrabold text-xs sm:text-base text-slate-900 tracking-wide uppercase leading-tight font-brand truncate">
              Taekwondo Satria Muda Club
            </h1>
            <p class="text-[10px] sm:text-xs text-slate-500 font-medium truncate">
              Sistem Pendaftaran Siswa Baru
            </p>
          </div>
        </router-link>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <router-view />
    </main>

    <!-- Public Minimal Footer -->
    <footer class="w-full bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-400">
      <div class="max-w-4xl mx-auto px-4">
        © {{ currentYear }} Taekwondo Satria Muda Club.
      </div>
    </footer>
  </div>
</template>

<script setup>
import { Search, UserPlus } from 'lucide-vue-next';

const currentYear = new Date().getFullYear();
</script>
