import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseModel } from '../models/base.model';

/*
 * BaseService mocks CRUD behavior that would be handled by an API.
 */
export class BaseService<M extends BaseModel> {
    readonly #data$ = new BehaviorSubject<M[]>([]);
    #storage: M[] = [];

    /**
     * @param {<M extends BaseModel>[]} models
     */
    setData(models: M[]): void {
        this.#storage = [...this.#storage, ...models];
        this.#data$.next(this.#storage);
    }

    /**
     * @returns {Observable<<M extends BaseModel>[]>}
     */
    get all$(): BehaviorSubject<M[]> {
        return this.#data$;
    }

    /**
     * @returns {Observable<M extends BaseModel>}
     */
    get first$(): Observable<M> {
        return this.#data$.pipe(map((data) => data[0]));
    }

    /**
     * @param {<M extends BaseModel>["id"]} id
     * @returns {Observable<M extends BaseModel | null>}
     */
    getById$(id: M['id']): Observable<M | null> {
        return this.#data$.pipe(
            map((data) => data?.find((info) => info.id === id) || null)
        );
    }

    /**
     * @param {M extends BaseModel} model
     * @returns {Observable<M extends BaseModel | null>}
     */
    saveItem$(model: M): Observable<M | null> {
        return model.id > 0 ? this.#updateItem$(model) : this.createItem$(model);
    }

    /**
     * @param {M extends BaseModel} newModel
     * @returns {Observable<M extends BaseModel | null>}
     */
    createItem$(newModel: M): Observable<M | null> {
        this.#storage.push(newModel);
        this.#data$.next(this.#storage);
        return of(newModel);
    }

    /**
     * @param {M extends BaseModel["id"]} id
     * @returns {Observable<boolean>}
     */
    deleteById(id: M['id']): Observable<boolean> {
        const index = this.#storage.findIndex((model) => model.id === id);
        delete this.#storage[index];
        this.#storage = this.#storage.filter(Boolean);
        this.#data$.next(this.#storage);
        return of(true);
    }

    /**
     * @param {M extends BaseModel} updatedModel
     * @returns {Observable<M extends BaseModel | null>}
     * @private
     */
    #updateItem$(updatedModel: M): Observable<M | null> {
        const index = this.#storage.findIndex((model) => model.id === updatedModel.id);
        this.#storage[index] = updatedModel;
        this.#data$.next(this.#storage);
        return of(updatedModel);
    }
}
