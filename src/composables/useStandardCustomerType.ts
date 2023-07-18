/**
 * Handles logic pertaining to the 'standard' customer type.
 * @module
 */

// Composables
import { useCustomerType } from "@/composables/useCustomerType";
import { useAbstractFood } from "@/composables/useAbstractFood";
import { usePurchase } from "@/composables/usePurchase";
import { useReputation } from "@/composables/useReputation";
import { useAwareness } from "@/composables/useAwareness";
import { useSharedState } from "@/composables/useSharedState";
import { useSharedTimeState } from "@/composables/useSharedTimeState";
import { useQualityDesire } from "./useQualityDesire";
import { Quality } from "@/exports/ingredientEnums";
import { useBurgerStack } from "@/composables/useBurgerStack";
import { useStock } from "@/composables/useStock";

let { Product, Ingredient } = useAbstractFood();
let { CustomerType, ValuedProduct } = useCustomerType();
let { Purchase } = usePurchase();
let { Reputation } = useReputation();
let { Awareness } = useAwareness();
let { reputation, awareness, mainMenu } = useSharedState();
let { time } = useSharedTimeState();
let { QualityDesire, ParabolicQualityDesire, LinearQualityDesire, UncentredQualityDesire, UncentredParabolicQualityDesire } = useQualityDesire();
let { isBurgerStack } = useBurgerStack();
let { ElementQuantity } = useStock();

type ValuedProduct = InstanceType<typeof ValuedProduct>;
type Product = InstanceType<typeof Product>;
type Purchase = InstanceType<typeof Purchase>;
type QualityDesire = InstanceType<typeof QualityDesire>;
type ParabolicQualityDesire = InstanceType<typeof ParabolicQualityDesire>;
type LinearQualityDesire = InstanceType<typeof LinearQualityDesire>;
type ElementQuantity<T> = InstanceType<typeof ElementQuantity<T>>;
type UncentredParabolicQualityDesire = InstanceType<typeof UncentredParabolicQualityDesire>;
type UncentredQualityDesire = InstanceType<typeof UncentredQualityDesire>;

class ValueMetadata {
    private _value: number;
    public get value(): number {
        return this._value;
    }

    private _satiety: number;
    public get satiety(): number {
        return this._satiety;
    }

    private _product: Product | undefined;
    public get product(): Product | undefined {
        return this._product;
    }

    private _ref: [number, number] | undefined;
    public get ref(): [number, number] | undefined {
        return this._ref;
    }

    constructor(value: number, satiety: number, product?: Product, ref?: [number, number]) {
        this._value = value;
        this._satiety = satiety;
        this._product = product;
        this._ref = ref;
    }
}

/**
 * Handles logic pertaining to the 'standard' customer type.
 * @export
 */
export function useStandardCustomerType() {
    /**
     * Handle all standard customer type logic.
     */
    class StandardCustomerType extends CustomerType {
        private _desireByTime: Map<string, number> = new Map([
            ['00:00:00', 0.1],
            ['01:00:00', 0.1],
            ['02:00:00', 0.1],
            ['03:00:00', 0.1],
            ['04:00:00', 0.1],
            ['05:00:00', 0.2],
            ['06:00:00', 0.7],
            ['07:00:00', 1.0],
            ['08:00:00', 0.7],
            ['09:00:00', 0.2],
            ['10:00:00', 0.1],
            ['11:00:00', 0.6],
            ['12:00:00', 1.0],
            ['13:00:00', 0.9],
            ['14:00:00', 0.5],
            ['15:00:00', 0.2],
            ['16:00:00', 0.3],
            ['17:00:00', 0.1],
            ['18:00:00', 1.0],
            ['19:00:00', 0.8],
            ['20:00:00', 0.5],
            ['21:00:00', 0.2],
            ['22:00:00', 0.1],
            ['23:00:00', 0.1],
        ]);
        public get desireByTime(): Map<string, number> {
            return this._desireByTime;
        }

        private _desireIncreaser: number = 0;
        public get desireIncreaser(): number {
            return this._desireIncreaser;
        }

        private _hungerByTime: Map<string, number> = new Map([
            ['00:00:00', 5],
            ['01:00:00', 5],
            ['02:00:00', 5],
            ['03:00:00', 5],
            ['04:00:00', 5],
            ['05:00:00', 10],
            ['06:00:00', 10],
            ['07:00:00', 10],
            ['08:00:00', 10],
            ['09:00:00', 10],
            ['10:00:00', 10],
            ['11:00:00', 12],
            ['12:00:00', 12],
            ['13:00:00', 12],
            ['14:00:00', 5],
            ['15:00:00', 5],
            ['16:00:00', 5],
            ['17:00:00', 5],
            ['18:00:00', 12],
            ['19:00:00', 12],
            ['20:00:00', 12],
            ['21:00:00', 5],
            ['22:00:00', 5],
            ['23:00:00', 5],
        ]);
        public get hungerByTime(): Map<string, number> {
            return this._hungerByTime;
        }

        private _hungerIncreaser: number = 0;
        public get hungerIncreaser(): number {
            return this._hungerIncreaser;
        }

        private _WTPByTime: Map<string, number> = new Map([
            ['00:00:00', 10],
            ['01:00:00', 10],
            ['02:00:00', 10],
            ['03:00:00', 10],
            ['04:00:00', 10],
            ['05:00:00', 10],
            ['06:00:00', 15],
            ['07:00:00', 15],
            ['08:00:00', 15],
            ['09:00:00', 15],
            ['10:00:00', 10],
            ['11:00:00', 20],
            ['12:00:00', 20],
            ['13:00:00', 20],
            ['14:00:00', 10],
            ['15:00:00', 10],
            ['16:00:00', 10],
            ['17:00:00', 10],
            ['18:00:00', 25],
            ['19:00:00', 25],
            ['20:00:00', 25],
            ['21:00:00', 10],
            ['22:00:00', 10],
            ['23:00:00', 10],
        ]);
        public get WTPByTime(): Map<string, number> {
            return this._WTPByTime;
        }

        private _WTPIncreaser: number = 0;
        public get WTPIncreaser(): number {
            return this._WTPIncreaser;
        }

        private _chanceOfTurningAway: number = 0.1;
        public get chanceOfTurningAway(): number {
            return this._chanceOfTurningAway;
        }

        public _qualityDesires: Record<Quality, QualityDesire | undefined> = {
            [Quality.Umami]: new LinearQualityDesire(10, -4, 1, 1),
            [Quality.Aroma]: new LinearQualityDesire(10, -8, 1, 0),
            [Quality.Sweetness]: new ParabolicQualityDesire(2, -2, 0.5, 1),
            [Quality.Sourness]: new LinearQualityDesire(0, -4, -1, 0),
            [Quality.Spiciness]: new LinearQualityDesire(0, -4, -1, 0),
            [Quality.Softness]: new ParabolicQualityDesire(7, -4, 0.5, 5),
            [Quality.Presentation]: new LinearQualityDesire(10, -15, 1, 2),
            [Quality.Satiety]: new ParabolicQualityDesire(2, -2, 0.1, 5),
        }
        public get qualityDesires(): Record<Quality, QualityDesire | undefined> {
            return this._qualityDesires;
        }

        public _maxValue: number = 25;
        public get maxValue(): number {
            return this._maxValue;
        }

        public _minValue: number = -25;
        public get minValue(): number {
            return this._minValue;
        }

        public _satietyDesire: UncentredParabolicQualityDesire = 
            new UncentredParabolicQualityDesire(5, -5, 2);
        public get satietyDesire(): UncentredParabolicQualityDesire {
            return this._satietyDesire;
        }

        constructor() {
            super();
        }

        /**
         * Given products, push all product qualities through their quality 
         * desire function.
         * @param products 
         * @returns a list of all products and their associated values
         */
        private valueProducts(products: Product[]): ValuedProduct[] {
            const valuedProducts: ValuedProduct[] = [];
            products.forEach(product => {
                if (isBurgerStack(product)) {
                    let productValue = 0;
                    let productSatiety = 0;
                    for (const [quality, value] of product.qualities.entries()) {
                        // Value
                        const qualityDesire = this.qualityDesires[quality];
                        if (qualityDesire !== undefined) {
                            productValue += qualityDesire.getReward(value);
                        }
                        // Satiety
                        if (quality === Quality.Satiety) {
                            productSatiety += value;
                        }
                    }
                    valuedProducts.push(new ValuedProduct(product, productValue, productSatiety));
                } else {
                    throw new Error(`Unknown product type: ${product.constructor.name}}`);
                }
            });
            debugger;
            return valuedProducts;
        }

        /**
         * Given a list of products, find the best purchases for the current
         * time.
         */
        public findBestPurchases(): Map<string, Purchase> {
            const maxWTP = Array.from(this.WTPByTime.values())
                .reduce((previous, current) => Math.max(previous, current), 0);
            const valuedProducts = this.valueProducts(mainMenu.get());
            // Find the best purchases through bottom-up unbounded knapsack
            const n = valuedProducts.length + 1;
            const matrix: Array<Array<ValueMetadata>> = Array<Array<ValueMetadata>>(n);
            for (let i = 0; i < n; i++) {
                matrix[i] = Array<ValueMetadata>(maxWTP + 1).fill(new ValueMetadata(0, 0));
            }
            // Go through each row of matrix
            for (let i = 1; i < n; i++) {
                const valuedProduct = valuedProducts[i - 1];
                const product = valuedProduct.product;
                // Go through each column of matrix
                for (let j = 1; j <= maxWTP; j++) {
                    const prevI = matrix[i - 1][j];
                    // Can we fit the product in our knapsack?
                    if (product.price <= j) {
                        const withWtpTaken = matrix[i][j - product.price];
                        const newSatiety = valuedProduct.satiety + withWtpTaken.satiety;
                        const addedValue = valuedProduct.value + withWtpTaken.value;
                        const currentTime = time.dt.startOf('hour').format('HH:mm:ss');
                        const currentHunger = this.hungerByTime.get(currentTime);
                        if (currentHunger === undefined) {
                            throw new Error(`Could not find current time in hungerByTime: ${currentTime}`);
                        }
                        const newValue = addedValue + this.satietyDesire.getReward(addedValue, currentHunger);
                        // Is it worth it to take the current product?
                        if (newValue > prevI.value) {
                            debugger;
                            matrix[i][j] = new ValueMetadata(
                                newValue,
                                newSatiety,
                                product,
                                [i, j - product.price]
                            );
                            continue;
                        // Is it worth it to not take anything?
                        } else if (withWtpTaken.value > prevI.value) {
                            debugger;
                            matrix[i][j] = new ValueMetadata(
                                withWtpTaken.value,
                                withWtpTaken.satiety,
                                undefined,
                                [i, j - product.price]
                            )
                            continue;
                        }
                    }
                    // Otherwise, just go with i - 1
                    debugger;
                    matrix[i][j] = prevI;
                }
            }
            const purchaseByHour = new Map<string, Purchase>();
            const uniqueWTPs = Array.from(this.WTPByTime.values())
                .filter((value, index, self) => self.indexOf(value) === index);
            uniqueWTPs.forEach(wtp => {
                // Trace back through the matrix to find the best purchase
                const products: ElementQuantity<Product>[] = [];
                let i = n - 1;
                let j = wtp;
                while (i > 0 && j > 0) {
                    const valueMetadata = matrix[i][j];
                    // Take product if available
                    if (valueMetadata.product !== undefined) {
                        const productQuantity = products.find(product => product.element === valueMetadata.product);
                        if (productQuantity === undefined) {
                            products.push(new ElementQuantity(valueMetadata.product, 1));
                        } else {
                            productQuantity.quantity++;
                        }
                    }
                    // Go to next cell or break if purchase is finished
                    if (valueMetadata.ref !== undefined) {
                        i = valueMetadata.ref[0];
                        j = valueMetadata.ref[1];
                    } else {
                        break;
                    }
                }
                const value = matrix[n - 1][wtp].value;
                const constrainedValue = Math.min(Math.max(value, this.minValue), this.maxValue);
                const normalisedValue = (constrainedValue - this.minValue) / (this.maxValue - this.minValue);
                const purchase = new Purchase(products, normalisedValue, StandardCustomerType);
                this.WTPByTime.forEach((value, key) => {
                    if (value === wtp) {
                        purchaseByHour.set(key, purchase);
                    }
                });
            });
            debugger;
            return purchaseByHour;
        }
        
        public calculateTrafficProbability(): number {
            let chanceOfDesire = this.hungerByTime.get(
                time.dt.startOf('hour').format('HH:mm:ss'));
                if (chanceOfDesire === undefined) {
                    throw new Error('Could not find probability for time: ' + 
                    time.dt.format('HH:mm:ss'));
                } else {
                    let awarenessChance = awareness.value / Awareness.MAX_VALUE;
                let reputationChance = reputation.value / Reputation.MAX_VALUE;
                return chanceOfDesire * awarenessChance * reputationChance *
                    (1 - this.chanceOfTurningAway);
            }
        }
    }

    return {
        StandardCustomerType,
    }
}