/**
 * Timekeeping -- progression and eventing logic.
 * @module
 */

// Composables
import { useSharedState } from '@/composables/useSharedState';
import { useSharedStockState } from '@/composables/useSharedStockState';
import { useStandardCustomerType } from '@/composables/useStandardCustomerType';
import { useBandwidth } from '@/composables/useBandwidth';
// Other
import dayjs from 'dayjs';
import UTC from 'dayjs/plugin/utc';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { useAbstractTime } from './useAbstractTime';
import { reactive } from 'vue';

const { money } = useSharedState();
const { stock } = useSharedStockState();
const { standardCustomerType } = useStandardCustomerType();
const { bandwidth } = useBandwidth();
const { AbstractTime } = useAbstractTime();

// Setup Day.js
dayjs.extend(UTC);
dayjs.extend(LocalizedFormat);

/**
 * Handles time ticking and eventing. The time ticking is mostly
 * done statically, but because static properties can't be reactive, we keep
 * some key properties non-static.
 */
class Time extends AbstractTime {
    private _dt: dayjs.Dayjs;
    public get dt(): dayjs.Dayjs {
        return this._dt;
    }
    private set dt(value: dayjs.Dayjs) {
        this._dt = value;
    }

    private _dtString: string;
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
        super();
        this._dt = dayjs.utc(initialTimestamp);
        this._dtString = this.dt.format(Time.dtTemplate);
    }

    public addEvent(...events: ((dt: dayjs.Dayjs) => void)[]) {
        Time.events.push(...events);
    }

    /**
     * Progress time by one tick, then run events.
     */
    private tick() {
        debugger;
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

    public start() {
        if (Time.intervalID === null) {
            Time.intervalID = setInterval(this.tick.bind(this), Time.timeInterval);
        }
    }
    
    public stop() {
        if (Time.intervalID !== null) {
            clearInterval(Time.intervalID);
        }
    }
}

const initialTime = '1940-05-15T06:00:00Z';
const time = reactive(new Time(initialTime));

let initialTimeEvents = [
    /** Buy stock every midnight */
    (function() {
        let lastDate: dayjs.Dayjs | null = null;
        return (dt: dayjs.Dayjs) => {
            const daysSinceLastDate = lastDate === null ? 1 : dt.diff(lastDate, 'day');
            if (daysSinceLastDate > 0) {
                for (let i = 0; i < daysSinceLastDate; i++) {
                    if (!stock.buyIngredients(money)) {
                        break;
                    }
                }
                lastDate = dt.startOf('day');
            }
        }
    })(),
    /** Customers buy products */
    (function() {
        let lastDate: dayjs.Dayjs | null = null;
        let customersToServe = 0;
        return (dt: dayjs.Dayjs) => {
            const msSinceLastDate = lastDate === null ? 0 : dt.diff(lastDate);
            lastDate = dt;
            debugger;
            if (msSinceLastDate > 0) {
                const customerBandwidthSinceLastDate = bandwidth.value / 60 / 60 / 1000 * msSinceLastDate; 
                const trafficProbability = standardCustomerType.calculateTrafficProbability(time);
                const customersSinceLastDate = customerBandwidthSinceLastDate * trafficProbability;
                customersToServe += customersSinceLastDate;
                if (customersToServe > 1) {
                    
                }
            }
        }
    })(),
];

time.addEvent(...initialTimeEvents);

/**
 * Export classes related to time progression and eventing.
 */
export function useTime() {
    return { 
        Time,
        time,
    };
}