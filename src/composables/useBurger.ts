// Composables
import { useQuality } from "@/composables/useQuality";
import { useAbstractFood } from "@/composables/useAbstractFood";
import { useSharedStockState } from "@/composables/useSharedStockState";
import { useStock } from "@/composables/useStock";
// Exports
import { Quality, IngredientType } from "@/exports/ingredientEnums";
// Other imports
import { reactive, ref } from "vue";

export function useBurger() {
    const { QualityAndAttributes, QualityMap } = useQuality();
    const { Ingredient } = useAbstractFood();
    const { stock } = useSharedStockState();
    const { ElementQuantity } = useStock();

    // Instance types
    type QualityMap<QualityAndAttributes> = InstanceType<typeof QualityMap<QualityAndAttributes>>;
    type QualityAndAttributes = InstanceType<typeof QualityAndAttributes>;
    type Ingredient = InstanceType<typeof Ingredient>;
    type IngredientQuantity = InstanceType<typeof ElementQuantity<Ingredient>>;

    /**
     * Represents a burger ingredient that can be obtained during the game.
     */
    class BurgerIngredient extends Ingredient {
        /** The ingredient's ID */
        private _id: string;
        public get id(): string {
            return this._id;
        }
        /** The ingredient's name */
        private _name: string;
        public get name(): string {
            return this._name;
        }
        /** The ingredient's cost */
        private _cost: number;
        public get cost(): number {
            return this._cost;
        }
        /** The ingredient's availability to the player */
        private _available: boolean;
        public get available(): boolean {
            return this._available;
        }
        /** The ingredient's type */
        private _type: IngredientType;
        public get type(): IngredientType {
            return this._type;
        }
        /** Qualities and attributes */
        private _qualityMap: QualityMap<QualityAndAttributes>;
        public get qualityMap(): QualityMap<QualityAndAttributes> {
            return this._qualityMap;
        }
        /** Colour class associated with ingredient */
        private _borderColour: string;
        public get borderColour(): string {
            return this._borderColour;
        }

        constructor(id: string, name: string, cost: number, available: boolean,
        type: IngredientType, qualityMap: QualityMap<QualityAndAttributes>, colour: string) {
            super();
            this._id = id;
            this._name = name;
            this._cost = cost;
            this._available = available;
            this._type = type;
            this._qualityMap = qualityMap;
            this._borderColour = colour;
        }

        public costToString() {
            return this.cost.toFixed(2);
        }
    }
    
    /**
     * Represents a collection of all burger ingredients that can be obtained in
     * the game.
     */
    class BurgerIngredients {
        private static _ingredients: Map<string, BurgerIngredient> = new Map();
        public static get ingredients() {
            return Array.from(BurgerIngredients._ingredients.values());
        }

        /**
         * Add ingredients to the collection of all burger ingredients.
         * 
         * @param {BurgerIngredient[]} ingredients
         * 
         * @returns {boolean} True if addition successful, false otherwise.
         */
        static add(...ingredients: BurgerIngredient[]) : boolean {
            ingredients.forEach(ingredient => {
                if (BurgerIngredients._ingredients.has(ingredient.id)) {
                    return false;
                } else {
                    BurgerIngredients._ingredients.set(ingredient.id, ingredient);
                }
            });
            return true;
        }

        /**
         * Get a map of all burger ingredients.
         */
        static getIngredientMap() {
            return BurgerIngredients._ingredients;
        }
    }

    const makeQualAttr = (quality: Quality, rating: number) => {
        return { quality: quality, value: new QualityAndAttributes(quality, rating) };
    }

    BurgerIngredients.add(
        new BurgerIngredient("cheap-bun", '🍞 Cheap Bun', 1, true, IngredientType.Bun, new QualityMap<QualityAndAttributes>(
            makeQualAttr(Quality.Aroma, 0),
            makeQualAttr(Quality.Softness, 1),
            makeQualAttr(Quality.Spiciness, -1),
            makeQualAttr(Quality.Sweetness, 0),
            makeQualAttr(Quality.Umami, 0),
            makeQualAttr(Quality.Presentation, -1),
            makeQualAttr(Quality.Satiety, 1),
        ), 'border-t-yellow-600'),
        new BurgerIngredient("cheap-patty", '🍖 Basic Ground Patty', 3, true, IngredientType.Patty, new QualityMap<QualityAndAttributes>(
            makeQualAttr(Quality.Aroma, 1),
            makeQualAttr(Quality.Softness, -2),
            makeQualAttr(Quality.Spiciness, -1),
            makeQualAttr(Quality.Sweetness, 0),
            makeQualAttr(Quality.Umami, 2),
            makeQualAttr(Quality.Presentation, 0),
            makeQualAttr(Quality.Satiety, 2),
        ), 'border-t-amber-800'),
        new BurgerIngredient("cheap-cheese", '🧀 Cheap Slice of Cheese', 2, true, IngredientType.Cheese, new QualityMap<QualityAndAttributes>(
            makeQualAttr(Quality.Aroma, 1),
            makeQualAttr(Quality.Softness, 0),
            makeQualAttr(Quality.Spiciness, -1),
            makeQualAttr(Quality.Sweetness, 0),
            makeQualAttr(Quality.Umami, 0),
            makeQualAttr(Quality.Presentation, -2),
            makeQualAttr(Quality.Satiety, 1),
        ), 'border-t-yellow-300'),
    );

    stock.addIngredient(...BurgerIngredients.ingredients as Ingredient[])

    let burgerIngredients = ref(BurgerIngredients.ingredients);
    let burgerIngredientsMap = reactive(BurgerIngredients.getIngredientMap());

    return { Ingredient, BurgerIngredient, BurgerIngredients, burgerIngredients, burgerIngredientsMap};

}