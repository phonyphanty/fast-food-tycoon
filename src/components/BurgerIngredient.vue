<script setup lang="ts">
import { useBurger } from '@/composables/useBurger';

const props = defineProps([
    'ingredient',
]);
</script>

<template>
<div class="relative bg-black/75 border-2 border-solid border-white p-4 select-none"
style="backdrop-filter: blur(2px) saturate(180%); -webkit-backdrop-filter: blur(2px) saturate(180%);">
    <div class="absolute left-0 top-0 border-t-[1.5rem] border-r-[1.5rem] border-solid border-r-transparent"
    :class="ingredient.borderColour"></div>
    <p>Name: {{ ingredient.name }}</p>
    <p>
        Price: {{ ingredient.priceToString(ingredient.price) }}<!--
     --><span class="text-yellow-200 font-bold text-sm ml-0.5">G</span>
    </p>
</div>
</template>