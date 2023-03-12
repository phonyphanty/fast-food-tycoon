/**
 * Handles stock planning and stock piling
 * @module
 */

// Composables
import { useAbstractFood } from '@/composables/useAbstractFood';
import { useMoney } from '@/composables/useMoney';

/**
 * Exports classes and variables needed for stock planning and stock piling
 */
export function useStock() {
    const { Product, Ingredient, Stack, isStack } = useAbstractFood();
    const { Money } = useMoney();

    type Product = InstanceType<typeof Product>;
    type Ingredient = InstanceType<typeof Ingredient>;
    type Money = InstanceType<typeof Money>;

    /**
     * An element (e.g. an Ingredient) and the amount of it
     */
    class ElementQuantity<T> {
        /** Element */
        private _element: T;
        public get element(): T {
            return this._element;
        }
        /** Quantity */
        private _quantity: number;
        public get quantity(): number {
            return this._quantity;
        }
        public set quantity(quantity: number) {
            this._quantity = quantity;
        }

        constructor(element: T, quantity: number = 0) {
            this._element = element;
            this._quantity = quantity;
        }
    }

    /**
     * A stock -- a collection of Ingredients used to make menu items
     */
    class Stock {
        private _stock: Map<string, ElementQuantity<Ingredient>>;
        /** Ingredients and their quantities */
        private get stock(): Map<string, ElementQuantity<Ingredient>> {
            return this._stock;
        }
        private _stockPlan: StockPlan;
        /** The stock plan we buy from */
        private get stockPlan(): StockPlan {
            return this._stockPlan;
        }

        constructor(stockPlan: StockPlan) {
            this._stock = new Map();
            this._stockPlan = stockPlan;
        }

        /**
         * @returns The number of ingredients we have in the stock pile
         */
        public size(): number {
            return this.stock.size;
        }

        /**
         * @returns Ingredients and their quantities
         */
        public getIngredientQuantities(): IterableIterator<ElementQuantity<Ingredient>> {
            return this.stock.values();
        }

        /**
         * Add one or more ingredients to the stock, with the quantity set to 0
         */
        public addIngredient(...ingredients: Array<Ingredient>) {
            ingredients.forEach(i => {
                if (!this.stock.has(i.id)) {
                    this.stock.set(i.id, new ElementQuantity<Ingredient>(i, 0));
                } else {
                    console.warn('addIngredient unable to add ingredient that already exists in Stock', i, this.stock);
                }
            });
        }

        /**
         * Buy all ingredients needed to satisfy the stock plan
         * 
         * @param money The player's money object. This should be the object
         * found in `useSharedState`
         * @returns `true` if the player can afford the ingredients, `false`
         * otherwise
         */
        public buyIngredients(money: Money): boolean {
            if (!money.canAfford(this.stockPlan.totalCost)) {
                return false;
            }
            for (const pq of this.stockPlan.getProductQuantities()) {
                if (pq.element instanceof Stack) {
                    pq.element.ingredients.forEach(uniqueIngredient => {
                        const ingredient = uniqueIngredient.value;
                        if (this.stock.get(ingredient.id) === undefined) {
                            this.stock.set(ingredient.id, new ElementQuantity(ingredient, 0));
                            console.warn('buyIngredients found unadded ingredient, adding...', ingredient, this.stock, this.stockPlan);
                        }
                        this.stock.get(ingredient.id)!.quantity += pq.quantity;
                    });
                }
            }
            money.remove(this.stockPlan.totalCost);
            return true;
        }
    }

    /**
     * The types and quantities of products we want to buy enough stock for each
     * stock piling event
     */
    class StockPlan {
        private _stockPlan: Map<string, ElementQuantity<Product>>;
        /** Products and their quantities */
        private get stockPlan() {
            return this._stockPlan;
        }
        private _totalCost: number;
        /** The total cost of all products in the stock plan */
        public get totalCost(): number {
            return this._totalCost;
        }
        private set totalCost(value: number) {
            this._totalCost = value;
        }
        private _totalEarnings: number;
        /** Total potential product earnings */
        public get totalEarnings(): number {
            return this._totalEarnings;
        }
        private set totalEarnings(value: number) {
            this._totalEarnings = value;
        }

        constructor() {
            this._stockPlan = new Map();
            this._totalCost = 0;
            this._totalEarnings = 0;
        }
        
        /**
         * @returns The number of products in the stock plan
         */
        public size(): number {
            return this.stockPlan.size;
        }
        
        /**
         * @returns The stock plan represented as a Map
         */
        public getMap(): Map<string, ElementQuantity<Product>> {
            return this.stockPlan;
        }
        
        /**
         * @returns An iterator of all products and their quantities
         */
        public getProductQuantities(): IterableIterator<ElementQuantity<Product>> {
            return this.stockPlan.values();
        }

        /**
         * Add a quantity of a given product to the stock plan. The product
         * must not already exist within the stock plan
         * 
         * @param productQuantities The product (and quantity of that product)
         * to add to the stock plan
         */
        public addProduct(...productQuantities: Array<ElementQuantity<Product>>) {
            productQuantities.forEach(pq => {
                // Create clean PQ to avoid duplicate references between stocks
                const cleanPq = new ElementQuantity(pq.element, pq.quantity);
                if (!this.stockPlan.has(cleanPq.element.id)) {
                    this.stockPlan.set(
                        cleanPq.element.id,
                        cleanPq,
                    )
                    this.totalCost += cleanPq.element.cost * cleanPq.quantity;
                    this.totalEarnings += cleanPq.element.price * cleanPq.quantity;
                } else {
                    console.warn('addProduct unable to add product that already exists in StockPlan', cleanPq, this.stockPlan);
                }
            })
        }

        /**
         * Try to remove the given product from the stock plan
         * 
         * @param product The product to remove
         * @returns True if the removal succeeded, false otherwise
         */
        public removeProduct(product: Product): boolean {
            const productQuantity = this.stockPlan.get(product.id);
            if (productQuantity !== undefined) {
                this.totalCost -= product.cost * productQuantity.quantity;
                this.totalEarnings -= product.price * productQuantity.quantity;
            }
            return this.stockPlan.delete(product.id);
        }

        /**
         * Reset the stock plan to a blank slate
         */
        public clear() {
            this.stockPlan.clear();
            this.totalCost = 0;
            this.totalEarnings = 0;
        }

        /**
         * Change the quantity of an existing product in the stock plan
         * 
         * @param product The product to change the quantity of
         * @param quantity The new quantity of the product
         * @returns True if the modification succeeded, false otherwise
         */
        public changeQuantity(product: Product, quantity: number): boolean {
            const productQuantity = this.stockPlan.get(product.id);
            if (productQuantity !== undefined) {
                this.totalCost += product.cost * (quantity - productQuantity.quantity);
                this.totalEarnings += product.price * (quantity - productQuantity.quantity);
                productQuantity.quantity = quantity;
                return true;
            }
            return false;
        }
    }

    /**
     * Pairs a saved stock plan (the stock plan the game buys from) and a
     * temporary stock plan (the stock plan the user works on) to make adding
     * new products to the stock plan easier and more fault-tolerant
     */
    class PairedStockPlan {
        private _savedStock: StockPlan;
        /** Stock plan that the user has saved */
        public get savedStock(): StockPlan {
            return this._savedStock;
        }
        private _tempStock: StockPlan;
        /** Temporary stock plan that the user can work with before saving */
        public get tempStock(): StockPlan {
            return this._tempStock;
        }
    
        constructor(savedStock: StockPlan = new StockPlan(), tempStock: StockPlan = new StockPlan()) {
            this._savedStock = savedStock;
            this._tempStock = tempStock;
        }
        
        /**
         * Try to add products and their respective quantities to both the
         * saved and temporary stock plans
         * 
         * @param productQuantities The products and the quantity of them to add
         * to the stock plans
         */
        public addProduct(...productQuantities: Array<ElementQuantity<Product>>) {
            this.tempStock.addProduct(...productQuantities);
            this.savedStock.addProduct(...productQuantities);
        }
    
        /**
         * Try to remove the given product from both the saved and temporary
         * stock plans
         * 
         * @param product The product to remove from the stock plans
         */
        public removeProduct(product: Product) {
            this.tempStock.removeProduct(product);
            this.savedStock.removeProduct(product);
        }
    }

    return { ElementQuantity, Stock, StockPlan, PairedStockPlan };
}