import { Arrow } from './Arrow.mjs'

export class Filter extends Arrow {
    constructor(
        readonly prev: Arrow,
        readonly predicate: (value: any) => boolean
    ) {
        super();
        // Fuse if prev is also a Filter
        if (prev instanceof Filter) {
            this.prev = prev.prev;
            this.predicate = x => prev.predicate(x) && predicate(x);
        } else {
            this.prev = prev;
            this.predicate = predicate;
        }
    }

    override *exec() {
        for (const value of this.prev.exec())
            if (this.predicate(value))
                yield value;
    }
}
