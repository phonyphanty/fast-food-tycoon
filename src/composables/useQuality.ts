import { Quality } from "@/exports/ingredientEnums";

export function useQuality() {
    class QualityAndAttributes {
        /** The quality */
        private _quality: Quality;
        public get quality(): Quality {
            return this._quality;
        }
        /** The rating */
        private _rating: number;
        public get rating(): number {
            return this._rating;
        }

        constructor(quality: Quality, rating: number) {
            this._quality = quality;
            this._rating = rating;
        }
    }

    class QualityMap<T> {
        private _qualities: Map<Quality, T>;
        public get qualities(): Map<Quality, T> {
            return this._qualities;
        }
        
        constructor(...pairs: { quality: Quality, value: T }[]) {
            this._qualities = new Map();
            pairs.forEach(pair => {
                this._qualities.set(pair.quality, pair.value);
            })
            // TODO: failsafe when qualities aren't included
        }

        getValue(key: Quality): T | undefined {
            return this.qualities.get(key);
        }

        setValue(quality: Quality, value: T) : boolean {
            this._qualities.set(quality, value);
            return true;
        }

        entries(): IterableIterator<[Quality, T]> {
            return this.qualities.entries();
        }
    }

    let qualityToEmoji = {
        [Quality.Spiciness]: '🌶️',
        [Quality.Presentation]: '⭐',
        [Quality.Sweetness]: '🍬',
        [Quality.Sourness]: '💥',
        [Quality.Aroma]: '🌼',
        [Quality.Umami]: '🍖',
        [Quality.Softness]: '🍦',
        [Quality.Satiety]: '😋',
    };

    function qualityValueIntoString(quality: Quality, value: number): string {
        let emoji = qualityToEmoji[quality];
        let str = '';
        for (let i = 0; i < Math.max(0, value); i++) {
            str += emoji;
        }
        return str;
    }

    return { QualityAndAttributes, QualityMap, qualityValueIntoString };
}