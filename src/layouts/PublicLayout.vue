<template>
  <div class="min-h-screen bg-dobok-canvas flex flex-col justify-between">
    <!-- Public Header -->
    <header class="w-full bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <img
            src="/logo-satria-muda.png"
            alt="Logo Taekwondo Satria Muda Club"
            class="w-10 h-10 object-contain rounded-full border border-satria-gold/30 shadow-sm"
          />
          <div>
            <h1 class="font-extrabold text-sm sm:text-base text-slate-900 tracking-wide uppercase leading-tight font-brand">
              Taekwondo Satria Muda Club
            </h1>
            <p class="text-[10px] sm:text-xs text-slate-500 font-medium">
              Sistem Pendaftaran Anggota Baru Dojang
            </p>
          </div>
        </div>
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
const currentYear = new Date().getFullYear();
</script>
