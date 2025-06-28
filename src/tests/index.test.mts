import { describe, test } from 'node:test';
import nodeAssert from 'node:assert/strict';
import { Arrow } from '@mlhaufe/arrow';

class Naturals extends Arrow {
    override *exec() {
        let n = 0;
        while (true) yield n++;
    }
}

describe('Arrow', () => {
    test('should compose map and filter operations correctly', () => {
        const nats = new Naturals()
            .map(x => x + 1)
            .map(x => x * 2)
            .filter(x => x % 3 === 0)
            .filter(x => x < 100);

        const results: number[] = [];
        for (const value of nats.exec()) {
            if (value >= 100) break;
            results.push(value);
        }
        // All values should be even, greater than 0, less than 100, and divisible by 3
        nodeAssert(results.every(x => x % 2 === 0 && x > 0 && x < 100 && x % 3 === 0));
        // Check a few expected values
        nodeAssert.deepEqual(results.slice(0, 5), [6, 12, 18, 24, 30]);
    });

    test('Map fuses multiple maps', () => {
        const nats = new Naturals()
            .map(x => x + 1)
            .map(x => x * 2);

        // The transform should be equivalent to x => (x + 1) * 2
        const iter = nats.exec();
        nodeAssert.strictEqual(iter.next().value, 2); // (0+1)*2 = 2
        nodeAssert.strictEqual(iter.next().value, 4); // (1+1)*2 = 4
        nodeAssert.strictEqual(iter.next().value, 6); // (2+1)*2 = 6
    });

    test('Filter fuses multiple filters', () => {
        const nats = new Naturals()
            .filter(x => x % 2 === 0)
            .filter(x => x % 3 === 0);

        // Should yield numbers divisible by 6
        const iter = nats.exec();
        nodeAssert.strictEqual(iter.next().value, 0);
        nodeAssert.strictEqual(iter.next().value, 6);
        nodeAssert.strictEqual(iter.next().value, 12);
        nodeAssert.strictEqual(iter.next().value, 18);
    });

    test('Map and Filter composition', () => {
        const nats = new Naturals()
            .map(x => x + 10)
            .filter(x => x < 15);

        const results = Array.from(nats.exec()).slice(0, 5);
        nodeAssert.deepEqual(results, [10, 11, 12, 13, 14]);
    });
});