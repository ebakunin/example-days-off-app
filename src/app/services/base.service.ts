import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseModel } from '../models/base.model';

/*
 * BaseService mocks CRUD behavior that would be handled by an API.
 */
export class BaseService<M extends BaseModel> {
    private readonly _data$ = new BehaviorSubject<M[]>([]);
    private _storage: M[] = [];

    /**
     * @param {<M extends BaseModel>[]} models
     */
    public setData(models: M[]): void {
        this._storage = this._storage.concat(models);
        this._data$.next(this._storage);
    }

    /**
     * @returns {Observable<<M extends BaseModel>[]>}
     */
    get all$(): BehaviorSubject<M[]> {
        return this._data$;
    }

    /**
     * @returns {Observable<M extends BaseModel>}
     */
    get first$(): Observable<M> {
        return this._data$.pipe(map(data => data[0]));
    }

    /**
     * @param {<M extends BaseModel>["id"]} id
     * @returns {Observable<M extends BaseModel | null>}
     */
    public getById$(id: M['id']): Observable<M | null> {
        return this._data$.pipe(map(data => data?.find(info => info.id === id) ?? null));
    }

    /**
     * @param {M extends BaseModel} model
     * @returns {Observable<M extends BaseModel | null>}
     */
    public saveItem$(model: M): Observable<M | null> {
        return model.id > 0 ? this.updateItem$(model) : this.createItem$(model);
    }

    /**
     * @param {M extends BaseModel} updatedModel
     * @returns {Observable<M extends BaseModel | null>}
     * @private
     */
    private updateItem$(updatedModel: M): Observable<M | null> {
        const index = this._storage.findIndex(model => model.id === updatedModel.id);
        this._storage[index] = updatedModel;
        this._data$.next(this._storage);
        return of(updatedModel);
    }

    /**
     * @param {M extends BaseModel} newModel
     * @returns {Observable<M extends BaseModel | null>}
     */
    public createItem$(newModel: M): Observable<M | null> {
        this._storage.push(newModel);
        this._data$.next(this._storage);
        return of(newModel);
    }

    /**
     * @param {M extends BaseModel["id"]} id
     * @returns {Observable<boolean>}
     */
    public deleteById(id: M['id']): Observable<boolean> {
        const index = this._storage.findIndex(model => model.id === id);
        delete this._storage[index];
        this._storage = this._storage.filter(Boolean);
        this._data$.next(this._storage);
        return of(true);
    }
}
