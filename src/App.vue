<script setup lang="ts">
import { useBurger } from './composables/useBurger';
//import BurgerStackComponent from './components/MakeBurger.vue';
import GameComponent from './components/Game.vue';

const { BurgerIngredient, burgerIngredients } = useBurger();

</script>

<template>
<div class="h-screen p-4 font-serif">
  <!-- <BurgerStackComponent/> -->
  <GameComponent/>
</div>
  
</template>

<style scoped>

</style>
