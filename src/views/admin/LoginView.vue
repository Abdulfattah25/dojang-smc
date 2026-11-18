<template>
  <div class="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-8 antialiased selection:bg-satria-red/15 selection:text-satria-red">
    
    <!-- PWA Brand Splash / Header -->
    <div class="w-full max-w-sm text-center mb-6">
      <div class="inline-block p-1 bg-gradient-to-b from-satria-gold/30 to-satria-red/20 rounded-full mb-3 shadow-sm">
        <img
          src="/logo-satria-muda.png"
          alt="Taekwondo Satria Muda Club"
          class="w-18 h-18 sm:w-20 sm:h-20 rounded-full object-contain mx-auto border-2 border-satria-gold/50 shadow-xs"
        />
      </div>

      <h1 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-wider uppercase font-brand whitespace-nowrap">
        Satria Muda Club
      </h1>
      <p class="text-xs text-satria-red font-mono tracking-widest uppercase mt-1 font-semibold whitespace-nowrap">
        Dojang Management Portal
      </p>
    </div>

    <!-- Login Card -->
    <div class="w-full max-w-sm bg-white border border-slate-200 rounded-xl p-6 sm:p-7 shadow-lg">
      <form @submit.prevent="handleLogin" class="space-y-4 sm:space-y-5">
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 whitespace-nowrap">
            Username Pengurus
          </label>
          <div class="relative">
            <input
              type="text"
              v-model="username"
              required
              autocomplete="username"
              placeholder="Masukkan username"
              class="w-full h-12 px-3.5 bg-slate-50 border border-slate-300 rounded-[6px] text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-satria-red focus:ring-1 focus:ring-satria-red transition-colors"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 whitespace-nowrap">
            Kata Sandi
          </label>
          <div class="relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              required
              autocomplete="current-password"
              placeholder="••••••••"
              class="w-full h-12 px-3.5 pr-10 bg-slate-50 border border-slate-300 rounded-[6px] text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-satria-red focus:ring-1 focus:ring-satria-red transition-colors"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-3.5 text-slate-400 hover:text-slate-700"
            >
              <EyeOff v-if="showPassword" class="w-4 h-4" />
              <Eye v-else class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Turnstile Widget -->
        <TurnstileWidget
          @token-received="(t) => { turnstileToken = t; }"
          @token-expired="() => { turnstileToken = ''; }"
        />

        <!-- Error Message -->
        <div v-if="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-[6px] text-xs text-red-700 font-medium">
          {{ errorMessage }}
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm tracking-wide rounded-[6px] flex items-center justify-center gap-2 shadow-sm transition-all active:translate-y-[1px] disabled:opacity-50 whitespace-nowrap"
        >
          <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
          <LogIn v-else class="w-4 h-4" />
          <span>{{ isLoading ? 'Memverifikasi...' : 'Masuk ke Panel Pengurus' }}</span>
        </button>

        <div class="text-center pt-2">
          <router-link
            to="/"
            class="text-xs text-slate-500 hover:text-satria-red transition-colors inline-block whitespace-nowrap"
          >
            ← Buka Formulir Pendaftaran Publik
          </router-link>
        </div>
      </form>
    </div>

    <!-- PWA Standalone Notice -->
    <div class="mt-8 text-center text-[11px] text-slate-400 font-mono whitespace-nowrap">
      PWA Standalone App • Dojang Security Guard
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../../stores/auth.js';
import { toastSuccess } from '../../utils/swal.js';
import { Eye, EyeOff, LogIn, Loader2 } from 'lucide-vue-next';
import TurnstileWidget from '../../components/TurnstileWidget.vue';

const router = useRouter();
const auth = useAuth();

const username = ref('admin');
const password = ref('admin123');
const showPassword = ref(false);
const turnstileToken = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

async function handleLogin() {
  errorMessage.value = '';
  isLoading.value = true;

  try {
    await auth.login(username.value, password.value, turnstileToken.value || 'dummy-turnstile-token');
    toastSuccess('Login berhasil! Selamat datang.');
    router.push('/admin/dashboard');
  } catch (err) {
    errorMessage.value = err.message || 'Login gagal. Periksa kembali username dan kata sandi Anda.';
  } finally {
    isLoading.value = false;
  }
}
</script>
