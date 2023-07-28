/**
 * Handles logic pertaining to the restaurant's opening hours.
 * @module
 */

import { reactive } from "vue";

/**
 * Handles logic pertaining to the restaurant's opening hours.
 *
 * @export
 */
export function useOpeningHours() {
    /**
     * Handles all opening hours processing.
     */
    class OpeningHours {
        constructor() {

        }

        public isRestaurantOpen(date: Date): boolean {
            // TODO: Implement this
            return true;
        }
    }

    const openingHours = reactive(new OpeningHours());

    return {
        OpeningHours,
        openingHours,
    };
}