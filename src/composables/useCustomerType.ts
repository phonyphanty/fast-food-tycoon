/**
 * Define interface for customer types, including their eating
 * and spending habits.
 * @module
 */

// Composables
import { useAbstractFood } from '@/composables/useAbstractFood';
import { usePurchase } from '@/composables/usePurchase';
import { useQualityDesire } from '@/composables/useQualityDesire';
import { useAbstractMenu } from '@/composables/useAbstractMenu';
import type { Quality } from '@/exports/ingredientEnums';
import { useAbstractTime } from '@/composables/useAbstractTime';

let { Product } = useAbstractFood();
let { Purchase } = usePurchase();
let { QualityDesire, UncentredQualityDesire } = useQualityDesire();
const { AbstractMenu } = useAbstractMenu();
const { AbstractTime } = useAbstractTime();

type Product = InstanceType<typeof Product>;
type Purchase = InstanceType<typeof Purchase>;
type QualityDesire = InstanceType<typeof QualityDesire>;
type UncentredQualityDesire = InstanceType<typeof UncentredQualityDesire>;
type AbstractMenu = InstanceType<typeof AbstractMenu>;
type AbstractTime = InstanceType<typeof AbstractTime>;

class GradedPurchase {
    purchase: Purchase;
    probabilityOfSuccess: number;

    constructor(purchase: Purchase, probabilityOfSuccess: number) {
        this.purchase = purchase;
        this.probabilityOfSuccess = probabilityOfSuccess;
    }
};

/**
 * Define interface for customer types, including their eating
 * and spending habits.
 * @export
*/
class ValuedProduct {
    private _product: Product;
    public get product(): Product {
        return this._product;
    }

    private _value: number;
    public get value(): number {
        return this._value;
    }

    private _satiety: number;
    public get satiety(): number {
        return this._satiety;
    }

    constructor(product: Product, value: number, satiety: number) {
        this._product = product;
        this._value = value;
        this._satiety = satiety;
    }
}

abstract class CustomerType {
    /**
     * Maps time of day to the best purchases for that time of day.
     */
    public abstract bestPurchases: Map<string, GradedPurchase[]>;

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
     * The optimal value of a product to the customer type.
     */
    public abstract maxValue: number;

    /**
     * The worst value of a product to the customer type.
     */
    public abstract minValue: number;

    /**
     * Desire function for satiety -- operates on a purchase-level, rather
     * than a product-level.
     */
    public abstract satietyDesire: UncentredQualityDesire;

    /**
     * Find the best selection of products for the customer type at every
     * Map<string, Purchase[]>
     * @returns The best selection of products for
     * the customer type at every time slot. If there are no good
     * selections, returns an empty array.
     */
    public abstract findBestPurchases(menu: AbstractMenu, time: AbstractTime): Map<string, GradedPurchase[]>;

    /**
     * Calculate the probability of the customer wanting food from the
     * restaurant.
     * @returns {number} The probability of the customer wanting food from
     * the restaurant. Range: [0, 1]
     */
    public abstract calculateTrafficProbability(time: AbstractTime): number;
}

export function useCustomerType() {
    return {
        CustomerType,
        ValuedProduct,
        GradedPurchase,
    };
}