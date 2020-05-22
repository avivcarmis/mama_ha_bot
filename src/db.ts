import * as Datastore from "nedb";

export class Collection<T> {

    private db!: Datastore<T>;

    constructor(private readonly filename: string) {}

    init = () => {
        return new Promise<undefined>((resolve, reject) => {
            this.db = new Datastore({filename: this.filename});
            this.db.loadDatabase(err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    insertOne = (t: T) => {
        return new Promise<T>((resolve, reject) => {
            this.db.insert(t, (err, document) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(document);
                }
            });
        });
    }

    updateOne = (query: any, t: T) => {
        return new Promise<undefined>((resolve, reject) => {
            (this.db as any).update(query, t, (err: Error) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    findOnd = (query: any) => {
        return new Promise<T>((resolve, reject) => {
            this.db.findOne(query, (err, document) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(document);
                }
            });
        });
    }

}
