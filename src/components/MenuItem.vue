<script setup lang="ts">
/* Composables */
import { useSharedState } from '@/composables/useSharedState';
import { useAbstractFood } from '@/composables/useAbstractFood';
import { useBurgerStack } from '@/composables/useBurgerStack';

const { Product } = useAbstractFood();
const { BurgerStack, isBurgerStack, BurgerStackIcon } = useBurgerStack();
const { mainMenu } = useSharedState();

type Product = InstanceType<typeof Product>;
type BurgerStack = InstanceType<typeof BurgerStack>;
type BurgerStackIcon = InstanceType<typeof BurgerStackIcon>;

const props = defineProps<{
    product: Product,
}>();

</script>

<template>
<article class="gap-x-4">
    <div class="m-auto h-max">
        <div
            v-if="isBurgerStack(product)"
            v-for="el in product.icon.elements"
            class="border-t-4"
            :class="el"
        ></div>
    </div>
    <p class="space-x-1.5 w-full m-auto h-max">
        <span>{{ product.name }}</span>
        <span>({{ product.price }}<span class="text-yellow-200 font-bold text-xs ml-0.5">G</span>)</span>
    </p>
    <button class="justify-self-end bg-red-500 h-max m-auto" @click="mainMenu.delete(product)">DEL</button>
</article>
</template>

<style scoped lang="less">

article {
    grid-template-columns: auto 1fr auto;
    display: grid;
    padding: 0.3rem;
    padding-bottom: 0.3rem;
    border-bottom-width: 0.1rem;
    border-bottom-style: solid;
    padding-bottom: 0.5rem;
    border-image: linear-gradient(to right, transparent, white, transparent) 5;

    > div {
        width: 1.5rem;
    }

    > button {
        width: 3rem;
    }
}

</style>