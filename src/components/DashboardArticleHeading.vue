<script setup lang="ts">

defineProps<{
  content: string,
}>()
</script>

<template>
<h3 class="uppercase italic text-center mb-8 text-sm">{{ content }}</h3>
</template>