<script setup lang="ts">
/* Composables */
import { useBurger } from '@/composables/useBurger';
import { useBurgerStack } from '@/composables/useBurgerStack';
import { useCombinationResult } from '@/composables/useCombinationResult';
import { useUnique } from '@/composables/useUnique';
import { useSharedState } from '@/composables/useSharedState';
/* Components */
import BurgerIngredientComponent from './BurgerIngredient.vue';
/* Misc. */
import { computed, reactive, ref, type Ref } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, type PluginOptionsByType } from 'chart.js';

const { DescriptiveCombinationResult } = useCombinationResult();
const { burgerIngredients } = useBurger();
const { BurgerStack } = useBurgerStack();
const { UniqueObject } = useUnique();
const { mainMenu } = useSharedState();

type DescriptiveCombinationResult = InstanceType<typeof DescriptiveCombinationResult>;
type UniqueObject<T> = InstanceType<typeof UniqueObject<T>>;

let burgerStack = reactive(new BurgerStack());
let selectedIngredient = ref(0);
let results: Ref<UniqueObject<DescriptiveCombinationResult>[]> = ref([]);
let price = ref(0);

const ingredientOption = (ingredient: any): string =>
    ingredient.name + ' (' + ingredient.costToString() + 'G)';

const evaluate = () => {
    const newResults = burgerStack.evaluate();
    while (results.value.length > 0) results.value.pop();
    newResults.forEach((result: DescriptiveCombinationResult) => {
        if (result.combinationResult.isSuccess) {
            results.value.push(new UniqueObject<DescriptiveCombinationResult>(result));
        }
    });
}

const callAndEvaluate = (success: boolean): void => {
    if (success) evaluate();
}

const addIngredient = () => {
    callAndEvaluate(burgerStack.add(burgerIngredients.value[selectedIngredient.value]))
}

const deleteIngredient = (index: number) => {
    callAndEvaluate(burgerStack.deleteIndex(index));
};

const moveIngredient = (index1: number, index2: number) => {
    try {
        callAndEvaluate(burgerStack.swapIndex(index1, index2));
    } catch {
        ; // do nothing
    }
}

const costString = computed(() => {
    return burgerStack.cost.toFixed(2);
})

const markup = computed(() => {
    let price = (burgerStack.price as any) === '' ? 0 : burgerStack.price;
    if (price === 0) {
        return -(burgerStack.cost * 100).toFixed();
    } else if (burgerStack.cost === 0) {
        return (price * 100).toFixed();
    } else {
        return ((price - burgerStack.cost) / burgerStack.cost * 100).toFixed();
    }
})

const moveIngredientUp = (index: number) => moveIngredient(index, index-1);
const moveIngredientDown = (index: number) => moveIngredient(index, index+1);

evaluate();

const saveBurger = () => {
    console.log(burgerStack.icon.elements);
    mainMenu.add(burgerStack.deepCopy());
    console.log(mainMenu);
    if (burgerStack.reset()) {
        evaluate();
    } else {
        throw new Error('Burger stack reset failed after burger save');
    }
}


ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

let chartOptions = reactive({
    responsive: true,
    maintainAspectRatio: false,
    type: 'bar',
    indexAxis: 'y',
    barThickness: 22,
    elements: {
        bar: {
            backgroundColor: '#ffffff',
            hoverBackgroundColor: '#ffffff',
        }
    },
    scales: {
        x: {
            display: false,
            min: -25,
            max: 25,
        },
        y: {
            display: false,
        }
    },
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            enabled: false,
        }
    }
})

</script>

<template>
<div>
    <h2 class="uppercase italic text-center mb-8">Make a Burger</h2>
    <div class="h-full w-full grid grid-cols-3 grid-rows-1">
        <div>
            <form @submit.prevent="addIngredient" class="space-x-2">
            <label>
                <span class="sr-only">Select an ingredient</span>
                <select name="ingredients" v-model="selectedIngredient" class="text-black w-full text-ellipses">
                    <option v-for="(ingredient, index) in burgerIngredients"
                    :value="index">
                        {{ ingredientOption(ingredient) }}
                    </option>
                </select>
            </label>
            <button type="submit">Add +</button>
            </form>
            <form @submit.prevent="saveBurger" class="mt-6 space-y-2">
                <label class="block">
                    <span class="pr-2">Name:</span>
                    <input v-model="burgerStack.name" type="text" class="pl-1"/>
                </label>
                <label class="block">
                    <span class="pr-2">Price:</span>
                    <input v-model="burgerStack.price" type="number" class="pl-1"/>
                    <span>G</span>
                </label>
                <label class="block">
                    <span class="pr-2">Production cost:</span>
                    <input v-model="burgerStack.cost" type="number" readonly class="pl-1"/>
                    <span>G</span>
                </label>
                <label class="block">
                    <span class="pr-2">Markup:</span>
                    <input v-model="markup" type="number" readonly class="pl-1"/>
                    <span>%</span>
                </label>
                <button type="submit" class="block">Save ✓</button>
            </form>
        </div>
        <div class="h-full overflow-y-auto overflow-x-hidden pr-3 pl-8" style="scrollbar-gutter: stable; scrollbar-width: thin;">
            <div class="relative">
                <TransitionGroup name="burgerStack">
                    <article 
                    v-for="(ingredient, index) in burgerStack.ingredients" 
                    :key="ingredient.id"
                    class="w-full mb-2">
                        <BurgerIngredientComponent
                            :ingredient="ingredient.value"
                        />
                        <div class="flex flex-wrap justify-end gap-x-2">
                            <button class="flex-initial" @click="moveIngredientUp(index)">🠕 Up</button>
                            <div class="flex-initial text-gray-300 select-none" aria-hidden="true">|</div>
                            <button class="flex-initial" @click="moveIngredientDown(index)">🠗 Down</button>
                            <div class="flex-initial text-gray-300 select-none" aria-hidden="true">|</div>
                            <button class="flex-initial custom-nudge-bottom-left" @click="deleteIngredient(index)">❌</button>
                        </div>
                    </article>
                </TransitionGroup>
            </div>
        </div>
        <div class="text-right pl-4">
            <div class="border-solid border-b-4 border-white pb-4">
                <h3 class="uppercase italic text-xl pb-1">Qualities</h3>
                <ul class="space-y-2">
                    <li
                    v-for="([quality, value]) in burgerStack.qualities.qualities.entries()"
                    :key="quality"
                    class="flex flex-wrap justify-end gap-x-2 items-center">
                        <span>
                            {{ quality }}:
                        </span>
                        <div class="max-w-full">
                            <Bar
                            :chart-options="chartOptions"
                            :chart-data="{
                                labels: [quality],
                                datasets: [{
                                    data: [value],
                                }],
                            }"
                            :css-classes="'relative w-20 max-w-full h-8 flex items-center border border-solid border-white rounded-md bg-no-repeat bg-center bg-[length:1px_72%]'"
                            class="p-1"
                            style="background-image: linear-gradient(#fff, #fff)"
                            />
                        </div>
                    </li>
                </ul>
            </div>  
            <div class="mt-4">
                <h3 class="uppercase italic text-xl pb-1">Combinations</h3>
                <ul>
                    <li
                    v-for="result in results"
                    :key="result.id">
                        {{ result.value.name }} (x{{ result.value.combinationResult.successCount}})
                    </li>
                </ul>
            </div>
        </div>
    </div>
</div>
</template>

<style scoped>
.custom-nudge-bottom-left {
    position: relative;
    top: 0.1rem;
    right: 0.2rem;
}

input {
    color: black;
}

.burgerStack-enter-active
{
    transition: all 0.5s ease;
}

.burgerStack-move,
.burgerStack-leave-active  {
    transition: all 0.08s ease;
}

.burgerStack-enter-from,
.burgerStack-leave-to {
    opacity: 0;
    transform: translateX(2rem);
}

.burgerStack-enter-from {
    transform: translateX(-2rem);
}

.burgerStack-leave-active {
    position: absolute;
}
</style>