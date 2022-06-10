const START_INDEX = 0;
const ONE_ITEM = 1;

export type HashFunction<Type> = (value: Type) => string;

export class QueueSet<Type> {
    _hashFunction: HashFunction<Type>;

    _values: Record<string, Type>;

    _ordering: Array<string>;

    constructor(hashFunction?: HashFunction<Type>) {
        this._hashFunction = hashFunction || JSON.stringify;
        this._values = {};
        this._ordering = [];
    }

    /**
     * Add an item to the end of the queue
     * @param value The value to add
     */
    enqueue(value: Type): void {
        if (!this.contains(value)) {
            const id = this._hashFunction(value);

            this._values[id] = value;
            this._ordering = [...this._ordering, id];
        }
    }

    /**
     * Remove and return the first item in the queue
     * @returns The first item in the queue or undefined if the queue is empty
     */
    dequeue(): Type | undefined {
        if (!this._ordering.length) {
            return undefined;
        }

        const value = this.deleteItem(START_INDEX);

        return value;
    }

    /**
     * Check if a value is already in the QueueSet
     * @param value The value to check whether it is already in the queue set
     * @returns whether the value is already in the queue set
     */
    contains(value: Type): boolean {
        return typeof this._values[this._hashFunction(value)] !== "undefined";
    }

    /**
     * Get the size of the queue
     * @returns The size of the queue
     */
    size(): number {
        return this._ordering.length;
    }

    /**
     * Get the next item in the queue
     * @returns The item at the start of the queue
     */
    getNextItem(): Type | undefined {
        if (this._ordering.length === 0) return undefined;

        const nextId = this._ordering[0];
        return this._values[nextId];
    }

    /**
     * Get it as an array
     * @returns The queue in array form
     */
    toArray(): Array<Type> {
        const arr: Array<Type> = [];

        for (let i = 0; i < this._ordering.length; i++) {
            const id = this._ordering[i];
            const item = this._values[id];
            arr.push(item);
        }

        return arr;
    }

    /**
     * Find elements that match the callbackFn
     * @param callbackFn The function to test on each element in the queue
     * @returns An array of elements that the callback returns true for
     */
    find(callbackFn: (element: Type, index?: number, queseSet?: QueueSet<Type>) => boolean): Array<Type> {
        const items: Array<Type> = [];

        for (let i = 0; i < this._ordering.length; i++) {
            const id = this._ordering[i];
            const item = this._values[id];

            const shouldKeep = callbackFn.apply(null, [item, i, this]);

            if (shouldKeep) {
                items.push(item);
            }
        }

        return items;
    }

    /**
     * Remove all elements in the queue that match any elements in the provided array
     * @param items the items to remove from the queue if they exist in the queue
     * @returns the removed items from the queue
     */
    removeBatch(items: Array<Type>): Array<Type> {
        const removedItems: Array<Type> = [];

        const itemIds = items.map(item => this._hashFunction(item));

        for (let i = this._ordering.length - 1; i >= 0; i--) {
            const curId = this._ordering[i];

            if (itemIds.find(id => id === curId)) {
                const removedItem = this.deleteItem(i);

                removedItems.push(removedItem);
            }
        }

        return removedItems;
    }

    /**
     * Delete an item from the queue
     * @param index The index of the item to delete
     * @returns The deleted item
     */
    private deleteItem(index: number): Type {
        const id = this._ordering[index];

        // remove 1 item starting at index
        this._ordering.splice(index, ONE_ITEM);

        const value = this._values[id];

        delete this._values[id];

        return value;
    }
}
