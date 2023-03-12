<script setup lang="ts">
// Composables
import { useSharedTimeState } from '@/composables/useSharedTimeState';

let { time } = useSharedTimeState();

</script>
<template>
    <p>Time: {{ time.dtString }}</p>
</template>