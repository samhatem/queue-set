# Queue Set

A queue that is also a set. I'm sure there's an actual name for this data structure that isn't QueueSet.

## Usage

### Install

`yarn add queue-set`

### Basic Example

```typescript
const queueSet = new QueueSet<string>();
queueSet.enqueue("newItem");

console.log(queueSet.getNextItem()) // "newItem"

console.log(queueSet.dequeue()) // "newItem"

console.log(queueSet.size()) // 0
```

### Constructor

Create a new QueueSet

```typescript
new QueueSet<Type>(hashFunction?: HashFunction<Type>);
```

`hashFunction` is an optional argument that hashes values in the QueueSet to tell if they are distinct. This defaults to `JSON.stringify` (technically this isn't a hash function because it doesn't map values to a fixed size, but the important things is that there's a unique string for each value).

### enqueue

Add a value to the QueueSet

```typescript
set.enqueue(value: Type): void
```

### dequeue

Remove the first value from the QueueSet and return it. Returns undefined if the QueueSet is empty

```typescript
set.dequeue(): Type | undefined
```

### getNextItem

Get the next item in the QueueSet

```typescript
set.getNextItem(): Type | undefined
```

### toArray

Returns the set as an array

```typescript
set.toArray(): Array<Type>
```

## Contributing

### Install dependencies

`yarn` or `npm i`

### Build and watch for changes

`yarn start` or `npm run start`

### Create production bundle

`yarn build` or `npm run build`
