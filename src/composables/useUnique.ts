export function useUnique() {
    class UniqueObject<T> {
        /** Value */
        private _value: T;
        public get value(): T {
            return this._value;
        }
        /** UUID */
        private _id: string;
        public get id(): string {
            return this._id;
        }
        
        constructor(value: T) {
            this._value = value;
            this._id = UniqueObject.generateUUID();
        }

        public static generateUUID(): string {
            return Math.random().toString(36).substring(2);
        }
    }

    return { UniqueObject };
}