<script setup lang="ts">
/* Composables */
import { useBurgerStack } from '@/composables/useBurgerStack';

const { BurgerStackIcon } = useBurgerStack();

type BurgerStackIcon = InstanceType<typeof BurgerStackIcon>;

defineProps<{
    icon: BurgerStackIcon,
}>();

</script>

<template>
<div>
    <div
        v-for="el in icon.elements"
        class="border-t-4 w-6"
        :class="el"
    ></div>
</div>
</template>