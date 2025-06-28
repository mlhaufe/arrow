import { Map } from "./Map.mjs";
import { Filter } from "./Filter.mjs";

export abstract class Arrow {
    abstract exec(): Generator<any, void, unknown>;

    map(transform: (value: any) => any): Arrow {
        return new Map(this, transform);
    }

    filter(predicate: (value: any) => boolean): Arrow {
        return new Filter(this, predicate);
    }
}
