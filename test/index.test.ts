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

        it("filters out 1 element", () => {
            const filteredEls = queueSet.find(element => element === initialItem);

            expect(filteredEls.length).toBe(1);
        });

        it("filters out no elements", () => {
            const filteredEls = queueSet.find(element => element !== initialItem);

            expect(filteredEls.length).toBe(0);
        });

        it("removes a batch of items from the queue", () => {
            const batch = queueSet.find(element => element === initialItem);

            queueSet.removeBatch(batch);

            expect(queueSet.size()).toBe(0);
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

            it("removes a batch of items from the queue", () => {
                const batch = queueSet.find(element => element === initialItem);

                queueSet.removeBatch(batch);

                expect(queueSet.size()).toBe(1);
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

    describe("find and batch on more complex array", () => {
        let singleLetters: string[];
        let doubleLetters: string[];

        let ordering: string[];

        beforeEach(() => {
            while (queueSet.size()) {
                queueSet.dequeue();
            }

            singleLetters = ["a", "b", "c"];
            doubleLetters = ["aa", "ab", "bb", "ac", "cc"];

            singleLetters.forEach((letter, i) => i < singleLetters.length / 2 && queueSet.enqueue(letter));
            doubleLetters.forEach(letters => queueSet.enqueue(letters));
            singleLetters.forEach(letter => queueSet.enqueue(letter));

            ordering = queueSet.toArray();
        });

        it("able to find items", () => {
            const found = queueSet.find(item => item.length === 1);

            found.forEach((item, index) => {
                expect(item).toBe(singleLetters[index]);
            });

            expect(found.length).toBe(singleLetters.length);
        });

        it("able to remove a batch of items", () => {
            const itemsToRemove = [doubleLetters[2], singleLetters[1], singleLetters[0]];

            const removedItems = queueSet.removeBatch(itemsToRemove);

            expect(removedItems.length).toBe(itemsToRemove.length);
        });

        it("array has expected order after removing batch", () => {
            const itemsToRemove = [doubleLetters[2], singleLetters[1], singleLetters[0]];

            const removedItems = queueSet.removeBatch(itemsToRemove);

            const expectedOrdering: string[] = [];

            for (let i = 0; i < ordering.length; i++) {
                if (!itemsToRemove.find(item => item === ordering[i])) { // eslint-disable-line
                    expectedOrdering.push(ordering[i]);
                }
            }

            queueSet.toArray().forEach((item, i) => {
                expect(item).toBe(expectedOrdering[i]);
            });

            expect(removedItems.length).toBe(itemsToRemove.length);
        });
    });
});
