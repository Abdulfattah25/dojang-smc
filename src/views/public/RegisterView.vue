<template>
  <div class="max-w-xl mx-auto">
    <!-- Clean Minimalist Header -->
    <div class="mb-5 sm:mb-7 text-center sm:text-left">
      <h2 class="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight font-brand">
        Pendaftaran Atlet
      </h2>
      <p class="text-xs sm:text-sm text-slate-500 mt-1">
        Proses cepat tanpa perlu registrasi akun.
      </p>
    </div>

    <!-- Registration Card -->
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-7 md:p-8">
      <form @submit.prevent="submitRegistration" class="space-y-6 sm:space-y-7">
        
        <!-- Seksi 1: Biodata Murid -->
        <div class="space-y-3.5">
          <div class="flex items-center gap-2 pb-2 border-b border-slate-100">
            <span class="w-1.5 h-3.5 rounded-full bg-satria-red"></span>
            <h3 class="font-bold text-xs text-slate-900">
              Biodata Calon Anggota
            </h3>
          </div>

          <BaseInput
            v-model="form.full_name"
            label="Nama Lengkap"
            placeholder="Sesuai akta kelahiran"
            required
            :error="errors.full_name"
          />

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <BaseInput
              v-model="form.birth_date"
              type="date"
              label="Tanggal Lahir"
              required
              :error="errors.birth_date"
            />

            <!-- Gender Segmented Control -->
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">
                Jenis Kelamin <span class="text-satria-red">*</span>
              </label>
              <div class="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-lg h-11 sm:h-12 items-center">
                <button
                  type="button"
                  @click="form.gender = 'Laki-laki'"
                  :class="[
                    'h-full rounded-md text-xs transition-all flex items-center justify-center select-none',
                    form.gender === 'Laki-laki'
                      ? 'bg-satria-gold text-slate-900 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 font-medium'
                  ]"
                >
                  Laki-laki
                </button>
                <button
                  type="button"
                  @click="form.gender = 'Perempuan'"
                  :class="[
                    'h-full rounded-md text-xs transition-all flex items-center justify-center select-none',
                    form.gender === 'Perempuan'
                      ? 'bg-satria-gold text-slate-900 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 font-medium'
                  ]"
                >
                  Perempuan
                </button>
              </div>
              <p v-if="errors.gender" class="mt-1 text-xs text-red-600 font-medium">{{ errors.gender }}</p>
            </div>
          </div>
        </div>

        <!-- Seksi 2: Kontak & Tingkatan Sabuk -->
        <div class="space-y-3.5">
          <div class="flex items-center gap-2 pb-2 border-b border-slate-100">
            <span class="w-1.5 h-3.5 rounded-full bg-satria-gold"></span>
            <h3 class="font-bold text-xs text-slate-900">
              Kontak & Tingkatan Sabuk
            </h3>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <BaseInput
              v-model="form.phone_number"
              type="tel"
              label="Nomor WhatsApp"
              placeholder="Contoh: 08123456789"
              required
              :error="errors.phone_number"
            />

            <!-- Pilihan Sabuk Dropdown -->
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">
                Sabuk Saat Ini <span class="text-satria-red">*</span>
              </label>
              <select
                v-model="form.belt_rank"
                class="w-full h-11 sm:h-12 px-3 bg-white border border-slate-300 hover:border-slate-400 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-satria-red focus:border-satria-red shadow-2xs transition-colors"
              >
                <option value="Putih">Sabuk Putih (Pemula)</option>
                <option value="Kuning Polos">Sabuk Kuning (Geup 9 - 8)</option>
                <option value="Hijau Polos">Sabuk Hijau (Geup 7 - 6)</option>
                <option value="Biru Polos">Sabuk Biru (Geup 5 - 4)</option>
                <option value="Merah Polos">Sabuk Merah (Geup 3 - 1)</option>
                <option value="Hitam / Poom">Sabuk Hitam / Poom (Dan)</option>
              </select>
            </div>
          </div>

          <BaseInput
            v-model="form.address"
            type="textarea"
            label="Alamat Domisili"
            placeholder="Jalan, No. Rumah, RT/RW, Kelurahan, Kecamatan"
            required
            :rows="2"
            :error="errors.address"
          />
        </div>

        <!-- Seksi 3: Berkas Persyaratan -->
        <div class="space-y-3.5">
          <div class="flex items-center gap-2 pb-2 border-b border-slate-100">
            <span class="w-1.5 h-3.5 rounded-full bg-slate-900"></span>
            <h3 class="font-bold text-xs text-slate-900">
              Unggah Dokumen
            </h3>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <FileCompressor
              label="Akta Kelahiran"
              required
              :error="errors.doc_birth_cert"
              @file-selected="(file) => { form.doc_birth_cert = file; errors.doc_birth_cert = ''; }"
              @file-removed="() => { form.doc_birth_cert = null; }"
            />

            <FileCompressor
              label="Pas Foto (Opsional)"
              :required="false"
              @file-selected="(file) => { form.doc_photo = file; }"
              @file-removed="() => { form.doc_photo = null; }"
            />
          </div>
        </div>

        <!-- Anti-Bot Turnstile (Compact) -->
        <div class="pt-1">
          <TurnstileWidget
            @token-received="(token) => { form.turnstile_token = token; }"
            @token-expired="() => { form.turnstile_token = ''; }"
          />
        </div>

        <!-- Server Error Banner -->
        <div v-if="serverError" class="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium">
          {{ serverError }}
        </div>

        <!-- Submit Button & Check Status Navigation -->
        <div class="pt-1 space-y-2.5">
          <BaseButton
            type="submit"
            variant="success"
            size="lg"
            :loading="isSubmitting"
            customClass="w-full font-bold text-sm tracking-wide h-11 sm:h-12 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs active:translate-y-[1px]"
          >
            <Send class="w-4 h-4 mr-2" />
            <span>Kirim Pendaftaran</span>
          </BaseButton>

          <!-- Check Registration Status Button (Below Submit) -->
          <router-link
            to="/status"
            class="w-full h-10 sm:h-11 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-[0.99]"
          >
            <Search class="w-3.5 h-3.5 text-satria-red" />
            <span>Sudah Daftar? Cek Status Pendaftaran</span>
          </router-link>

          <p class="text-[11px] text-slate-400 text-center pt-0.5">
            Data pendaftaran terenkripsi & tersimpan aman di server dojang SMC.
          </p>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Send, Search } from 'lucide-vue-next';
import { apiRequest } from '../../utils/api.js';
import BaseInput from '../../components/common/BaseInput.vue';
import BaseButton from '../../components/common/BaseButton.vue';
import FileCompressor from '../../components/FileCompressor.vue';
import TurnstileWidget from '../../components/TurnstileWidget.vue';

const router = useRouter();

const form = reactive({
  full_name: '',
  birth_date: '',
  gender: 'Laki-laki',
  phone_number: '',
  address: '',
  belt_rank: 'Putih',
  doc_birth_cert: null,
  doc_photo: null,
  turnstile_token: '',
});

const errors = reactive({
  full_name: '',
  birth_date: '',
  gender: '',
  phone_number: '',
  address: '',
  doc_birth_cert: '',
});

const serverError = ref('');
const isSubmitting = ref(false);

function validateForm() {
  let valid = true;
  errors.full_name = '';
  errors.birth_date = '';
  errors.gender = '';
  errors.phone_number = '';
  errors.address = '';
  errors.doc_birth_cert = '';

  if (!form.full_name.trim() || form.full_name.trim().length < 3) {
    errors.full_name = 'Nama lengkap wajib diisi minimal 3 karakter.';
    valid = false;
  }
  if (!form.birth_date) {
    errors.birth_date = 'Tanggal lahir wajib diisi.';
    valid = false;
  }
  if (!form.gender) {
    errors.gender = 'Pilih jenis kelamin.';
    valid = false;
  }
  if (!form.phone_number.trim() || form.phone_number.trim().length < 8) {
    errors.phone_number = 'Nomor WhatsApp aktif wajib diisi.';
    valid = false;
  }
  if (!form.address.trim() || form.address.trim().length < 5) {
    errors.address = 'Alamat domisili lengkap wajib diisi.';
    valid = false;
  }
  if (!form.doc_birth_cert) {
    errors.doc_birth_cert = 'Foto Akta Kelahiran wajib diunggah.';
    valid = false;
  }

  return valid;
}

async function submitRegistration() {
  serverError.value = '';
  if (!validateForm()) return;

  isSubmitting.value = true;
  try {
    const payload = new FormData();
    payload.append('full_name', form.full_name.trim());
    payload.append('birth_date', form.birth_date);
    payload.append('gender', form.gender);
    payload.append('phone_number', form.phone_number.trim());
    payload.append('address', form.address.trim());
    payload.append('belt_rank', form.belt_rank);
    payload.append('doc_birth_cert', form.doc_birth_cert);
    if (form.doc_photo) {
      payload.append('doc_photo', form.doc_photo);
    }

    // Tunggu token anti-bot jika belum siap (maks 2 detik)
    if (!form.turnstile_token) {
      let attempts = 0;
      while (!form.turnstile_token && attempts < 20) {
        await new Promise((r) => setTimeout(r, 100));
        attempts++;
      }
    }

    payload.append('turnstile_token', form.turnstile_token || 'dummy-turnstile-token');

    const result = await apiRequest('/api/register', {
      method: 'POST',
      body: payload,
    });

    // Navigate to success screen with registration info
    sessionStorage.setItem('smc_registration_result', JSON.stringify({
      code: result.registration_code,
      name: result.full_name,
      phone: result.phone_number,
      belt: form.belt_rank,
      time: result.created_at,
    }));

    router.push({
      path: '/success',
      query: { code: result.registration_code }
    });
  } catch (err) {
    serverError.value = err.message || 'Terjadi kesalahan saat memproses pendaftaran. Silakan coba lagi.';
  } finally {
    isSubmitting.value = false;
  }
}
</script>
