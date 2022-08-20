export function useCombinationResult() {
    class CombinationResult {
        /** Whether the rule/combination was followed or not */
        private _isSuccess: boolean;
        public get isSuccess(): boolean {
            return this._isSuccess;
        }
        /** How many times the rule/combination was followed */
        private _successCount: number;
        public get successCount(): number {
            return this._successCount;
        }

        constructor(isSuccess: boolean, successCount: number = 0) {
            this._isSuccess = isSuccess;
            this._successCount = successCount;
        }
    }

    class DescriptiveCombinationResult {
        /** Name */
        private _name: string;
        public get name(): string {
            return this._name;
        }
        /** Description */
        private _description: string;
        public get description(): string {
            return this._description;
        }
        /** Combination result */
        private _combinationResult: CombinationResult;
        public get combinationResult(): CombinationResult {
            return this._combinationResult;
        }

        constructor(name: string, description: string, combinationResult: CombinationResult) {
            this._name = name;
            this._description = description;
            this._combinationResult = combinationResult;
        }
    }

    return { CombinationResult, DescriptiveCombinationResult };
}