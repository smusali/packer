import * as fs from 'fs';
import { Storage } from './storage'
import { storageType, itemType, pkgType, jsonDataType } from './types'

/** Packer Class */
export class Packer {
  /**
   * Packs after calculation
   * @param {string} inputFile
   * @return {string}
   */
  static pack(inputFile: string): string {
    const storage: storageType = new Storage('json', `${inputFile}.json`);
    let pkgStrings: string;
    try {
      pkgStrings = fs.readFileSync(inputFile, 'utf8');
    } catch (exception) {
      throw Error(`Unable to Read ${inputFile}: ${exception}`);
    };

    return Packer.report(storage.parse(pkgStrings).map((pkgID: string) => {
      const pkg: pkgType = storage.retrieve(pkgID);
      const indices: number[] = Packer.knapSack(pkg)
      const items: itemType[] = indices.map((index: number) => {
        return pkg.items[index - 1];
      });

      storage.update(pkgID, {
        ...pkg,
        items,
        count: items.length
      });

      return indices;
    }));
  }

  /**
   * Reports results as a text
   * @param {number[]} pkgIDs
   * @return {}
   */
  static report(pkgIDs: number[][]): string {
    return pkgIDs.map((indices) => {
      if (indices && indices.length === 0) return '-';
      return indices.join(',');
    }).join('\n');
  };

  /**
   * Solve the Knapsack
   * @param {pkgType} pkg
   * @return {number[]}
   */
  static knapSack(pkg: pkgType): number[] {
    const capacity: number = Math.round(Number(100 * pkg.capacity));
    const items: itemType[] = pkg.items;
    const weights: number[] = items.map(item => Math.round(Number(100 * item.weight)));
    const costs: number[] = items.map(item => item.cost);
    const indices: number[] = items.map(item => item.index);
    const count: number = items.length;

    let i: number = 0;
    let w: number = 0;
    let totalCost: number = 0;
    const table = new Array(count + 1);
    for (i = 0; i < table.length; i++) {
      table[i] = new Array(capacity + 1);
      for (let w = 0; w < capacity + 1; w++) {
        table[i][w] = 0;
      }
    }

    for (i = 0; i <= count; i++) {
      for (w = 0; w <= capacity; w++) {
        if (i == 0 || w == 0) {
          table[i][w] = 0;
        } else if (weights[i - 1] <= w) {
          table[i][w] = Math.max(table[i - 1][w],
              costs[i - 1] + table[i - 1][w - weights[i - 1]]);
        } else {
          table[i][w] = table[i - 1][w];
        }
      }
    }

    const pickedItems = [];
    totalCost = table[count][capacity];
    w = capacity;
    for (i = count; i > 0 && totalCost > 0; i--) {
      if (totalCost === table[i - 1][w]) continue;
      pickedItems.push(indices[i - 1]);
      totalCost -= costs[i - 1];
      w -= weights[i - 1];
    }

    return pickedItems.sort();
  }
}

console.log(Packer.pack('./resources/example_input'));
