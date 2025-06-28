import { Arrow } from './Arrow.mjs'

export class Map extends Arrow {
    constructor(
        readonly prev: Arrow,
        readonly transform: (value: any) => any
    ) {
        super();
        // Fuse if prev is also a Map
        if (prev instanceof Map) {
            this.prev = prev.prev;
            // compose right to left
            this.transform = (value: any) => transform(prev.transform(value));
        } else {
            this.prev = prev;
            this.transform = transform;
        }
    }

    override *exec() {
        for (const value of this.prev.exec())
            yield this.transform(value);
    }
}
