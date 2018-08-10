declare module angular.external.localstorage {
    interface ILocalStorage {

        setPrefix(prefix: string): any;

        isSupported: boolean;
        add(key: any, value: any): any;
        set(key: any, value: any): any;
        get(key: any): any;
        remove(key: any): any;
        clearAll(): any;

    }
} 