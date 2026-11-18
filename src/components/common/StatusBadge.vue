<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] text-[11px] font-semibold whitespace-nowrap shrink-0 select-none',
      badgeStyles
    ]"
  >
    <span :class="['w-1.5 h-1.5 rounded-full shrink-0', dotStyles]"></span>
    {{ labelText }}
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  status: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'registration' // 'registration' | 'payment'
  }
});

const labelText = computed(() => {
  const s = props.status?.toLowerCase();
  if (props.type === 'payment' || s === 'paid' || s === 'unpaid') {
    if (s === 'paid') return 'Lunas';
    if (s === 'unpaid') return 'Belum Bayar';
    return s || 'Belum Bayar';
  }

  // Registration
  if (s === 'verified') return 'Terverifikasi';
  if (s === 'pending') return 'Menunggu';
  if (s === 'rejected') return 'Ditolak';
  return s || 'Menunggu';
});

const badgeStyles = computed(() => {
  const s = props.status?.toLowerCase();
  
  // Payment status: Lunas (green) & Belum Bayar (red)
  if (s === 'paid') {
    return 'bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold';
  }
  if (s === 'unpaid') {
    return 'bg-red-50 text-satria-red border border-satria-red/30 font-bold';
  }

  // Registration status
  if (s === 'verified') {
    return 'bg-amber-50 text-[#8C6918] border border-[#C9A85B]/40 font-bold';
  }
  if (s === 'pending') {
    return 'bg-amber-50 text-amber-700 border border-amber-300';
  }
  if (s === 'rejected') {
    return 'bg-slate-100 text-slate-600 border border-slate-300';
  }
  return 'bg-slate-100 text-slate-600 border border-slate-200';
});

const dotStyles = computed(() => {
  const s = props.status?.toLowerCase();
  if (s === 'paid') return 'bg-emerald-600';
  if (s === 'unpaid') return 'bg-satria-red';
  if (s === 'verified') return 'bg-[#C9A85B]';
  if (s === 'pending') return 'bg-amber-500';
  if (s === 'rejected') return 'bg-slate-400';
  return 'bg-slate-400';
});
</script>
