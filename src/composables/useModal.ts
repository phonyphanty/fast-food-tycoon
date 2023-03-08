export function useModal() {
    class Modal {
        /** Title */
        private _title: string;
        public get title(): string {
            return this._title;
        }
        /** Description */
        private _description: string;
        public get description(): string {
            return this._description;
        }
        /** Reject function */
        private _rejectFn: Function | null;
        private get rejectFn(): Function | null {
            return this._rejectFn;
        }
        /** Accept function */
        private _acceptFn: Function | null;
        private get acceptFn(): Function | null {
            return this._acceptFn;
        }

        constructor(
            title: string, description: string, 
            rejectFn: Function | null = null, acceptFn: Function | null = null) 
        {
            this._title = title;
            this._description = description;
            this._rejectFn = rejectFn;
            this._acceptFn = acceptFn;
        }

        public accept() {
            if (this.acceptFn) {
                return this.acceptFn();
            } else {
                return null;
            }
        }

        public reject() {
            if (this.rejectFn) {
                return this.rejectFn();
            } else {
                return null;
            }
        }
    }

    return { Modal };
}