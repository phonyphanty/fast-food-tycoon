/**
 * Handles logic pertaining to the company's bandwidth (how many customers it
 * can serve in a given second)
 * @module
 */

import { reactive } from "vue";

/**
 * Handles logic pertaining to the company's bandwidth (how many customers it
 * can serve in a given second)
 * @export
 */
export function useBandwidth() {
    /**
     * Handles logic pertaining to the company's bandwidth (how many customers it
     * can serve in a given hour)
     */
    class Bandwidth {
        /** The maximum bandwidth. */
        public static readonly MAX_VALUE: number = 8_000_000;

        private _value: number;
        /** The company's bandwidth. */
        public get value(): number {
            return this._value;
        }
        private set value(newValue: number) {
            this._value = newValue;
        }

        /** The stages of the company's bandwidth. */
        public static readonly bandwidthStages: string[] = [
            'Sated',
            'Content',
            'Peckish',
            'Hungry',
            'Rapacious',
            'Swinish',
            'Hollow and drooling',
            'Unslakable',
        ];

        constructor(bandwidth: number = 10) {
            this._value = bandwidth;
        }

        /**
         * Add bandwidth to the restaurant's total
         * @param toAdd The amount of bandwidth to add to the total
         * @returns The restaurant's bandwidth total with the added bandwidth
        */
       public add(toAdd: number): number {
           this.value = Math.min(Bandwidth.MAX_VALUE, this.value + Math.abs(toAdd));
           return this.value;
        }

        /**
         * Remove bandwidth from the restaurant's total
         * @param toRemove The amount of bandwidth to remove from the total
         * @returns The restaurant's bandwidth total with the bandwidth removed
        */
       public remove(toRemove: number): number {
           this.value = Math.max(0, this.value - Math.abs(toRemove));
           return this.value;
        }

        /**
         * @returns The restaurant's reputation stage
         */
        public toString(): string {
            return Bandwidth.bandwidthStages[Math.floor(this.value / 10)];
        }
    }

    const bandwidth = reactive(new Bandwidth());

    return {
        Bandwidth,
        bandwidth,
    };
}