// Composables
import { useQuality } from "@/composables/useQuality";
import { useAbstractFood } from "./useAbstractFood";
// Exports
import { Quality, QualityRating, IngredientType } from "@/exports/ingredientEnums";
// Other imports
import { ref } from "vue";

export function useBurger() {
    let { QualityAndAttributes, QualityMap } = useQuality();
    let { Ingredient } = useAbstractFood();

    // Instance types
    type QualityMap<QualityAndAttributes> = InstanceType<typeof QualityMap<QualityAndAttributes>>;
    type QualityAndAttributes = InstanceType<typeof QualityAndAttributes>;

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
        private static _ingredients: BurgerIngredient[] = [];
        public static get ingredients() {
            return BurgerIngredients._ingredients;
        }
        public static set ingredients(value: BurgerIngredient[]) {
            BurgerIngredients._ingredients = value;
        }

        /**
         * Add ingredients to the collection of all burger ingredients.
         * 
         * @param {BurgerIngredient[]} ingredients
         * 
         * @returns {boolean} True if addition successful, false otherwise.
         */
        static add(...ingredients: BurgerIngredient[]) : boolean {
            BurgerIngredients.ingredients.push(...ingredients);
            return true;
        }
    }

    const makeQualAttr = (quality: Quality, rating: QualityRating) => {
        return { quality: quality, value: new QualityAndAttributes(quality, rating) };
    }

    BurgerIngredients.add(
        new BurgerIngredient("5esxotsudy8", '🍞 Cheap Bun', 1, true, IngredientType.Bun, new QualityMap<QualityAndAttributes>(
            makeQualAttr(Quality.Aroma, QualityRating.Neutral),
            makeQualAttr(Quality.Bitterness, QualityRating.Negative),
            makeQualAttr(Quality.Softness, QualityRating.Positive),
            makeQualAttr(Quality.Spiciness, QualityRating.Negative),
            makeQualAttr(Quality.Sweetness, QualityRating.Neutral),
            makeQualAttr(Quality.Tanginess, QualityRating.Negative),
            makeQualAttr(Quality.Toughness, QualityRating.Neutral),
            makeQualAttr(Quality.Umami, QualityRating.Neutral),
            makeQualAttr(Quality.Presentation, QualityRating.Negative),
        ), 'border-t-yellow-600'),
        new BurgerIngredient("squj2g1fbz", '🍖 Basic Ground Patty', 3, true, IngredientType.Patty, new QualityMap<QualityAndAttributes>(
            makeQualAttr(Quality.Aroma, QualityRating.Positive),
            makeQualAttr(Quality.Bitterness, QualityRating.Positive),
            makeQualAttr(Quality.Toughness, QualityRating.VeryPositive),
            makeQualAttr(Quality.Softness, QualityRating.Neutral),
            makeQualAttr(Quality.Spiciness, QualityRating.Negative),
            makeQualAttr(Quality.Sweetness, QualityRating.Neutral),
            makeQualAttr(Quality.Tanginess, QualityRating.Positive),
            makeQualAttr(Quality.Umami, QualityRating.VeryPositive),
            makeQualAttr(Quality.Presentation, QualityRating.Neutral),
        ), 'border-t-amber-800'),
        new BurgerIngredient("msmm387qs0h", '🧀 Cheap Slice of Cheese', 2, true, IngredientType.Cheese, new QualityMap<QualityAndAttributes>(
            makeQualAttr(Quality.Aroma, QualityRating.Positive),
            makeQualAttr(Quality.Bitterness, QualityRating.Negative),
            makeQualAttr(Quality.Toughness, QualityRating.Positive),
            makeQualAttr(Quality.Softness, QualityRating.Neutral),
            makeQualAttr(Quality.Spiciness, QualityRating.Negative),
            makeQualAttr(Quality.Sweetness, QualityRating.Neutral),
            makeQualAttr(Quality.Tanginess, QualityRating.Negative),
            makeQualAttr(Quality.Umami, QualityRating.Neutral),
            makeQualAttr(Quality.Presentation, QualityRating.VeryNegative),
        ), 'border-t-yellow-300'),
    );

    let burgerIngredients = ref(BurgerIngredients.ingredients);

    return { Ingredient, BurgerIngredient, BurgerIngredients, burgerIngredients};

}