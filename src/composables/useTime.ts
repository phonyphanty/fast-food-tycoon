/**
 * Timekeeping -- progression and eventing logic.
 * @module
 */

// Composables
import { useSharedState } from '@/composables/useSharedState';
import { useSharedStockState } from '@/composables/useSharedStockState';
// Other
import dayjs from 'dayjs';
import UTC from 'dayjs/plugin/utc';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

let { money } = useSharedState();
let { stock } = useSharedStockState();

// Setup Day.js
dayjs.extend(UTC);
dayjs.extend(LocalizedFormat);

/**
 * Export classes related to time progression and eventing.
 */
export function useTime() {
    /**
     * Handles time ticking and eventing. The time ticking is mostly
     * done statically, but because static properties can't be reactive, we keep
     * some key properties non-static.
     */
    class Time {
        private _dt: dayjs.Dayjs;
        /** The game timer */
        public get dt(): dayjs.Dayjs {
            return this._dt;
        }
        private set dt(value: dayjs.Dayjs) {
            this._dt = value;
        }
        private _dtString: string;
        /** String representation of the game timer (follows Time.dtTemplate
         *  format) */
        public get dtString(): string {
            return this._dtString;
        }
        private set dtString(value: string) {
            this._dtString = value;
        }
        /** The previous date/time's number of Unix milliseconds */
        private static previousTime: number|null = null;
        /** The number of hours since the previous time (should be a fraction of
         *  an hour)
        */
        private static deltaTime: number = 0;
        /** The ID of the time tick interval */
        private static intervalID: number|null = null;
        /** The template that date/time strings should be formatted by */
        private static dtTemplate = 'ddd D[th] MMM YYYY, h:mm:ss A';
        /** The number of milliseconds between each tick */
        private static timeInterval = 50;
        /** Events that should be triggered each tick */
        private static events: ((dt: dayjs.Dayjs) => void)[] = [];

        constructor(initialTimestamp: string) {
            this._dt = dayjs.utc(initialTimestamp);
            this._dtString = this.dt.format(Time.dtTemplate);
        }

        /** Add an event to the list of events that are triggered each tick */
        public static addEvent(...events: ((dt: dayjs.Dayjs) => void)[]) {
            Time.events.push(...events);
        }

        /**
         * Progress time by one tick, then run events.
         */
        private tick() {
            // Progress time
            const currentTime = dayjs().valueOf();
            if (Time.previousTime === null) {
                Time.previousTime = dayjs().valueOf();
            } else {
                Time.deltaTime = (currentTime - Time.previousTime) / 1000;
                Time.previousTime = currentTime;
            }
            this.dt = this.dt.add(1 * Time.deltaTime, 'hour');
            this.dtString = this.dt.format(Time.dtTemplate);
            // Handle events
            Time.events.forEach(timeEvent => {
                timeEvent(this.dt);
            });
        }

        /**
         * Start ticking time. Only one instance of Time can tick time.
         */
        start() {
            if (Time.intervalID === null) {
                Time.intervalID = setInterval(this.tick.bind(this), Time.timeInterval);
            }
        }

        /**
         * Stop ticking time.
         */
        stop() {
            if (Time.intervalID !== null) {
                clearInterval(Time.intervalID);
            }
        }
    }

    let initialTimeEvents = [
        /** Buy stock every midnight */
        (function() {
            let lastDate: dayjs.Dayjs | null = null;
            return (dt: dayjs.Dayjs) => {
                const daysSinceLastTime = lastDate === null ? 1 : dt.diff(lastDate, 'day');
                if (daysSinceLastTime > 0) {
                    for (let i = 0; i < daysSinceLastTime; i++) {
                        if (!stock.buyIngredients(money)) {
                            break;
                        }
                    }
                    lastDate = dt.startOf('day');
                }
            }
        })(),
    ];

    Time.addEvent(...initialTimeEvents);

    return { Time };
}