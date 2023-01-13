// Composables
import { useBurger } from '@/composables/useBurger';
import { useUnique } from "@/composables/useUnique";
import { useQuality } from '@/composables/useQuality';
import { useAbstractFood } from '@/composables/useAbstractFood';
import { useCombination } from '@/composables/useCombination';
import { useAbstractIcon } from '@/composables/useAbstractIcon';
// Exports
import { RuleCondition as Condition, RuleCoverage as Coverage, RuleQuantifier as Quantifier, RuleRelationalOperator as RelationalOperator } from "@/exports/combinationEnums";
import { IngredientType, Quality, QualityRating } from '@/exports/ingredientEnums';

export function useBurgerStack() {
    let { BurgerIngredient } = useBurger();
    let { UniqueObject } = useUnique();
    let { QualityAndAttributes, QualityMap } = useQuality();
    let { Stack, Product } = useAbstractFood();
    let { Combination, CombinationEffect, IfTypeDirectlyAboveTypeOptions, IfTypeOptions, IfStackLengthOptions, CombinationRule, QualityCombinationEffect, CombinationResult, DescriptiveCombinationResult } = useCombination();
    let { Icon } = useAbstractIcon();

    type BurgerIngredient = InstanceType<typeof BurgerIngredient>;
    type UniqueObject<BurgerIngredient> =
        InstanceType<typeof UniqueObject<BurgerIngredient>>;
    type Stack = InstanceType<typeof Stack>;
    type Product = InstanceType<typeof Product>;
    type Combination = InstanceType<typeof Combination>;
    type CombinationEffect = InstanceType<typeof CombinationEffect>;
    type CombinationResult = InstanceType<typeof CombinationResult>;
    type DescriptiveCombinationResult = InstanceType<typeof DescriptiveCombinationResult>;
    type QualityMap<T> = InstanceType<typeof QualityMap<T>>;
    type QualityAndAttributes = InstanceType<typeof QualityAndAttributes>;
    type Icon = InstanceType<typeof Icon>;

    class BurgerStackIcon extends Icon {
        private _elements: Array<string>;
        public get elements(): Array<string> {
            return this._elements;
        }

        constructor(elements: Array<string> = []) {
            super();
            this._elements = elements;
        }
    }

    /**
     * Represents a stack of burgers that can be modified and evaluated.
     */
     class BurgerStack extends Stack {
        /** ID */
        private _id: string;
        public get id(): string {
            return this._id;
        }
        /** Name */
        private _name: string;
        public get name(): string {
            return this._name;
        }
        private set name(value: string) {
            this._name = value;
        }
        /** Cost */
        private _cost: number = 0;
        public get cost(): number {
            return this._cost;
        }
        private set cost(value: number) {
            this._cost = value;
        }
        /** Price */
        private _price: number = 0;
        public get price(): number {
            return this._price;
        }
        private set price(value: number) {
            this._price = value;
        }
        /** Icon */
        private _icon: BurgerStackIcon;
        public get icon(): BurgerStackIcon {
            return this._icon;
        }
        private set icon(value: BurgerStackIcon) {
            this._icon = value;
        }
        /** List of uniquely-identified burger ingredients */
        private _ingredients: UniqueObject<BurgerIngredient>[];
        public get ingredients(): UniqueObject<BurgerIngredient>[] {
            return this._ingredients;
        }
        private set ingredients(value: UniqueObject<BurgerIngredient>[]) {
            this._ingredients = value;
        }
        /** Combinations */
        private static _combinations: Combination[]; 
        public static get combinations(): Combination[] {
             return BurgerStack._combinations;
        }
        public static set combinations(value: Combination[]) {
            this._combinations = value;
        }
        /** Qualities */
        private _qualities: QualityMap<number> = new QualityMap<number>();
        public get qualities(): QualityMap<number> {
            return this._qualities;
        }

        constructor(...ingredients: BurgerIngredient[]) {
            super();
            this._id = UniqueObject.generateUUID();
            this._ingredients = [];
            this._name = '';
            this._cost = 0;
            this.add(...ingredients);
            this.initialiseQualityMap();
            this._icon = new BurgerStackIcon();
        }

        private initialiseQualityMap() {
            const qualityKeys = Object.keys(Quality) as (keyof typeof Quality)[];
            qualityKeys.forEach((value: keyof typeof Quality) => {
                this.qualities.setValue(Quality[value], 0);
            })
        }

        public generateIcon() : BurgerStackIcon {
            let elements: Array<string> = [];
            this.ingredients.forEach(ingredient => {
                elements.push(ingredient.value.borderColour);
            });
            return this.icon = new BurgerStackIcon(elements);
        }

        /**
         * Add ingredients to the bottom of the burger stack.
         * 
         * @param {BurgerIngredient[]} ingredients TODO: typing this correctly (in param below) causes errors in BurgerStack?
         * @returns {boolean}
         */
        add(...ingredients: any) : boolean {            
            const uniqueIngredients: UniqueObject<BurgerIngredient>[] =
                ingredients.map((ingredient: BurgerIngredient) => {                    
                    return new UniqueObject<BurgerIngredient>(ingredient);
                })            
            this.ingredients.push(...uniqueIngredients);
            uniqueIngredients.forEach(ingredient => {
                this.cost += ingredient.value.cost;
            });
            return true;
        }

        /**
         * Add ingredients to a specified index in the burger stack.
         * 
         * @param {number} index 
         * @param {BurgerIngredient[]} ingredients 
         * @returns {boolean}
         */
        addIndex(index: number, ...ingredients: BurgerIngredient[]) : boolean {
            if (index === this.ingredients.length) {
                return this.add(...ingredients);
            } else {
                const uniqueIngredients: UniqueObject<BurgerIngredient>[] =
                    ingredients.map((ingredient: BurgerIngredient) => {
                        return new UniqueObject<BurgerIngredient>(ingredient);
                    })
                uniqueIngredients.forEach(ingredient => {
                    this.cost += ingredient.value.cost;
                });
                // make gap in ingredients array and fill it with new ingredients
                let leftArray = this.ingredients.slice(0, index);
                let rightArray = this.ingredients.slice(index);
                rightArray.unshift(...uniqueIngredients);
                this.ingredients = leftArray.concat(rightArray);
                return true;
            }
        }

        /**
         * Delete ingredients at specified indices in the burger stack.
         * 
         * @param {number[]} indices 
         * @returns 
         */
        deleteIndex(...indices: number[]) : boolean {
            indices.forEach((ix: number) => {
                this.cost -= this.ingredients[ix].value.cost;
                let leftArray = this.ingredients.slice(0, ix);
                let rightArray = this.ingredients.slice(ix+1);
                this.ingredients = leftArray.concat(rightArray);
            });
            return true;
        }

        /**
         * Delete all ingredients in the burger stack.
         * 
         * @returns {boolean} true if successful, false otherwise
         */
        deleteAll() : boolean {
            this.ingredients = [];
            this.cost = 0;
            return true;
        }

        /**
         * Swap the ingredients at the given indices.
         * 
         * @param {number} index1 
         * @param {number} index2 
         * @returns {boolean}
         */
        swapIndex(index1: number, index2: number) : boolean {
            if (index1 < 0 || index1 >= this.ingredients.length ||
                index2 < 0 || index2 >= this.ingredients.length) {
                    throw new Error(
                        `index1: ${index1} or index2: ${index2} out of bounds`);
            } else {
                let temp = this.ingredients[index1];
                this.ingredients[index1] = this.ingredients[index2];
                this.ingredients[index2] = temp;
                return true;
            }
        }

        /**
         * Using the stack's ingredients and combinations, evaluate the quality
         * attributes of the stack and action any combination effects.
         */
        evaluate(): DescriptiveCombinationResult[] {
            this.initialiseQualityMap();
            // Set stack qualities using ingredients
            this.ingredients.forEach((ingredient: UniqueObject<BurgerIngredient>) => {
                ingredient.value.qualityMap.qualities.forEach((value: QualityAndAttributes, quality: Quality) => {
                    this.qualities.setValue(quality, this.qualities.getValue(quality)! + value.rating);
                });
            })
            // Action combinations
            const results: DescriptiveCombinationResult[] = [];
            BurgerStack.combinations.forEach((combo: Combination) => {
                const result: CombinationResult = combo.validate(this);
                const descriptiveResult = new DescriptiveCombinationResult(
                    combo.name, combo.description, result
                );
                results.push(descriptiveResult);
                // Action effects
                if (result.isSuccess) {
                    combo.effects.forEach((effect: CombinationEffect) => {
                        for (let i = 0; i < result.successCount!; i++) {
                            if (effect instanceof QualityCombinationEffect) {
                                effect.qualityMap.qualities.forEach((value: QualityAndAttributes, quality: Quality) => {
                                    this.qualities.setValue(quality, this.qualities.getValue(quality)! + value.rating);
                                });
                            } else {
                                throw new Error('Invalid combination effect: ' + effect.constructor.toString());
                            }
                        }
                        
                    });
                }
            });
            return results;
        }

        /**
         * @returns {BurgerStack} A deep copy of this stack
         */
        deepCopy(): BurgerStack {
            let newStack: BurgerStack = new BurgerStack();
            newStack.add(...this.ingredients.map(val => {
                return val.value;
            }));
            newStack.evaluate();
            newStack.generateIcon();
            newStack.name = this.name;
            newStack.price = this.price;
            return newStack;
        }

        /**
         * Try and reset the stack to its original state (without evaluation).
         * @returns true if the reset succeeded, false otherwise.
         */
        reset(): boolean {
            try {
                this.name = '';
                this.price = 0;
                return this.deleteAll();
            } catch (e) {
                console.error(e);
                return false;
            }
            
        }

        public costToString() {
            return this.cost.toFixed(2);
        }
    }

    function isBurgerStack(product: Product): product is BurgerStack {
        return Object.getPrototypeOf(product).constructor.name === BurgerStack.name;
    }

    const makeQualAttr = (quality: Quality, rating: QualityRating) => {
        return { quality: quality, value: new QualityAndAttributes(quality, rating) };
    }

    let combinations: Combination[] = [
        new Combination('Soft and greasy...', 'Patty-melted cheese', [
                new CombinationRule(
                    Condition.IfTypeDirectlyAboveType,
                    Quantifier.IncludeMany,
                    Coverage.CheckEverywhere,
                    new IfTypeDirectlyAboveTypeOptions(
                        IngredientType.Cheese,
                        IngredientType.Patty
                    ),
                ),
            ], [
                new QualityCombinationEffect(
                    makeQualAttr(Quality.Softness, QualityRating.Positive),
                    makeQualAttr(Quality.Presentation, QualityRating.Positive),
                    makeQualAttr(Quality.Aroma, QualityRating.Positive)
                ),
            ]
        ),
        new Combination('Stability', 'Encased in burger bun', [
                new CombinationRule(
                    Condition.IfStackLength,
                    Quantifier.IncludeOne,
                    Coverage.CheckMeta,
                    new IfStackLengthOptions(RelationalOperator.GreaterThan, 1)
                ),
                new CombinationRule(
                    Condition.IfType,
                    Quantifier.IncludeOne,
                    Coverage.CheckAtFirst,
                    new IfTypeOptions(IngredientType.Bun)
                ),
                new CombinationRule(
                    Condition.IfType,
                    Quantifier.IncludeOne,
                    Coverage.CheckAtLast,
                    new IfTypeOptions(IngredientType.Bun)
                ),
            ], [
                new QualityCombinationEffect(
                    makeQualAttr(Quality.Softness, QualityRating.Positive),
                    makeQualAttr(Quality.Presentation, QualityRating.Positive)
                ),
            ]
        ),
    ];

    BurgerStack.combinations = combinations;

    return { BurgerStack, isBurgerStack, BurgerStackIcon, Combination };
}