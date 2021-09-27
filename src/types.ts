export interface storageType {
    add(pkg: pkgType|any): string|any;
    cleanup(period: number): void;
    list(ids?: string[]): pkgType[];
    load(): void;
    parse(pkgStrings: string): string[];
    parsePackage(pkgString: string): string;
    print(ids?: string[]): string;
    printPackage(id: string): string;
    remove(ids: string[]): void;
    retrieve(id: string): pkgType|any;
    save(): void;
    update(id: string, pkg: pkgType|any): string|any;
}

export interface itemType {
    cost: number,
    index: number,
    weight: number,
}

export interface pkgType {
    capacity: number,
    count: number,
    created?: number,
    id?: string,
    items: itemType[],
    updated?: number,
}

export interface jsonDataType {
    [id: string]: pkgType
}

export interface jsonErrorType {
    code: 'EINVALID'|'ENOTFOUND',
    error: string,
}

export interface jsonSuccessType {
    message: string,
    id: string,
}
