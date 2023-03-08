<script setup lang="ts">

defineProps<{
  content: string,
}>()
</script>

<template>
<h2 class="uppercase italic text-center mb-8">{{ content }}</h2>
</template>