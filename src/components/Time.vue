<script setup lang="ts">
import dayjs from 'dayjs';
import UTC from 'dayjs/plugin/UTC';
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import { computed, reactive, ref } from 'vue';
// Setup Day.js
dayjs.extend(UTC);
dayjs.extend(LocalizedFormat);
// Setup time progression
let dt = reactive(dayjs.utc('1940-05-15T06:00:00Z'));
let dtTemplate = 'ddd D[th] MMM YYYY, h:mm:ss A';
let dtString = ref(dt.format(dtTemplate));

const getDtString = computed(() => {
    return dtString.value;
});

let previousTime: number|null = null;
let deltaTime = 0;
let currentMonth = dt.month();

// Logic interval
let timeInterval = 50;
setInterval(() => {
    // Progress time
    const currentTime = dayjs().valueOf();
    if (previousTime === null) {
        previousTime = dayjs().valueOf();
    } else {
        deltaTime = (currentTime - previousTime) / 1000;
        previousTime = currentTime;
    }
    dt = dt.add(1 * deltaTime, 'hour');
    dtString.value = dt.format(dtTemplate);
    // Subtract rates
    // if (dt.month() !== currentMonth) {
    //     money.value -= 500;
    //     currentMonth = dt.month();
    // }
}, timeInterval);
</script>
<template>
    <p class="font-mono">Time: {{ getDtString }}</p>
</template>