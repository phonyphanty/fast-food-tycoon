<script setup lang="ts">
import { useBurger } from './composables/useBurger';
import GameComponent from './components/Game.vue';

const { BurgerIngredient, burgerIngredients } = useBurger();

</script>

<template>
<div class="h-screen p-4 font-serif">
  <GameComponent/>
</div>
  
</template>

<style scoped>

</style>
