<script setup lang="ts">
// Composables
import { useTime } from '@/composables/useTime';

let { time } = useTime();

</script>
<template>
    <p>Time: {{ time.dtString }}</p>
</template>