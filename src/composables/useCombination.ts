// Composables
import { useAbstractFood } from '@/composables/useAbstractFood';
import { useQuality } from '@/composables/useQuality';
import { useCombinationResult } from './useCombinationResult';
// Exports
import { RuleCondition as Condition, RuleCoverage as Coverage, RuleQuantifier as Quantifier, RuleRelationalOperator as RelationalOperator } from "@/exports/combinationEnums";
import type { IngredientType, Quality } from '@/exports/ingredientEnums';

export function useCombination() {
    let { Stack } = useAbstractFood();
    type Stack = InstanceType<typeof Stack>;
    let { QualityAndAttributes, QualityMap } = useQuality();
    type QualityMap<QualityAndAttributes> = InstanceType<typeof QualityMap<QualityAndAttributes>>;
    type QualityAndAttributes = InstanceType<typeof QualityAndAttributes>;
    let { CombinationResult, DescriptiveCombinationResult } = useCombinationResult();
    type CombinationResult = InstanceType<typeof CombinationResult>;

    class Combination {
        /** Name */
        private _name: string;
        public get name() : string {
            return this._name;
        }
        /** Description */
        private _description: string;
        public get description(): string {
            return this._description;
        }
        /** Combination rules */
        private _rules: CombinationRule[];
        public get rules() {
            return this._rules;
        }
        /** Combination effects */
        private _effects: CombinationEffect[];
        public get effects(): CombinationEffect[] {
            return this._effects;
        }

        constructor(name: string, description: string, rules: CombinationRule[], effects: CombinationEffect[]) {
            this._name = name;
            this._description = description;
            this._rules = rules;
            this._effects = effects;
        }

        public validate(stack: Stack): CombinationResult {
            const results: CombinationResult[] = [];
            const allSuccess = this.rules.every((rule: CombinationRule) => {
                const result: CombinationResult = rule.validate(stack);
                results.push(result);
                return result.isSuccess;
            })

            if (allSuccess) {
                const minCount = Math.min(...results.map((value: CombinationResult) => {
                    return value.successCount!;
                }));
                return new CombinationResult(true, minCount);
            } else {
                return new CombinationResult(false, 0);
            }
        }
    }

    class CombinationRule {
        /** Whether we want the rule matched or not, and to what extent */
        private _quantifier: Quantifier;
        public get quantifier(): Quantifier {
            return this._quantifier;
        }
        /** Rule condition */
        private _condition: Condition;
        public get condition(): Condition {
            return this.condition;
        }
        /** What parts of the stack the rule affects */
        private _coverage: Coverage;
        public get coverage(): Coverage {
            return this._coverage;
        }
        /** More rule details */
        private _options: RuleOptions;
        public get options(): RuleOptions {
            return this._options;
        }

        constructor(condition: Condition, effect: Quantifier, coverage: Coverage,
        options: RuleOptions) {
            this._condition = condition;
            this._quantifier = effect;
            this._coverage = coverage;
            this._options = options;
        }

        public validate(stack: Stack): CombinationResult {
            if (stack.ingredients.length === 0) {
                return new CombinationResult(false);
            } else if (this.quantifier === Quantifier.IncludeMany && this.coverage === Coverage.CheckEverywhere) {
                let count = 0;
                stack.ingredients.forEach((_, index) => {
                    count += Number(this.options.validate(stack, index))
                })
                return new CombinationResult(count > 0, count);
            } else if (this.quantifier === Quantifier.IncludeOne) {
                const coverageIsAtFirst: boolean = this.coverage === Coverage.CheckAtFirst;
                const coverageIsAtLast: boolean  = this.coverage === Coverage.CheckAtLast;
                if (coverageIsAtFirst || coverageIsAtLast) {
                    const index: number = coverageIsAtFirst ? 0 : stack.ingredients.length - 1;
                    const validation: boolean = this.options.validate(stack, index);
                    return new CombinationResult(validation, Number(validation));
                } else if (this.coverage === Coverage.CheckMeta) {
                    const validation: boolean = this.options.validate(stack, 0);
                    return new CombinationResult(validation, Number(validation));
                }
            }
            
            throw Error('Invalid rule');
        }
    }

    abstract class CombinationEffect {

    }
    
    class QualityCombinationEffect extends CombinationEffect {
        private _qualityMap: QualityMap<QualityAndAttributes>;
        public get qualityMap(): QualityMap<QualityAndAttributes> {
            return this._qualityMap;
        }
    
        constructor(...values: { quality: Quality, value: QualityAndAttributes }[]) {
            super();
            this._qualityMap = new QualityMap(...values);
        }
    }

    abstract class RuleOptions {
        public abstract condition: Condition;
    
        abstract validate(stack: Stack, index: number): boolean;
    }

    class IfStackLengthOptions extends RuleOptions {
        /** The condition these rule options apply to */
        private _condition: Condition = Condition.IfStackLength;
        public get condition(): Condition {
            return this._condition;
        }
        /** The desired length of the stack */
        private _length: number;
        public get length(): number {
            return this._length;
        }
        /** What the stack's length should be in relation to this.length
         *  Structure: stack.ingredients.length (operator) this.length
         */
        private _relationalOperator: RelationalOperator;
        public get relationalOperator(): RelationalOperator {
            return this._relationalOperator;
        }

        constructor(relationalOperator: RelationalOperator, length: number) {
            super();
            this._length = length;
            this._relationalOperator = relationalOperator;
        }

        public validate(stack: Stack): boolean {
            switch (this.relationalOperator) {
                case RelationalOperator.EqualTo:
                    return stack.ingredients.length === this.length;
                case RelationalOperator.GreaterThan:
                    return stack.ingredients.length > this.length;
                case RelationalOperator.LesserThan:
                    return stack.ingredients.length < this.length;
                default:
                    throw new Error('Invalid relational operator');
            }
        }
    }

    class IfTypeOptions extends RuleOptions {
        /** The condition these rule options apply to */
        private _condition: Condition = Condition.IfType;
        public get condition(): Condition {
            return this._condition;
        }
        /** The type we want to ensure exists */
        private _type: IngredientType;
        public get type(): IngredientType {
            return this._type;
        }

        constructor(type: IngredientType) {
            super();
            this._type = type;
        }

        public validate(stack: Stack, index: number): boolean {
            if (stack.ingredients[index] === undefined) {
                return false;
            } else {
                return stack.ingredients[index].value.type === this.type;
            }
        }
    }
    
    class IfTypeDirectlyAboveTypeOptions extends RuleOptions {
        /** The condition these rule options apply to */
        private _condition: Condition = Condition.IfTypeDirectlyAboveType;
        public get condition(): Condition {
            return this._condition;
        }
        /** The type we want to ensure is above */
        private _typeAbove: IngredientType;
        public get typeAbove(): IngredientType {
            return this._typeAbove;
        }
        /** The type we want to ensure is here (below typeAbove) */
        private _typeHere: IngredientType;
        public get typeHere(): IngredientType {
            return this._typeHere;
        }
    
        constructor(typeAbove: IngredientType, typeHere: IngredientType) {
            super();
            this._typeAbove = typeAbove;
            this._typeHere = typeHere;
        }
    
        public validate(stack: Stack, index: number): boolean {
            if (stack.ingredients[index - 1] === undefined) {
                return false;
            } else {
                return stack.ingredients[index].value.type === this.typeHere
                    && stack.ingredients[index - 1].value.type === this.typeAbove;
            }
        }
    }

    return { Combination, CombinationRule, CombinationResult, 
        DescriptiveCombinationResult, CombinationEffect, 
        QualityCombinationEffect, RuleOptions, IfTypeDirectlyAboveTypeOptions, 
        IfTypeOptions, IfStackLengthOptions };
}