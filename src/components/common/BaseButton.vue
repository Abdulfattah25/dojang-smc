<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center font-semibold rounded-[6px] transition-all duration-150 select-none text-sm tracking-wide',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      sizeClasses,
      variantClasses,
      customClass
    ]"
    @click="$emit('click', $event)"
  >
    <svg
      v-if="loading"
      class="animate-spin -ml-1 mr-2.5 h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <slot name="icon-left" />
    <slot />
    <slot name="icon-right" />
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'button'
  },
  variant: {
    type: String,
    default: 'primary' // 'primary' | 'success' | 'gold' | 'outline' | 'ghost' | 'danger'
  },
  size: {
    type: String,
    default: 'md' // 'sm' | 'md' | 'lg'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  customClass: {
    type: String,
    default: ''
  }
});

defineEmits(['click']);

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-9 px-3 text-xs';
    case 'lg':
      return 'h-13 px-6 text-base';
    case 'md':
    default:
      return 'h-12 px-4 text-sm';
  }
});

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm active:translate-y-[1px]';
    case 'success':
    case 'green':
      return 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm active:translate-y-[1px]';
    case 'red':
    case 'satria-red':
      return 'bg-satria-red hover:bg-satria-red-hover text-white shadow-satria active:translate-y-[1px]';
    case 'gold':
      return 'bg-satria-gold hover:bg-[#b89547] text-obsidian-core font-bold active:translate-y-[1px] shadow-gold';
    case 'outline':
      return 'bg-transparent border border-slate-300 text-obsidian-core hover:bg-slate-100 active:translate-y-[1px]';
    case 'outline-gold':
      return 'bg-transparent border border-satria-gold text-satria-gold hover:bg-satria-gold/10 active:translate-y-[1px]';
    case 'danger':
      return 'bg-red-600 hover:bg-red-700 text-white active:translate-y-[1px]';
    case 'ghost':
      return 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100';
    default:
      return 'bg-satria-red text-white';
  }
});
</script>
