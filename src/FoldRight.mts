import { Arrow } from './Arrow.mjs';
import { Map } from './Map.mjs';

export class FoldRight extends Arrow {
    constructor(
        readonly prev: Arrow,
        readonly reducer: (acc: any, value: any) => any,
        readonly initial: any
    ) {
        super();
        // Fold-Fusion law: foldr f z . map g = foldr ((a, b) => f(a, g(b))) z
        if (prev instanceof Map) {
            const mapPrev = prev as Map;
            this.prev = mapPrev.prev;
            this.reducer = (acc: any, value: any) => reducer(acc, mapPrev.transform(value));
            this.initial = initial;
        } else {
            this.prev = prev;
            this.reducer = reducer;
            this.initial = initial;
        }
    }

    override *exec() {
        const values = Array.from(this.prev.exec());
        let acc = this.initial;
        for (const value of values.reverse()) {
            acc = this.reducer(acc, value);
            yield acc;
        }
    }
}
