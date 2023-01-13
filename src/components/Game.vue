<script setup lang="ts">
// Import
import { ref, type Ref } from 'vue';
import TimeComponent from './Time.vue';
import MakeBurgerComponent from './MakeBurger.vue';
import OverviewComponent from './Overview.vue';
// Other variables
let money: Ref<number> = ref(1000);
let currentTab = ref('overview');

let isCurrentTab = (str: string): boolean => {
    return currentTab.value === str;
};

let setCurrentTab = (str: string): void => {
    currentTab.value = str;
}

</script>

<template>
<div class="w-4/5 m-auto">
    <header>
        <h1 class="text-center">Fast Food Empire</h1>
        <nav class="flex justify-center">
            <ul class="flex w-1/2">
                <li class="grow">
                    <button @click="setCurrentTab('overview')" class="w-full p-4 hover:bg-red-500">Overview</button>
                </li>
                <li class="grow">
                    <button @click="setCurrentTab('make-burger')" class="w-full p-4 hover:bg-red-500">Make a burger</button>
                </li>
                <li class="grow">
                    <button class="w-full p-4 hover:bg-red-500">Stock</button>
                </li>
                <li class="grow">
                    <button class="w-full p-4 hover:bg-red-500">Stories</button>
                </li>
                <li class="grow">
                    <button class="w-full p-4 hover:bg-red-500">Settings</button>
                </li>
            </ul>
        </nav>
    </header>
    <div>
        <MakeBurgerComponent v-show="isCurrentTab('make-burger')"/>
        <OverviewComponent v-show="isCurrentTab('overview')"/>
    </div>
    <TimeComponent/>
    <p class="font-mono">Cash: {{ money }}</p>
</div>
</template>

<style scoped>


</style>