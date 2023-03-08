export function useQueue() {
    class Queue<T> {
        private _queue: T[] = [];
        private get queue(): T[] {
            return this._queue;
        }

        public enqueue(el: T) {
            this.queue.push(el);
        }

        public dequeue(): T | undefined {
            return this.queue.shift();
        }
    }

    return { Queue };
}