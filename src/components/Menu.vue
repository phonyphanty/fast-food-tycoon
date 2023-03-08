<script setup lang="ts">

/* Composables */
import { useSharedState } from '@/composables/useSharedState';
/* Components */
import MenuItemComponent from './MenuItem.vue';

const { mainMenu } = useSharedState();

</script>

<template>
<article class="border-2 p-4 max-w-lg">
    <h3 class="text-md font-bold mb-2">Menu</h3>
    <div>
        <p v-if="mainMenu.length() === 0" class="italic font-light">Nothing's on your menu. Go make some burgers, chump!</p>
        <MenuItemComponent
            v-for="product in mainMenu.get()"
            :product="product"
            :key="product.id"
        />
    </div>
</article>
</template>

<style scoped>

</style>