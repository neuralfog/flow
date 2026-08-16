import { connect } from './db';
export class Inspector {
    constructor(config) {
        Object.defineProperty(this, "sql", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.sql = connect(config);
    }
    workers() {
        return this.sql `select * from flow.list_workers()`;
    }
    pending() {
        return this.sql `select * from flow.pending()`;
    }
    failed() {
        return this.sql `select * from flow.failed()`;
    }
    close() {
        return this.sql.end();
    }
}
