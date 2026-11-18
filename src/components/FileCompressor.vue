<template>
  <div class="w-full">
    <div class="flex items-center justify-between mb-1.5">
      <label class="block text-xs font-bold uppercase tracking-wider text-slate-700">
        {{ label }}
        <span v-if="required" class="text-satria-red ml-0.5">*</span>
      </label>
      <span v-if="!compressedFile" class="text-[11px] text-slate-400 font-mono">
        Maks. 1 MB
      </span>
    </div>

    <!-- Empty Upload State: Compact & Touch-Friendly -->
    <div
      v-if="!compressedFile"
      @click="triggerInput"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      :class="[
        'group border border-dashed rounded-lg p-3 sm:p-3.5 cursor-pointer transition-all flex items-center justify-between gap-3',
        isDragging
          ? 'border-satria-red bg-red-50/60 ring-2 ring-satria-red/20'
          : 'border-slate-300 hover:border-satria-red/50 bg-slate-50/60 hover:bg-white',
        error ? 'border-red-500 bg-red-50/30' : ''
      ]"
    >
      <input
        ref="fileInputRef"
        type="file"
        class="hidden"
        :accept="accept"
        @change="handleFileChange"
      />

      <div class="flex items-center gap-3 min-w-0">
        <div class="w-9 h-9 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-500 group-hover:text-satria-red group-hover:border-satria-red/30 transition-colors shrink-0 shadow-2xs">
          <Camera class="w-4 h-4" />
        </div>
        <div class="min-w-0">
          <p class="text-xs font-semibold text-slate-800 group-hover:text-satria-red transition-colors truncate">
            Pilih atau Ambil Foto
          </p>
          <p class="text-[11px] text-slate-400 truncate">
            Format JPG, PNG, atau WebP
          </p>
        </div>
      </div>

      <span class="text-[11px] font-semibold text-satria-red group-hover:underline shrink-0 px-2.5 py-1 rounded bg-red-50 border border-satria-red/10">
        Unggah
      </span>
    </div>

    <!-- File Selected Preview State: Sleek & Informative -->
    <div
      v-else
      class="border border-slate-200 rounded-lg p-2.5 sm:p-3 bg-white flex items-center justify-between gap-3 shadow-xs"
    >
      <div class="flex items-center gap-2.5 min-w-0">
        <img
          :src="previewUrl"
          alt="Preview"
          class="w-10 h-10 sm:w-11 sm:h-11 object-cover rounded-md border border-slate-200 shrink-0"
        />
        <div class="min-w-0">
          <p class="text-xs font-semibold text-slate-900 truncate">{{ fileName }}</p>
          <p v-if="compressionStats" class="text-[11px] text-emerald-600 font-mono font-medium flex items-center gap-1 mt-0.5">
            <span>✓ {{ compressionStats.originalSize }} → {{ compressionStats.newSize }}</span>
          </p>
          <p v-else class="text-[11px] text-slate-400 font-mono mt-0.5">
            {{ formatBytes(compressedFile.size) }}
          </p>
        </div>
      </div>

      <button
        type="button"
        @click="removeFile"
        class="p-1.5 text-slate-400 hover:text-satria-red hover:bg-red-50 rounded-md transition-colors"
        title="Hapus foto"
      >
        <X class="w-4 h-4" />
      </button>
    </div>

    <p v-if="error" class="mt-1 text-xs text-red-600 font-medium">{{ error }}</p>
    <p v-else-if="hint" class="mt-1 text-xs text-slate-400">{{ hint }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Camera, X } from 'lucide-vue-next';
import { toastError } from '../utils/swal.js';

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  required: {
    type: Boolean,
    default: false,
  },
  accept: {
    type: String,
    default: 'image/jpeg,image/png,image/webp',
  },
  hint: {
    type: String,
    default: '',
  },
  error: {
    type: String,
    default: '',
  },
  maxDimension: {
    type: Number,
    default: 1280,
  },
  quality: {
    type: Number,
    default: 0.82,
  }
});

const emit = defineEmits(['file-selected', 'file-removed']);

const fileInputRef = ref(null);
const isDragging = ref(false);
const compressedFile = ref(null);
const previewUrl = ref('');
const fileName = ref('');
const compressionStats = ref(null);

function triggerInput() {
  fileInputRef.value?.click();
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

async function handleFileChange(e) {
  const file = e.target.files?.[0];
  if (file) await processFile(file);
}

async function handleDrop(e) {
  isDragging.value = false;
  const file = e.dataTransfer.files?.[0];
  if (file) await processFile(file);
}

async function processFile(file) {
  if (!file.type.startsWith('image/')) {
    toastError('Harap pilih berkas gambar (JPG, PNG, WebP).');
    return;
  }

  const originalSize = formatBytes(file.size);
  fileName.value = file.name;

  try {
    const resultFile = await compressImage(file, props.maxDimension, props.quality);
    compressedFile.value = resultFile;
    previewUrl.value = URL.createObjectURL(resultFile);

    const newSize = formatBytes(resultFile.size);
    compressionStats.value = { originalSize, newSize };

    emit('file-selected', resultFile);
  } catch (err) {
    console.error('Compression error:', err);
    compressedFile.value = file;
    previewUrl.value = URL.createObjectURL(file);
    emit('file-selected', file);
  }
}

function compressImage(file, maxDim, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas to Blob failed'));
              return;
            }
            const optimizedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(optimizedFile);
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function removeFile() {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
  compressedFile.value = null;
  previewUrl.value = '';
  fileName.value = '';
  compressionStats.value = null;
  if (fileInputRef.value) fileInputRef.value.value = '';
  emit('file-removed');
}
</script>
