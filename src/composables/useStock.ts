// Composables
import { useAbstractFood } from '@/composables/useAbstractFood';
import { useMoney } from '@/composables/useMoney';

export function useStock() {
    const { Product, Ingredient, Stack, isStack } = useAbstractFood();
    const { Money } = useMoney();

    type Product = InstanceType<typeof Product>;
    type Ingredient = InstanceType<typeof Ingredient>;
    type Money = InstanceType<typeof Money>;

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

    class Stock {
        /** Ingredients and their quantities */
        private _stock: Map<string, ElementQuantity<Ingredient>>;
        private get stock(): Map<string, ElementQuantity<Ingredient>> {
            return this._stock;
        }
        /** The stock plan we buy from */
        private _stockPlan: StockPlan;
        private get stockPlan(): StockPlan {
            return this._stockPlan;
        }

        constructor(stockPlan: StockPlan) {
            this._stock = new Map();
            this._stockPlan = stockPlan;
        }

        public size(): number {
            return this.stock.size;
        }

        public getIngredientQuantities(): IterableIterator<ElementQuantity<Ingredient>> {
            return this.stock.values();
        }

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
         */
        public buyIngredients(money: Money): boolean {
            debugger;
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

    class StockPlan {
        /** Products and their quantities */
        private _stockPlan: Map<string, ElementQuantity<Product>>;
        private get stockPlan() {
            return this._stockPlan;
        }
        /** Total cost */
        private _totalCost: number;
        public get totalCost(): number {
            return this._totalCost;
        }
        private set totalCost(value: number) {
            this._totalCost = value;
        }
        /** Total potential product earnings */
        private _totalEarnings: number;
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

        public size(): number {
            return this.stockPlan.size;
        }

        public getMap(): Map<string, ElementQuantity<Product>> {
            return this.stockPlan;
        }
        
        public getProductQuantities(): IterableIterator<ElementQuantity<Product>> {
            return this.stockPlan.values();
        }

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
                    console.warn('addProduct unable to add product that already exists in Stock', cleanPq, this.stockPlan);
                }
            })
        }

        public removeProduct(product: Product): boolean {
            const productQuantity = this.stockPlan.get(product.id);
            if (productQuantity !== undefined) {
                this.totalCost -= product.cost * productQuantity.quantity;
                this.totalEarnings -= product.price * productQuantity.quantity;
            }
            return this.stockPlan.delete(product.id);
        }

        public clear() {
            this.stockPlan.clear();
            this.totalCost = 0;
            this.totalEarnings = 0;
        }

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

    class PairedStockPlan {
        /** Stock user has saved */
        private _savedStock: StockPlan;
        public get savedStock(): StockPlan {
            return this._savedStock;
        }
        /** Temporary stock user can work with before saving */
        private _tempStock: StockPlan;
        public get tempStock(): StockPlan {
            return this._tempStock;
        }
    
        constructor(savedStock: StockPlan = new StockPlan(), tempStock: StockPlan = new StockPlan()) {
            this._savedStock = savedStock;
            this._tempStock = tempStock;
        }
    
        public addProduct(...productQuantities: Array<ElementQuantity<Product>>) {
            this.tempStock.addProduct(...productQuantities);
            this.savedStock.addProduct(...productQuantities);
        }
    
        public removeProduct(product: Product) {
            this.tempStock.removeProduct(product);
            this.savedStock.removeProduct(product);
        }
    }

    return { ElementQuantity, Stock, StockPlan, PairedStockPlan };
}