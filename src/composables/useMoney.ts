/**
 * Handle money logic.
 * @module
 */

export function useMoney() {
    /**
     * Handle all money processing
     */
    class Money {
        /** The player's money total. This should never be a floating point to
         * make things simple for the player and to make our calculations
         * easier
         */
        private money: number;

        constructor(initialMoney: number = 1000) {
            this.money = initialMoney;
        }

        /**
         * @returns The player's money total
         */
        public get() : number {
            return this.money;
        }

        /**
         * @returns The player's money total as a string
         */
        public toString(): string {
            return this.get().toString();
        }

        /**
         * Add money to the player's total
         * @param toAdd The amount of money to add to the total. This is
         * floored before being added to the total
         * @returns The player's money total with the added money
         */
        public add(toAdd: number): number {
            toAdd = Math.floor(toAdd);
            this.money+= toAdd;
            return this.get();
        }

        /**
         * Remove money from the player's total
         * @param toRemove The amount of money to remove from the total. This is
         * floored before being removed from the total
         * @returns The player's money total with the money removed
         */
        public remove(toRemove: number): number {
            toRemove = Math.floor(toRemove);
            this.money-= toRemove;
            return this.get();
        }

        /**
         * @param money The amount of money to evaluate against the player's
         * total. This is floored before evaluation
         * @returns `true` if the player can afford the amount, `false` otherwise
         */
        public canAfford(money: number): boolean {
            money = Math.floor(money);
            return this.money >= money;
        }

        /**
         * Remove money from the player's total, but only if they can afford it
         * @param toRemove The amount of money to remove from the player's
         * total. This is floored before evaluation and removal
         * @returns The player's new total if they can afford it, `false`
         * otherwise
         */
        public removeIfCanAfford(toRemove: number): number | false {
            if (this.canAfford(toRemove)) {
                return this.remove(toRemove);
            }
            return false;
        }
    }

    return { Money };
}