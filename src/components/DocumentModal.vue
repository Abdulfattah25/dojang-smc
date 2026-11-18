<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      @click.self="$emit('close')"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm transition-opacity p-2 sm:p-4 md:p-6"
    >
      <div class="relative w-full h-full max-w-6xl flex flex-col md:flex-row bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xl">
        
        <!-- Left / Top: Document Viewer Screen (Dark background for crisp image contrast) -->
        <div class="relative flex-1 bg-slate-950 flex flex-col items-center justify-center p-4 overflow-hidden select-none min-h-[300px]">
          <!-- Floating Viewer Toolbar -->
          <div class="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 rounded-md p-1.5 backdrop-blur-sm shadow-lg text-slate-200">
            <button
              type="button"
              @click="rotateDoc"
              class="p-2 hover:bg-white/10 rounded transition-colors text-xs flex items-center gap-1 whitespace-nowrap"
              title="Putar 90°"
            >
              <RotateCw class="w-4 h-4 text-satria-gold" />
              <span class="hidden sm:inline">Putar</span>
            </button>

            <!-- Tombol Zoom In, Zoom Out, dan Reset Ukuran (Disembunyikan di UI Mobile) -->
            <div class="hidden sm:block w-px h-4 bg-white/20"></div>
            <button
              type="button"
              @click="zoomIn"
              class="hidden sm:flex p-2 hover:bg-white/10 rounded transition-colors text-xs items-center justify-center"
              title="Zoom In"
            >
              <ZoomIn class="w-4 h-4" />
            </button>
            <button
              type="button"
              @click="zoomOut"
              class="hidden sm:flex p-2 hover:bg-white/10 rounded transition-colors text-xs items-center justify-center"
              title="Zoom Out"
            >
              <ZoomOut class="w-4 h-4" />
            </button>
            <button
              type="button"
              @click="resetTransform"
              class="hidden sm:flex p-2 hover:bg-white/10 rounded transition-colors text-xs items-center justify-center"
              title="Reset Ukuran"
            >
              <Maximize2 class="w-4 h-4" />
            </button>

            <div class="w-px h-4 bg-white/20"></div>
            <button
              type="button"
              @click="downloadDocument"
              :disabled="!documentUrl || downloading"
              class="p-2 hover:bg-white/10 text-satria-gold hover:text-amber-300 rounded transition-colors text-xs flex items-center gap-1.5"
              title="Unduh Berkas Gambar"
            >
              <Download class="w-4 h-4" />
              <span class="hidden sm:inline font-medium text-xs">Unduh</span>
            </button>
          </div>

          <!-- Document Image -->
          <div
            class="w-full h-full flex items-center justify-center overflow-auto cursor-pointer sm:cursor-grab sm:active:cursor-grabbing"
            @click="handleImageClick"
          >
            <img
              v-if="documentUrl"
              :src="documentUrl"
              :style="{
                transform: `rotate(${rotation}deg) scale(${zoomLevel})`,
                transition: 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)'
              }"
              alt="Dokumen Terproteksi"
              class="max-w-full max-h-full object-contain pointer-events-auto rounded shadow-md cursor-pointer sm:cursor-default"
            />
            <div v-else class="text-slate-400 text-sm flex items-center gap-2">
              <Loader2 class="w-5 h-5 animate-spin text-satria-gold" />
              <span>Memuat berkas privat dari R2...</span>
            </div>
          </div>

          <!-- Petunjuk Tap Gambar di Mobile -->
          <div class="sm:hidden absolute bottom-3 z-10 px-2.5 py-1 bg-black/70 backdrop-blur-xs rounded-full text-[11px] text-slate-200 pointer-events-none flex items-center gap-1 shadow">
            <Maximize2 class="w-3 h-3 text-satria-gold" />
            <span>Ketuk gambar untuk 1 layar penuh</span>
          </div>
        </div>

        <!-- Right / Bottom: Member Info & Actions Panel (Light Theme) -->
        <div class="w-full md:w-80 lg:w-96 bg-white border-t md:border-t-0 md:border-l border-slate-200 flex flex-col justify-between p-4 sm:p-5 text-slate-800 shrink-0 overflow-y-auto max-h-[45vh] md:max-h-full">
          <div>
            <!-- Header Bar -->
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span class="text-[10px] font-mono tracking-widest text-[#8C6918] uppercase font-bold whitespace-nowrap">Dojo Darkroom</span>
                <h3 class="font-bold text-base text-slate-900 truncate">Pratinjau Berkas</h3>
              </div>
              <button
                type="button"
                @click="$emit('close')"
                class="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X class="w-5 h-5" />
              </button>
            </div>

            <!-- Applicant Biodata Summary -->
            <div v-if="member" class="mt-4 space-y-3 text-xs">
              <div>
                <span class="text-slate-400 block mb-0.5">Kode Registrasi</span>
                <span class="font-mono text-[#8C6918] font-bold text-sm whitespace-nowrap">{{ member.registration_code }}</span>
              </div>

              <div>
                <span class="text-slate-400 block mb-0.5">Nama Calon</span>
                <span class="text-slate-900 font-semibold text-sm truncate block">{{ member.full_name }}</span>
              </div>

              <div class="grid grid-cols-2 gap-2 font-mono">
                <div>
                  <span class="text-slate-400 block mb-0.5 font-sans">Tanggal Lahir</span>
                  <span class="text-slate-800 font-semibold whitespace-nowrap">{{ member.birth_date }}</span>
                </div>
                <div>
                  <span class="text-slate-400 block mb-0.5 font-sans">Jenis Kelamin</span>
                  <span class="text-slate-800 font-semibold whitespace-nowrap">{{ member.gender }}</span>
                </div>
              </div>

              <div>
                <span class="text-slate-400 block mb-0.5">WhatsApp Wali</span>
                <a
                  :href="'https://wa.me/' + cleanPhone(member.phone_number)"
                  target="_blank"
                  class="text-emerald-700 hover:underline flex items-center gap-1 font-mono font-medium whitespace-nowrap"
                >
                  <span>{{ member.phone_number }}</span>
                  <ExternalLink class="w-3 h-3" />
                </a>
              </div>

              <div>
                <span class="text-slate-400 block mb-0.5">Alamat Domisili</span>
                <p class="text-slate-700 leading-relaxed">{{ member.address }}</p>
              </div>

              <div>
                <span class="text-slate-400 block mb-0.5">Sabuk Awal</span>
                <span class="inline-block px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-800 font-semibold font-mono text-[11px] whitespace-nowrap">
                  {{ member.belt_rank || 'Putih' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="pt-4 border-t border-slate-100 space-y-2 mt-4">
            <button
              type="button"
              @click="downloadDocument"
              :disabled="!documentUrl || downloading"
              class="w-full h-10 border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-[6px] text-xs font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap shadow-2xs disabled:opacity-50"
            >
              <Download class="w-4 h-4 text-satria-red" />
              <span>{{ downloading ? 'Mengunduh Berkas...' : 'Unduh Berkas Gambar' }}</span>
            </button>

            <button
              v-if="member && member.registration_status === 'pending'"
              type="button"
              @click="$emit('verify', member)"
              :disabled="actionLoading"
              class="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-[6px] text-sm flex items-center justify-center gap-2 transition-all active:translate-y-[1px] shadow-sm disabled:opacity-50 whitespace-nowrap"
            >
              <CheckCircle2 class="w-4 h-4" />
              <span>Verifikasi Berkas Sekarang</span>
            </button>
          </div>

        </div>

      </div>

      <!-- Mobile Fullscreen View Overlay (Ukuran 1 Layar Penuh saat gambar diklik di UI Mobile) -->
      <div
        v-if="isMobileFullscreen"
        class="fixed inset-0 z-[60] bg-black flex flex-col justify-between select-none"
      >
        <!-- Top Bar Fullscreen -->
        <div class="flex items-center justify-between p-3.5 bg-black/80 backdrop-blur-sm border-b border-white/10 text-white z-10">
          <div class="flex items-center gap-2">
            <button
              type="button"
              @click.stop="rotateDoc"
              class="p-2 bg-white/10 hover:bg-white/20 rounded-md transition-colors text-xs flex items-center gap-1.5 text-satria-gold"
              title="Putar 90°"
            >
              <RotateCw class="w-4 h-4" />
              <span class="text-xs font-semibold text-white">Putar</span>
            </button>
            <button
              type="button"
              @click.stop="downloadDocument"
              :disabled="!documentUrl || downloading"
              class="p-2 bg-white/10 hover:bg-white/20 rounded-md transition-colors text-xs flex items-center gap-1.5 text-satria-gold"
              title="Unduh Berkas Gambar"
            >
              <Download class="w-4 h-4" />
              <span class="text-xs font-semibold text-white">Unduh</span>
            </button>
          </div>

          <button
            type="button"
            @click="isMobileFullscreen = false"
            class="px-3.5 py-1.5 bg-satria-red hover:bg-red-700 text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
          >
            <X class="w-4 h-4" />
            <span>Tutup</span>
          </button>
        </div>

        <!-- Fullscreen Image Area (Ukuran 1 Layar Penuh) -->
        <div
          class="flex-1 w-full h-full flex items-center justify-center p-2 overflow-auto"
          @click="isMobileFullscreen = false"
        >
          <img
            v-if="documentUrl"
            :src="documentUrl"
            :style="{
              transform: `rotate(${rotation}deg)`,
              transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }"
            alt="Dokumen Terproteksi Layar Penuh"
            class="max-w-full max-h-full object-contain pointer-events-auto"
          />
        </div>

        <!-- Bottom Helper Hint -->
        <div class="p-2.5 bg-black/80 backdrop-blur-sm text-center text-xs text-slate-300 border-t border-white/10">
          Ketuk gambar atau tombol Tutup untuk kembali
        </div>
      </div>

    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { RotateCw, ZoomIn, ZoomOut, Maximize2, X, ExternalLink, CheckCircle2, Loader2, Download } from 'lucide-vue-next';
import { toastSuccess, toastError } from '../utils/swal.js';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  docKey: {
    type: String,
    default: '',
  },
  member: {
    type: Object,
    default: null,
  },
  actionLoading: {
    type: Boolean,
    default: false,
  }
});

const emit = defineEmits(['close', 'verify']);

const rotation = ref(0);
const zoomLevel = ref(1);
const documentUrl = ref('');
const downloading = ref(false);
const isMobileFullscreen = ref(false);

watch(
  () => props.docKey,
  (newKey) => {
    resetTransform();
    isMobileFullscreen.value = false;
    if (newKey) {
      documentUrl.value = `/api/admin/documents/${newKey}`;
    } else {
      documentUrl.value = '';
    }
  },
  { immediate: true }
);

watch(
  () => props.isOpen,
  (open) => {
    if (!open) {
      isMobileFullscreen.value = false;
      resetTransform();
    }
  }
);

function handleImageClick() {
  // Pada layar mobile (< 768px), klik gambar akan langsung menampilkan ukuran 1 layar penuh
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    isMobileFullscreen.value = true;
  }
}

function handleKeydown(e) {
  if (e.key === 'Escape') {
    if (isMobileFullscreen.value) {
      isMobileFullscreen.value = false;
    } else if (props.isOpen) {
      emit('close');
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});

function rotateDoc() {
  rotation.value = (rotation.value + 90) % 360;
}

function zoomIn() {
  if (zoomLevel.value < 3) zoomLevel.value += 0.25;
}

function zoomOut() {
  if (zoomLevel.value > 0.5) zoomLevel.value -= 0.25;
}

function resetTransform() {
  rotation.value = 0;
  zoomLevel.value = 1;
}

function cleanPhone(phone) {
  if (!phone) return '';
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  }
  return cleaned;
}

async function downloadDocument() {
  if (!documentUrl.value) return;
  downloading.value = true;
  try {
    const res = await fetch(documentUrl.value, { credentials: 'include' });
    if (!res.ok) throw new Error('Gagal mengunduh berkas gambar');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const ext = props.docKey.split('.').pop() || 'jpg';
    const regCode = props.member?.registration_code || 'SMC';
    const name = (props.member?.full_name || 'Dokumen').replace(/[^a-zA-Z0-9_-]/g, '_');
    a.download = `Akta_${regCode}_${name}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toastSuccess('Berkas akta kelahiran berhasil diunduh!');
  } catch (err) {
    console.error('Download error:', err);
    toastError('Gagal mengunduh berkas gambar.');
  } finally {
    downloading.value = false;
  }
}
</script>
