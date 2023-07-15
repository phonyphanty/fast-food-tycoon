/**
 * Handles logic pertaining to what qualities a customer desires in a product.
 * @module
 */

/**
 * Handles logic pertaining to what qualities a customer desires in a product.
 * @export
 */
export function useQualityDesire() {
    /**
     * Handles logic pertaining to what qualities a customer desires in a product.
     */
    abstract class QualityDesire {
        protected _maxReward: number;
        public get maxReward(): number {
            return this._maxReward;
        }

        protected _minReward: number;
        public get minReward(): number {
            return this._minReward;
        }

        protected _strength: number;
        public get strength(): number {
            return this._strength;
        }

        protected _centre: number;
        public get centre(): number {
            return this._centre;
        }

        constructor(maxReward: number, minReward: number, strength: number, centre: number) {
            this._maxReward = maxReward;
            this._minReward = minReward;
            this._strength = strength;
            this._centre = centre;
        }

        public abstract getReward(value: number): number;
    }

    /**
     * Desire modelled after a parabola.
     */
    class ParabolicQualityDesire extends QualityDesire {
        constructor(maxReward: number, minReward: number, strength: number, centre: number) {
            super(maxReward, minReward, strength, centre);
        }

        public getReward(value: number): number {
            return Math.max(
                -Math.abs(this.strength) * (value - this.centre)**2 + this.maxReward,
                this.minReward
            );
        }
    }

    /**
     * Desire modelled after a line.
     */
    class LinearQualityDesire extends QualityDesire {
        constructor(maxReward: number, minReward: number, strength: number, centre: number) {
            super(maxReward, minReward, strength, centre);
        }

        public getReward(value: number): number {
            return Math.max(
                Math.min(
                    this.strength * value - this.centre,
                    this.maxReward
                ),
                this.minReward
            );
        }
    }

    return {
        QualityDesire,
        ParabolicQualityDesire,
        LinearQualityDesire,
    }
}