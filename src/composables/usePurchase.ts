/**
 * Handles logic pertaining to a customer purchase -- what they buy, how much
 * it costs, how much stock it consumes and how it affects the restaurant's
 * reputation.
 * 
 * @module
 */

// Composables
import { useReputation } from '@/composables/useReputation';
import { useStock } from '@/composables/useStock';
import { useAbstractFood } from '@/composables/useAbstractFood';
import { useCustomerType } from '@/composables/useCustomerType';
import { useBurgerStack } from '@/composables/useBurgerStack';

let { Reputation } = useReputation();
let { ElementQuantity } = useStock();
let { Product, Ingredient } = useAbstractFood();
let { CustomerType } = useCustomerType();
let { isBurgerStack } = useBurgerStack();

type Reputation = InstanceType<typeof Reputation>;
type ElementQuantity<T> = InstanceType<typeof ElementQuantity<T>>;
type Product = InstanceType<typeof Product>;
type Ingredient = InstanceType<typeof Ingredient>;
type CustomerType = InstanceType<typeof CustomerType>;

/**
 * Handles logic pertaining to a customer purchase -- what they buy, how much
 * it costs, how much stock it consumes, and the likelihood of it positively
 * or negatively affecting the restaurant's reputation.
 * @export
 */
export function usePurchase() {
    /**
     * Handles logic pertaining to a customer purchase -- what they buy, how much
     * it costs, how much stock it consumes, and the likelihood of it positively
     * or negatively affecting the restaurant's reputation.
     */
    class Purchase {
        private _customerType: typeof CustomerType;
        /** The type of customer making the purchase. This affects how strongly 
         * the reputation is impacted. */
        public get customerType(): typeof CustomerType {
            return this._customerType;
        }

        private _productQuantities: ElementQuantity<Product>[];
        /** The products being purchsed and their quantities. */
        public get productQuantities(): ElementQuantity<Product>[] {
            return this._productQuantities;
        }

        private _stockConsumed: ElementQuantity<Ingredient>[];
        /** The stock consumed by the purchase and their quantities. */
        public get stockConsumed(): ElementQuantity<Ingredient>[] {
            return this._stockConsumed;
        }

        private _price: number;
        /** The cost of the purchase. */
        public get price(): number {
            return this._price;
        }

        private _probabilityOfPositiveReputation: number;
        /** The probability of the purchase positively affecting the
         * restaurant's reputation. */
        public get probabilityOfPositiveReputation(): number {
            return this._probabilityOfPositiveReputation;
        }

        constructor(
            productQuantities: ElementQuantity<Product>[],
            probabilityOfPositiveReputation: number,
            customerType: typeof CustomerType,
            price?: number,
            stockConsumed?: ElementQuantity<Ingredient>[],
        ) {
            this._productQuantities = productQuantities;
            this._probabilityOfPositiveReputation = probabilityOfPositiveReputation;
            this._customerType = customerType;
            // Set price
            if (price === undefined) {
                this._price = productQuantities.reduce((previous, current) => previous + current.element.price * current.quantity, 0);
            } else {
                this._price = price;
            }
            // Set stock consumed
            if (stockConsumed === undefined) {
                const stockConsumed: ElementQuantity<Ingredient>[] = [];
                // Go through each ElementQuantity<Product>
                productQuantities.forEach(productQuantity => {
                    const product = productQuantity.element;
                    if (isBurgerStack(product)) {
                        // Go through each UniqueObject<Ingredient>
                        product.ingredients.forEach(uniqueIngredient => {
                            const ingredient = uniqueIngredient.value;
                            const ingredientQuantity = stockConsumed.find(stock => stock.element.id === ingredient.id);
                            if (ingredientQuantity === undefined) {
                                // If the ingredient is not in the stockConsumed array, add it
                                stockConsumed.push(new ElementQuantity(ingredient, 1 * productQuantity.quantity));
                            } else {
                                // If the ingredient is in the stockConsumed array, increase its quantity
                                ingredientQuantity.quantity += 1 * productQuantity.quantity;
                            }
                        });
                    } else {
                        throw new Error(`Unsupported product type: ${product.constructor.name}`);
                    }
                });
                this._stockConsumed = stockConsumed;
            } else {
                this._stockConsumed = stockConsumed;
            }
                
        }
    }

    return { Purchase };
}