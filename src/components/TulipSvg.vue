<template>
  <!-- Inline SVG tulip — reusable across the site -->
  <svg
    :width="size"
    :height="Math.round(size * 1.3)"
    viewBox="0 0 64 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :style="{ opacity }"
    aria-hidden="true"
  >
    <!-- Stem -->
    <path
      d="M32 78 C32 62 32 50 32 36"
      :stroke="color"
      stroke-width="2"
      stroke-linecap="round"
    />
    <!-- Left leaf -->
    <path
      d="M32 54 C23 47 17 38 21 29 C26 38 30 46 32 54Z"
      :fill="color"
      opacity="0.55"
    />
    <!-- Right leaf -->
    <path
      d="M32 50 C41 43 47 34 43 25 C38 34 34 42 32 50Z"
      :fill="color"
      opacity="0.55"
    />
    <!-- Center petal -->
    <path
      d="M32 36 C29 27 23 20 21 12 C25 8 30 11 32 18 C34 11 39 8 43 12 C41 20 35 27 32 36Z"
      :fill="color"
      opacity="0.9"
    />
    <!-- Left outer petal -->
    <path
      d="M30 35 C26 27 20 20 18 11 C21 8 26 11 29 18Z"
      :fill="color"
      opacity="0.6"
    />
    <!-- Right outer petal -->
    <path
      d="M34 35 C38 27 44 20 46 11 C43 8 38 11 35 18Z"
      :fill="color"
      opacity="0.6"
    />
    <!-- Pistil -->
    <circle cx="32" cy="20" r="2.5" fill="#FAF9F6" opacity="0.85" />
  </svg>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: number
    opacity?: number
    color?: string
  }>(),
  {
    size: 64,
    opacity: 0.15,
    color: '#86A789',
  }
)
</script>
