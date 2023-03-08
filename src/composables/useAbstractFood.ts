import { useUnique } from "@/composables/useUnique";
import { useQuality } from '@/composables/useQuality';
import { useCombinationResult } from '@/composables/useCombinationResult';
import { useAbstractIcon } from "@/composables/useAbstractIcon";

import type { IngredientType } from '@/exports/ingredientEnums';

export function useAbstractFood() {
    let { UniqueObject } = useUnique();
    let { QualityMap, QualityAndAttributes } = useQuality();
    let { DescriptiveCombinationResult } = useCombinationResult();
    let { Icon } = useAbstractIcon();

    type UniqueObject<Ingredient> = InstanceType<typeof UniqueObject<Ingredient>>;
    type QualityMap<T> = InstanceType<typeof QualityMap<T>>;
    type DescriptiveCombinationResult = InstanceType<typeof DescriptiveCombinationResult>;
    type Icon = InstanceType<typeof Icon>;

    abstract class Ingredient {
        public abstract id: string;
        public abstract name: string;
        public abstract cost: number;
        public abstract available: boolean;
        public abstract type: IngredientType;
        public abstract qualityMap: QualityMap<InstanceType<typeof QualityAndAttributes>>;
        public abstract borderColour: string;

        public abstract costToString(): string;
    }
    
    abstract class Product {
        public abstract id: string;
        public abstract name: string;
        public abstract cost: number;
        public abstract price: number;
        public abstract icon: Icon;

        public abstract generateIcon(): Icon; // TODO: what's a better type? Vue component?
    }

    abstract class Stack extends Product {
        public abstract ingredients: UniqueObject<Ingredient>[];
        public abstract qualities: QualityMap<number>; 

        static [Symbol.hasInstance](instance: any) {
            let proto: Object = Object.getPrototypeOf(instance);
            for (; proto !== null; proto = Object.getPrototypeOf(proto)) {
                if (proto.constructor.name === Stack.name) return true;
            }
            return false;
        }

        public abstract add(...ingredients: any): boolean;
        public abstract addIndex(index: number, ...ingredients: Ingredient[]): boolean;
        public abstract deleteIndex(...indices: number[]): boolean;
        public abstract swapIndex(index1: number, index2: number): boolean;
        public abstract evaluate(): DescriptiveCombinationResult[];
        public abstract deepCopy(): Stack;
        public abstract reset(): boolean;
    }

    function isStack(product: Product): product is Stack {
        debugger;
        return Object.getPrototypeOf(product).constructor.name === Stack.name;
    }

    return { Ingredient, Stack, Product, isStack };
}