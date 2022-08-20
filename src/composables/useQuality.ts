import type { Quality, QualityRating } from "@/exports/ingredientEnums";

export function useQuality() {
    class QualityAndAttributes {
        /** The quality */
        private _quality: Quality;
        public get quality(): Quality {
            return this._quality;
        }
        /** The rating */
        private _rating: QualityRating;
        public get rating(): QualityRating {
            return this._rating;
        }

        constructor(quality: Quality, rating: QualityRating) {
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
    }

    return { QualityAndAttributes, QualityMap };
}