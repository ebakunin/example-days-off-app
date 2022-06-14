import { BaseModel } from './base.model';

export class Language extends BaseModel {
    description = '';
    nativeDescription = '';
    abbreviation = '';
    isoCode = '';
    createTimestamp = '';
    lastUpdateTimestamp = '';
    active = false;

    /**
     * @param {Partial<Language>} modelInfo
     */
    init(modelInfo?: Partial<Language>): void {
        if (modelInfo) {
            this.id = modelInfo.id as number;
            this.description = modelInfo.description as string;
            this.nativeDescription = modelInfo.nativeDescription as string;
            this.abbreviation = modelInfo.abbreviation as string;
            this.isoCode = modelInfo.isoCode as string;
            this.createTimestamp = modelInfo.createTimestamp as string;
            this.lastUpdateTimestamp = modelInfo.lastUpdateTimestamp as string;
            this.active = modelInfo.active as boolean;
        }
    }
}
