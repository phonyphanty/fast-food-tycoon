/**
 * Timekeeping -- progression and eventing logic.
 * @module
 */

// Other
import type dayjs from 'dayjs';

/**
 * Export classes related to time progression and eventing.
 */
export function useAbstractTime() {
    /**
     * Handles time ticking and eventing. The time ticking is mostly
     * done statically, but because static properties can't be reactive, we keep
     * some key properties non-static.
     */
    abstract class AbstractTime {
        /** The game timer */
        public abstract dt: dayjs.Dayjs;

        /** String representation of the game timer (follows Time.dtTemplate
         *  format) */
        public abstract dtString: string;

        /** Add an event to the list of events that are triggered each tick */
        public abstract addEvent(...events: ((dt: dayjs.Dayjs) => void)[]): void;

        /**
         * Start ticking time. Only one instance of Time can tick time.
         */
        public abstract start(): void;

        /**
         * Stop ticking time.
         */
        public abstract stop(): void;
    }

    return { AbstractTime };
}