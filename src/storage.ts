import * as fs from 'fs';
import {v4 as uuidv4} from 'uuid';
import {
  itemType,
  jsonDataType,
  pkgType,
  storageType,
} from './types';

/** Custom Storage Class */
export class Storage implements storageType {
    type: string;
    file: string;
    data: jsonDataType;

    /**
     * Constructor method
     * @param {string} type
     * @param {string} file
     */
    constructor(type: string, file: string) {
      if (type !== 'json') {
        throw new Error(`Unsupported Storage Type: ${type}`);
      }

      if (!file.endsWith('.json')) {
        throw new Error(`Unsupported File Extension: ${file}`);
      }

      this.type = type;
      this.file = file;
      this.data = {};

      try {
        if (fs.statSync(file).isFile()) {
          this.load();
        }
      } catch {
        this.data = {};
      }
    }

    /**
     * Adds new entry
     * @param {pkgType} pkg
     * @return {string|any}
     */
    add(pkg: pkgType|any): string|any {
      if (pkg && pkg.constructor === Object && Object.keys(pkg).length === 0) {
        return undefined;
      }

      const id: string = uuidv4();
      this.data[id] = {
        ...pkg,
        created: Date.now(),
        updated: Date.now(),
      };

      return id;
    }

    /**
     * Cleans up old entries
     * @param {number} period
     */
    cleanup(period: number): void {
      const before: number = Date.now() - 1000 * period;
      this.remove(Object.keys(this.data).reduce((
          ids: string[],
          id: string,
      ) => {
        const pkg: pkgType = this.data[id];
        if (pkg && pkg.updated && pkg.updated < before) ids.push(id);
        return ids;
      }, []));
    }

    /**
     * Lists all the entries
     * @param {string[]} ids?
     * @return {pkgType[]}
     */
    list(ids?: string[]): pkgType[] {
      if (!ids) {
        ids = Object.keys(this.data);
      }

      return ids.reduce((list: pkgType[], id: string) => {
        if (id in this.data) {
          const pkg: pkgType = this.retrieve(id);
          list.push({...pkg, id});
        }

        return list;
      }, []);
    }

    /**
     * Loads from the given file
     */
    load(): void {
      let rawData: string;
      try {
        rawData = fs.readFileSync(this.file, 'utf8');
      } catch (exception) {
        throw new Error(`Unable to Read from ${this.file}: ${exception}`);
      };

      try {
        if (rawData.length > 2) this.data = JSON.parse(rawData);
      } catch (exception) {
        throw new Error(`Unable to Parse ${rawData}: ${exception}`);
      }
    }

    /**
     * Parses the file content
     * @param {string} pkgStrings
     * @return {string[]}
     */
    parse(pkgStrings: string): string[] {
      const that = this;
      return pkgStrings.split('\n').filter(Boolean).map((pkgString) => {
        return that.parsePackage(pkgString);
      });
    }

    /**
     * Parses just one line of the file content
     * @param {string} pkgString
     * @return {string}
     */
    parsePackage(pkgString: string): string {
      const pkgStringSplit = pkgString.split(' : ');
      const capacity: number = Number(pkgStringSplit[0]);
      const itemStrings: string = pkgStringSplit[1];
      const itemStringSplit: string[] = itemStrings.split(' ');
      const items: itemType[] = itemStringSplit.map((itemString: string) => {
        itemString = itemString.replace(/[()]/g, '');
        const itemStringSplit: string[] = itemString.split(',');
        const index: number = Number(itemStringSplit[0]);
        const weight: number = Number(itemStringSplit[1]);
        const costString: string = itemStringSplit[2];
        const cost: number = Number(costString.split('€')[1]);
        return {index, weight, cost};
      });

      return this.add({capacity, items, count: items.length});
    }

    /**
     * Prints the given entries as a text
     * @param {string[]} ids?
     * @return {string}
     */
    print(ids?: string[]): string {
      const that = this;
      if (!ids) {
        ids = Object.keys(this.data);
      }

      return ids.filter((id: string) => {
        return (id in that.data);
      }).map((id: string) => {
        return that.printPackage(id);
      }).join('\n');
    }

    /**
     * Prints just one package
     * @param {string} id
     * @return {string}
     */
    printPackage(id: string): string {
      const pkg: pkgType = this.data[id];
      const capacity: number = pkg.capacity;
      const itemsJointString: string = pkg.items.map((item: itemType) => {
        return `(${item.index},${item.weight},€${item.cost})`;
      }).join(' ');

      return [capacity, itemsJointString].join(' : ');
    }

    /**
     * Removes the given entries
     * @param {string[]} ids
     */
    remove(ids: string[]): void {
      ids.forEach((id) => {
        delete this.data[id];
      });
    }

    /**
     * Retrieves the specific package
     * @param {string} id
     * @return {pkgType|any}
     */
    retrieve(id: string): pkgType|any {
      if (id in this.data) return this.data[id];
      return undefined;
    }

    /**
     * Saves into the given file
     */
    save(): void {
      let rawData: string;
      try {
        rawData = JSON.stringify(this.data);
      } catch (exception) {
        throw new Error(`Unable to Stringify ${this.data}: ${exception}`);
      }

      try {
        if (rawData.length > 2) fs.writeFileSync(this.file, rawData, 'utf8');
      } catch (exception) {
        throw new Error(`Unable to Write into ${this.file}: ${exception}`);
      }
    }

    /**
     * Updates the given entry
     * @param {string} id
     * @param {pkgType} pkg
     * @return {string|any}
     */
    update(id: string, pkg: pkgType|any): string|any {
      if (pkg && pkg.constructor === Object && Object.keys(pkg).length === 0) {
        return undefined;
      }

      if (id in this.data) {
        this.data[id] = {
          ...this.data[id],
          ...pkg,
          updated: Date.now(),
        };

        return id;
      }

      return undefined;
    }
};
