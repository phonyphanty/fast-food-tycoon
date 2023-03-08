export function useMoney() {
    class Money {
        private _money: number;
        private get money(): number {
            return this._money;
        }
        private set money(value: number) {
            this._money = value;
        }

        constructor(initialMoney: number = 1000) {
            this._money = initialMoney;
        }

        public get() : number {
            return this.money;
        }

        public toString(): string {
            return this.get().toString();
        }

        public add(toAdd: number): number | null {
            this.money+= toAdd;
            return this.get();
        }

        public remove(toRemove: number): number | null {
            this.money-= toRemove;
            return this.get();
        }

        public canAfford(money: number): boolean {
            return this.money >= money;
        }
    }

    return { Money };
}