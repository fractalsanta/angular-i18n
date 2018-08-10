module Core.LocalStorage {
    "use strict";

    export interface ILocalStorageService {
        Add(key: string, value: any): any;
        Set(key: string, value: any): any;
        Get(key: string): any;
        Remove(key: string): any;
        IsSupported(): boolean;
    }

    class LocalStorageService implements ILocalStorageService {
        constructor(private $mxlocalStorage: ng.external.localstorage.ILocalStorage) { }

        public Add(key: string, value: any): any {
            return this.$mxlocalStorage.add(key, value);
        }

        public Set(key: string, value: any): any {
            return this.$mxlocalStorage.set(key, value);
        }

        public Get(key: string): any {
            return this.$mxlocalStorage.get(key);
        }

        public Remove(key: string): any {
            return this.$mxlocalStorage.remove(key);
        }

        public IsSupported(): boolean {
            return this.$mxlocalStorage.isSupported;
        }
    }

    export var $localStorageSvc: NG.INamedDependency<ILocalStorageService> =
        NG.CoreModule.RegisterService("MxLocalStorageService", LocalStorageService, Core.NG.$mxlocalStorage);
} 