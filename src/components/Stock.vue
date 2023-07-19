<script setup lang="ts">
/* Composables */
import { useSharedStockState } from '@/composables/useSharedStockState';
import { useBurgerStack } from '@/composables/useBurgerStack';
import { useStock } from '@/composables/useStock';
import { useAbstractFood } from '@/composables/useAbstractFood';
/* Components */
import DashboardHeadingComponent from './DashboardHeading.vue';
import DashboardArticleHeadingComponent from './DashboardArticleHeading.vue';
import BurgerStackIconComponent from '@/components/BurgerStackIcon.vue';
import { computed } from 'vue';

const { savedStockPlan, tempStockPlan, stock } = useSharedStockState();
const { isBurgerStack } = useBurgerStack();
const { ElementQuantity } = useStock();
const { Product } = useAbstractFood();

type Product = InstanceType<typeof Product>;
type ElementQuantity<Product> = InstanceType<typeof ElementQuantity<Product>>;

const stocksAreDifferent = computed(() => {
    const savedStockMap = savedStockPlan.getMap();
    const tempStockMap = tempStockPlan.getMap();
    const tempStockKeys = [...tempStockMap.keys()];
    return tempStockKeys.some(key => {
        return tempStockMap.get(key)?.quantity !== savedStockMap.get(key)?.quantity;
    });
});

const updateQuantity = function(product: Product, e: Event) {
    if (e.target instanceof HTMLInputElement) {
        let newQuantity = Math.max(0, parseInt(e.target.value));
        newQuantity = Number.isNaN(newQuantity) ? 0 : newQuantity;
        tempStockPlan.changeQuantity(product, newQuantity);
    }
};

const saveStock = function() {
    savedStockPlan.clear();
    savedStockPlan.addProduct(...tempStockPlan.getProductQuantities());
};

const resetStock = function() {
    tempStockPlan.clear();
    tempStockPlan.addProduct(...savedStockPlan.getProductQuantities());

};

</script>

<template>
<div class="">
    <DashboardHeadingComponent content="Stock"/>
    <div class="grid grid-cols-2 gap-x-16">
        <section>
            <DashboardArticleHeadingComponent content="Stock Plan"/>
            <form @submit.prevent="saveStock" @reset.prevent="resetStock">
                <ul v-if="tempStockPlan.size() !== 0">
                    <li
                    v-for="productQuantity in tempStockPlan.getProductQuantities()"
                    :key="productQuantity.element.id"
                    class="list-disc list-inside"
                    >
                    <div class="inline-grid gap-x-4 w-11/12">
                        <BurgerStackIconComponent
                        v-if="isBurgerStack(productQuantity.element)"    
                        :icon="productQuantity.element.icon"
                        class="m-auto h-max"
                        />
                        <div>
                            {{ productQuantity.element.name }} ({{ productQuantity.element.cost }}G)
                            </div>
                            <label>
                                <span class="sr-only">Product quantity</span>
                                <input type="number" :value="productQuantity.quantity" @input="updateQuantity(productQuantity.element, $event)" class="justify-self-end">
                            </label>
                        </div>
                    </li>
                </ul>
                <p v-else class="italic font-light">Nothing's on your menu. Go make some burgers, chump!</p>
                <div class="mt-8">
                    Total cost: {{ tempStockPlan.totalCost }}
                </div>
                <div>
                    Total possible earnings: {{ tempStockPlan.totalEarnings }}
                </div>
                <div>
                    Total possible profit: {{ tempStockPlan.totalEarnings - tempStockPlan.totalCost }}
                </div>
                <button type="reset" class="mr-4" :disabled="!stocksAreDifferent">Reset</button>
                <button type="submit" aria-label="Save stock selection" class="mt-8" :disabled="!stocksAreDifferent">Save ✓</button>
            </form>
        </section>
        <section>
            <DashboardArticleHeadingComponent content="Stock Pile"/>
            <ul v-if="stock.size() > 0">
                <li
                v-for="ingredientQuantity in stock.getIngredientQuantities()"
                :key="ingredientQuantity.element.id"
                class="list-disc list-inside"
                >
                    {{ ingredientQuantity.element.name }}:
                    <span class="font-bold">{{ ingredientQuantity.quantity }}</span>
                </li>
            </ul>
            <p v-else class="italic font-light">You have no stock.</p>
        </section>
    </div>
    
</div>
</template>

<style scoped lang="less">

li {
    > div {
        grid-template-columns: auto 1fr auto;
    }
}

input[type="number"] {
    color: black;
}

</style>