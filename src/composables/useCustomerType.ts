/**
 * Define interface for customer types, including their eating
 * and spending habits.
 * @module
 */

// Composables
import { useAbstractFood } from '@/composables/useAbstractFood';
import { usePurchase } from '@/composables/usePurchase';
import { useQualityDesire } from '@/composables/useQualityDesire';
import type { Quality } from '@/exports/ingredientEnums';

let { Product } = useAbstractFood();
let { Purchase } = usePurchase();
let { QualityDesire } = useQualityDesire();

type Product = InstanceType<typeof Product>;
type Purchase = InstanceType<typeof Purchase>;
type QualityDesire = InstanceType<typeof QualityDesire>;

/**
 * Define interface for customer types, including their eating
 * and spending habits.
 * @export
 */
export function useCustomerType() {
    class ValuedProduct {
        private _product: Product;
        public get product(): Product {
            return this._product;
        }

        private _value: number;
        public get value(): number {
            return this._value;
        }

        constructor(product: Product, value: number) {
            this._product = product;
            this._value = value;
        }
    }
    
    abstract class CustomerType {
        /**
         * Maps time of day to desire to eat (0 being no desire, 1 being
         * overwhelming desire)
         */
        public abstract desireByTime: Map<string, number>;

        /**
         * Increases the customer type's desire to eat.
         */
        public abstract desireIncreaser: number;

        /**
         * Maps time of day to hunger level (0 - Infinity)
         */
        public abstract hungerByTime: Map<string, number>;

        /**
         * Increases how much food the customer type needs to feel full.
         */
        public abstract hungerIncreaser: number;

        /**
         * Maps time of day to WTP (in this game, the maximum price the consumer
         * will pay for food).
         */
        public abstract WTPByTime: Map<string, number>;

        /**
         * Increases the customer's WTP.
         */
        public abstract WTPIncreaser: number;

        /**
         * The chance that the customer will not want food from the restaurant,
         * given that they are hungry and want food.
         * Range: [0, 1]
         */
        public abstract chanceOfTurningAway: number;

        /**
         * Desire functions for each quality.
         */
        public abstract qualityDesires: Record<Quality, QualityDesire | undefined>;

        /**
         * Find the best selection of products for the customer type at every
         * time slot (knapsack problem)
         * @returns {typeof Purchase[]} The best selection of products for
         * the customer type at every time slot. If there are no good
         * selections, returns an empty array.
         */
        public abstract findBestPurchases(): Map<string, Purchase>;

        /**
         * Calculate the probability of the customer wanting food from the
         * restaurant.
         * @returns {number} The probability of the customer wanting food from
         * the restaurant. Range: [0, 1]
         */
        public abstract calculateTrafficProbability(): number;
    }

    return {
        CustomerType,
        ValuedProduct,
    };
}