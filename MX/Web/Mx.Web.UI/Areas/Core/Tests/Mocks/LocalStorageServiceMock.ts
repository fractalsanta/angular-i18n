module Core.Tests {

    export class LocalStorageServiceMock implements Core.LocalStorage.ILocalStorageService {

        private _data: {};

        Add(key: string, value: any): any {
            this._data[key] = value;
        }

        Set(key: string, value: any): any {
            this._data[key] = value;
        }

        Get(key: string): any {
            return this._data[key];
            
        }

        Remove(key: string): any {
            this._data[key] = null;
            
        }

        IsSupported(): boolean {
            return false;
        }

        Clear() {
            this._data = {};
        }

    }
} 