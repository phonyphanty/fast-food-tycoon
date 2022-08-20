<script setup lang="ts">
import { useBurger } from './composables/useBurger';
import BurgerStackComponent from './components/BurgerStack.vue';

const { BurgerIngredient, burgerIngredients } = useBurger();

</script>

<template>
<div class="h-screen p-4 font-serif">
  <h1 class="text-center mb-2 font-bold">FAST FOOD EMPIRE</h1>
  <BurgerStackComponent/>
</div>
  
</template>

<style scoped>

</style>
