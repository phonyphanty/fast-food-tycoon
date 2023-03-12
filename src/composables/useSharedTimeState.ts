/**
 * Global singletons related to timekeeping
 * @module
 */

// Composables
import { useTime } from '@/composables/useTime';
import { reactive } from 'vue';

const { Time } = useTime();

const initialTime = '1940-05-15T06:00:00Z';
const time = reactive(new Time(initialTime));

export function useSharedTimeState() {
    return {
        time,
    }
}