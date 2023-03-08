// Other
import dayjs from 'dayjs';
import UTC from 'dayjs/plugin/UTC';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { reactive } from 'vue';

// Setup Day.js
dayjs.extend(UTC);
dayjs.extend(LocalizedFormat);

export function useTime() {
    class Time {
        public dt: dayjs.Dayjs;

        constructor(initialTimestamp: string) {
            this.dt = dayjs.utc(initialTimestamp);
        }
    }
}