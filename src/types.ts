export interface storageType {
    load(): void;
    save(): void;
    add(pkg: pkgType): string;
    update(id: string, pkg: pkgType): string|any
    remove(ids: string[]): void;
    retrieve(id: string): pkgType|any;
    list(ids?: string[]): pkgType[];
    print(ids?: string[]): string;
    printPackage(id: string): string;
    parse(pkgStrings: string): string[];
    parsePackage(pkgString: string): string;
    cleanup(period: number): void;
}

export interface itemType {
    weight: number,
    cost: number,
    index: number
}

export interface pkgType {
    capacity: number,
    items: itemType[],
    count: number,
    created?: number,
    updated?: number,
    id?: string
}

export interface jsonDataType {
	[id: string]: pkgType
}
