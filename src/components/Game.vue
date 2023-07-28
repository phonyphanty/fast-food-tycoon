<script setup lang="ts">
// Components
import TimeComponent from './Time.vue';
import MakeBurgerComponent from './MakeBurger.vue';
import OverviewComponent from './Overview.vue';
import StockComponent from './Stock.vue';
import ModalComponent from '@/components/Modal.vue';
// Composables
import { useQueue } from '@/composables/useQueue';
import { useModal } from '@/composables/useModal';
import { useSharedState } from '@/composables/useSharedState';
import { useSharedStockState } from '@/composables/useSharedStockState';
import { useTime } from '@/composables/useTime';
import { useMoney } from '@/composables/useMoney';
import { useStandardCustomerType } from '@/composables/useStandardCustomerType';
// Other
import { onMounted, reactive, ref, type Ref } from 'vue';

const { Queue } = useQueue();
const { Modal } = useModal();
const { money } = useSharedState();
const { stock } = useSharedStockState();
const { time } = useTime();
const { StandardCustomerType } = useStandardCustomerType();

type ModalComponent = InstanceType<typeof ModalComponent>;
type Modal = InstanceType<typeof Modal>;

const modalComponent = ref<ModalComponent | null>();

let openRestaurantModal: Modal | null = null;

let openRestaurant = ref(function() {
    modal.value = openRestaurantModal as Modal;
    modalComponent.value?.showModal();
});

const approveOpenRestaurant = function() {
    time.start();
    openRestaurant.value = () => {};
}

openRestaurantModal = reactive(
    new Modal(
        '🍔 Opening restaurant',
        'Are you sure you want to open your restaurant?',
        null,
        approveOpenRestaurant,
    )
) as Modal;

let modal: Ref<Modal> = ref(
    new Modal(
        'Placeholder',
        'Placeholder'
    )
) as Ref<Modal>;

// Other variables
let currentTab = ref('overview');

let isCurrentTab = (str: string): boolean => {
    return currentTab.value === str;
};

let setCurrentTab = (str: string): void => {
    currentTab.value = str;
}

</script>

<template>
<div class="w-4/5 m-auto h-full grid ffe-game-container">
    <header>
        <h1 class="text-center">Fast Food Empire</h1>
        <nav class="grid">
            <ul class="flex col-start-2">
                <li class="grow">
                    <button @click="setCurrentTab('overview')" class="w-full p-4 hover:bg-red-500">Overview</button>
                </li>
                <li class="grow">
                    <button @click="setCurrentTab('make-burger')" class="w-full p-4 hover:bg-red-500">Make a burger</button>
                </li>
                <li class="grow">
                    <button @click="setCurrentTab('stock')" class="w-full p-4 hover:bg-red-500">Stock</button>
                </li>
                <li class="grow">
                    <button class="w-full p-4 hover:bg-red-500">Stories</button>
                </li>
                <li class="grow">
                    <button class="w-full p-4 hover:bg-red-500">Settings</button>
                </li>
            </ul>
            <button @click="openRestaurant" class="ml-8 px-4 justify-self-end hover:bg-red-500">Open Restaurant</button>
        </nav>
    </header>
    <div class="overflow-y-hidden pt-8">
        <MakeBurgerComponent v-show="isCurrentTab('make-burger')"/>
        <OverviewComponent v-show="isCurrentTab('overview')"/>
        <StockComponent v-show="isCurrentTab('stock')"/>
    </div>
    <ModalComponent :modal="modal" ref="modalComponent" />
    <footer class="h-16 flex flex-wrap content-end font-mono">
        <TimeComponent class="h-fit w-full shrink-0"/>
        <p class="font-mono h-fit w-full shrink-0">Cash: {{ money }}</p>
    </footer>
</div>
</template>

<style scoped lang="less">
    .ffe-game-container {
        grid-template-rows: auto 1fr auto;
    }

    nav {
        grid-template-columns: 1fr auto 1fr;
    }
</style>