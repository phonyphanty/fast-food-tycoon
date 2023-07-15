/**
 * Handles logic pertaining to the restaurant's reputation.
 * @module
 */

/**
 * Handles logic pertaining to the restaurant's reputation.
 *
 * @export
 */
export function useReputation() {
    /**
     * Handle all reputation processing.
     */
    class Reputation {
        /** The maximum reputation value. */
        public static readonly MAX_VALUE: number = 1000000;

        private _value: number;
        /** The restaurant's reputation. 0 is poor, maxReputation is
         *  excellent. */
        public get value(): number {
            return this._value;
        }
        private set value(newValue: number) {
            this._value = newValue;
        }

        /** The ten stages of the restaurant's reputation. */
        public static readonly reputationStages: string[] = [
            'Awful',
            'Poor',
            'Fair',
            'Good',
            'Great',
            'Excellent',
            'Staggering',
            'Terrifying',
            'A sombre awe',
            'Everything',
        ];

        constructor(reputation: number = 0) {
            this._value = reputation;
        }

        /**
         * Add reputation to the restaurant's total
         * @param toAdd The amount of reputation to add to the total
         * @returns The restaurant's reputation total with the added reputation
        */
       public add(toAdd: number): number {
           this.value = Math.min(100, this.value + Math.abs(toAdd));
           return this.value;
        }

        /**
         * Remove reputation from the restaurant's total
         * @param toRemove The amount of reputation to remove from the total
         * @returns The restaurant's reputation total with the reputation removed
        */
       public remove(toRemove: number): number {
           this.value = Math.max(0, this.value - Math.abs(toRemove));
           return this.value;
        }

        /**
         * @returns The restaurant's reputation stage
         */
        public toString(): string {
            return Reputation.reputationStages[Math.floor(this.value / 10)];
        }
    }

    return {
        Reputation,
    };
}