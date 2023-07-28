/**
 * Handles logic pertaining to how aware customers are of the restaurant.
 * @module
 */

/**
 * Handles logic pertaining to how aware customers are of the restaurant.
 * @export
 */
export function useAwareness() {
    /**
     * Handle all awareness processing.
     */
    class Awareness {
        /** The maximum awareness value. */
        public static readonly MAX_VALUE: number = 1_000_000;

        private _value: number;
        /** The restaurant's awareness. 0 is unaware, maxAwareness is
         *  'all we think about'. */
        public get value(): number {
            return this._value;
        }
        private set value(newValue: number) {
            this._value = newValue;
        }

        /** The ten stages of the restaurant's awareness. */
        public static readonly awarenessStages: string[] = [
            'Dead',
            'Flickering',
            'Steady',
            'Bright',
            'Glowing',
            'Dazzling',
            'Blinding',
            'Bewildering',
            'Quiet contemplation',
            'Everything',
        ];

        constructor(awareness: number = 0) {
            this._value = awareness;
        }

        /**
         * Add awareness to the restaurant's total
         * @param toAdd The amount of awareness to add to the total
         * @returns The restaurant's awareness total with the added awareness
         */
        public add(toAdd: number): number {
            this.value = Math.min(Awareness.MAX_VALUE, this.value + Math.abs(toAdd));
            return this.value;
        }

        /**
         * Remove awareness from the restaurant's total
         * @param toRemove The amount of awareness to remove from the total
         * @returns The restaurant's awareness total with the awareness removed
         */
        public remove(toRemove: number): number {
            this.value = Math.max(0, this.value - Math.abs(toRemove));
            return this.value;
        }

        /**
         * @returns The restaurant's awareness stage
         */
        public toString(): string {
            return Awareness.awarenessStages[Math.floor(this.value / 10)];
        }
    }

    return {
        Awareness,
    };
}

