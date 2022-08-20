import { useUnique } from "@/composables/useUnique";
import { useQuality } from '@/composables/useQuality';
import { useCombinationResult } from '@/composables/useCombinationResult';

import type { IngredientType } from '@/exports/ingredientEnums';

export function useAbstractFood() {
    let { UniqueObject } = useUnique();
    let { QualityMap, QualityAndAttributes } = useQuality();
    let { DescriptiveCombinationResult } = useCombinationResult();

    type UniqueObject<Ingredient> = InstanceType<typeof UniqueObject<Ingredient>>;
    type QualityMap<T> = InstanceType<typeof QualityMap<T>>;
    type DescriptiveCombinationResult = InstanceType<typeof DescriptiveCombinationResult>;

    abstract class Ingredient {
        public abstract id: string;
        public abstract name: string;
        public abstract price: number;
        public abstract available: boolean;
        public abstract type: IngredientType;
        public abstract qualityMap: QualityMap<InstanceType<typeof QualityAndAttributes>>;
        public abstract borderColour: string;

        public abstract priceToString(price: number): string;
    }
    
    abstract class Stack {
        public abstract ingredients: UniqueObject<Ingredient>[];
        public abstract qualities: QualityMap<number>; 

        public abstract add(...ingredients: any): boolean;
        public abstract addIndex(index: number, ...ingredients: Ingredient[]): boolean;
        public abstract deleteIndex(...indices: number[]): boolean;
        public abstract swapIndex(index1: number, index2: number): boolean;
        public abstract evaluate(): DescriptiveCombinationResult[];
    }

    return { Ingredient, Stack };
}