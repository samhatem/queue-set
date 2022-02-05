import { QueueSet } from "../src";

describe("QueueSet test", () => {
    let queueSet: QueueSet<string>;
    const initialItem = "first";

    beforeEach(() => {
        queueSet = new QueueSet<string>();

        queueSet.enqueue(initialItem);

        // make sure we can't add duplicate items
        queueSet.enqueue(initialItem);
    });

    describe("enqueue works", () => {
        it("enqueue updates size of the set", () => {
            expect(queueSet.size()).toBe(1);
        });

        it("contains works after enqueue", () => {
            expect(queueSet.contains(initialItem)).toBe(true);
        });

        it("first value is the initial value", () => {
            expect(queueSet.toArray()[0]).toBe(initialItem);
        });

        it("next item updates ", () => {
            const nextItem = queueSet.getNextItem();

            expect(nextItem).toBe(initialItem);
        });

        describe("additional enqueue", () => {
            const additionalItem = "second";

            beforeEach(() => {
                queueSet.enqueue(additionalItem);

                // make sure we can't add additional items
                queueSet.enqueue(additionalItem);
            });

            it("updates size", () => {
                expect(queueSet.size()).toBe(2);
            });

            it("contains new item", () => {
                expect(queueSet.contains(additionalItem)).toBe(true);
            });

            it("nextItem is still the first item", () => {
                const nextItem = queueSet.getNextItem();

                expect(nextItem).toBe(initialItem);
            });

            it("toArray works as expected", () => {
                const arr = queueSet.toArray();

                expect(arr[0]).toBe(initialItem);
                expect(arr[1]).toBe(additionalItem);
            });

            describe("dequeue works as expected", () => {
                let removedItem: string;

                beforeEach(() => {
                    removedItem = queueSet.dequeue() as string;
                });

                it("removed item is the first item", () => {
                    expect(removedItem).toBe(initialItem);
                });

                it("size updates", () => {
                    expect(queueSet.size()).toBe(1);
                });

                it("next item updates", () => {
                    const nextItem = queueSet.getNextItem();

                    expect(nextItem).toBe(additionalItem);
                });

                it("no longer contains removed item", () => {
                    expect(queueSet.contains(initialItem)).toBe(false);
                });

                it("returns undefined when there's not items to dequeue", () => {
                    queueSet.dequeue();

                    const shouldBeUndefined = queueSet.dequeue();

                    expect(shouldBeUndefined).toBe(undefined);
                });
            });
        });
    });
});
