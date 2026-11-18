<template>
  <div class="w-full">
    <label v-if="label" :for="id" class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
      {{ label }}
      <span v-if="required" class="text-satria-red ml-0.5">*</span>
    </label>

    <div class="relative">
      <slot name="prefix" />

      <input
        v-if="type !== 'textarea'"
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :max="max"
        :min="min"
        :class="[
          'w-full h-11 sm:h-12 px-3.5 bg-white border rounded-lg text-sm text-slate-900 transition-colors shadow-2xs',
          'placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-satria-red focus:border-satria-red',
          'disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed',
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300 hover:border-slate-400',
          $slots.prefix ? 'pl-10' : '',
          $slots.suffix ? 'pr-10' : ''
        ]"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur', $event)"
      />

      <textarea
        v-else
        :id="id"
        :value="modelValue"
        :rows="rows"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :class="[
          'w-full min-h-[84px] p-3 bg-white border rounded-lg text-sm text-slate-900 transition-colors shadow-2xs resize-none',
          'placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-satria-red focus:border-satria-red',
          'disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed',
          error ? 'border-red-500' : 'border-slate-300 hover:border-slate-400'
        ]"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur', $event)"
      ></textarea>

      <slot name="suffix" />
    </div>

    <p v-if="error" class="mt-1 text-xs text-red-600 font-medium">{{ error }}</p>
    <p v-else-if="hint" class="mt-1 text-xs text-slate-400">{{ hint }}</p>
  </div>
</template>

<script setup>
defineProps({
  id: {
    type: String,
    default: () => 'input-' + Math.random().toString(36).substring(2, 9)
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  },
  rows: {
    type: Number,
    default: 3
  },
  max: {
    type: String,
    default: undefined
  },
  min: {
    type: String,
    default: undefined
  }
});

defineEmits(['update:modelValue', 'blur']);
</script>
