import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseModel } from '../models/base.model';

export class BaseService<M extends BaseModel> {
    private readonly _data$ = new BehaviorSubject<M[]>([]);
    private _storage: M[] = [];

    /**
     * @param {M[]} models
     */
    public setData(models: M[]): void {
        this._storage = this._storage.concat(models);
        this._data$.next(this._storage);
    }

    /**
     * @returns {Observable<M[]>}
     */
    get all$(): BehaviorSubject<M[]> {
        return this._data$;
    }

    /**
     * @returns {Observable<M>}
     */
    get first$(): Observable<M> {
        return this._data$.pipe(map(data => data[0]));
    }

    /**
     * @param {M["id"]} id
     * @returns {Observable<M>}
     */
    public getById$(id: M['id']): Observable<M | null> {
        return this._data$.pipe(map(data => data?.find(info => info.id === id) ?? null));
    }

    /**
     * @param {M} model
     */
    public saveItem(model: M) {
        if (model.id > 0) {
            this.updateItem(model);
        } else {
            this.createItem(model);
        }
    }

    /**
     * @param {M} updatedModel
     * @private
     */
    private updateItem(updatedModel: M) {
        const index = this._storage.findIndex(model => model.id === updatedModel.id);
        this._storage[index] = updatedModel;
        this._data$.next(this._storage);
    }

    /**
     * @param {M} newModel
     */
    public createItem(newModel: M): void {
        this._storage.push(newModel);
        this._data$.next(this._storage);
    }

    /**
     * @param {M["id"]} id
     */
    public deleteById(id: M['id']): void {
        const index = this._storage.findIndex(model => model.id === id);
        delete this._storage[index];
        this._storage = this._storage.filter(Boolean);

        this._data$.next(this._storage);
    }
}
