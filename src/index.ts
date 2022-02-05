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

    enqueue(value: Type): void {
        if (!this.contains(value)) {
            const id = this._hashFunction(value);

            this._values[id] = value;
            this._ordering = [...this._ordering, id];
        }
    }

    dequeue(): Type | undefined {
        if (!this._ordering.length) {
            return undefined;
        }

        const removedId = this._ordering[0];
        this._ordering.shift();
        const value = this._values[removedId];

        delete this._values[removedId];

        return value;
    }

    contains(value: Type): boolean {
        return typeof this._values[this._hashFunction(value)] !== "undefined";
    }

    size(): number {
        return this._ordering.length;
    }

    getNextItem(): Type | undefined {
        if (this._ordering.length === 0) return undefined;

        const nextId = this._ordering[0];
        return this._values[nextId];
    }

    toArray(): Array<Type> {
        const arr: Array<Type> = [];

        for (let i = 0; i < this._ordering.length; i++) {
            const id = this._ordering[i];
            const item = this._values[id];
            arr.push(item);
        }

        return arr;
    }
}
