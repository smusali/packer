import * as fs from 'fs';

interface Item {
  index: number,
  weight: number,
  cost: number
}

interface Pkg {
  capacity: number,
  items: Item[]
}

export class Packer {
  static pack(inputFile: string): string {
    const pkgs: any[] = Packer.readAndParse(inputFile);
    const results: any[] = Packer.calculate(pkgs);
    return Packer.report(results);
  }

  static readAndParse(inputFile: string): string[] {
    let rawData: string;
    try{
      rawData = fs.readFileSync(inputFile, 'utf8');
    } catch (exception) {
      throw Error(`Unable to Read ${inputFile}: ${exception}`);
    };

    try {
      return rawData.split(')\n').reduce((pkgs: string[], line: string) => {
        const lineSplit: string[] = line.replace(/ /g, '').split(':(');
        const pkg: any = lineSplit[1].split(')(').reduce((data: any, item: string) => {
          const itemSplit: string[] = item.split(',');
          data.weights.push(Math.round(100 * Number(itemSplit[1])));
          data.costs.push(Number(itemSplit[2].split(')')[0].split('€')[1]));
          data.indices.push(Number(itemSplit[0]));
          data.length += 1;
          return data;
        }, {
          capacity: Math.round(100 * Number(lineSplit[0])),
          length: 0,
          weights: [],
          costs: [],
          indices: []
        });

        pkgs.push(pkg);
        return pkgs;
      }, []);
    } catch (exception) {
      throw Error(`Unable to Parse ${inputFile}: ${exception}`);
    };
  }

  static calculate(pkgs: string[]): any[] {
    return pkgs.map((pkg: any) => {
      const {
        capacity,
        weights,
        costs,
        indices,
        length
      } = pkg;

      return Packer.knapSack(capacity, weights, costs, indices, length);
    })
  }

  static knapSack(capacity: number, weights: number[], costs: number[], indices: number[], length: number): number[] {
    let itemIndex: number = 0;
    let subCapacity: number = 0;
    let totalCost: number = 0;
    let table = new Array(length + 1);
    for(itemIndex = 0; itemIndex < table.length; itemIndex++){
      table[itemIndex] = new Array(capacity + 1);
      for(let subCapacity = 0; subCapacity < capacity + 1; subCapacity++){
        table[itemIndex][subCapacity] = 0;
      }
    }
   
    for (itemIndex = 0; itemIndex <= length; itemIndex++) {
      for (subCapacity = 0; subCapacity <= capacity; subCapacity++) {
        if (itemIndex == 0 || subCapacity == 0)
          table[itemIndex][subCapacity] = 0;
        else if (weights[itemIndex - 1] <= subCapacity)
          table[itemIndex][subCapacity] = Math.max(table[itemIndex - 1][subCapacity],
            costs[itemIndex - 1] + table[itemIndex - 1][subCapacity - weights[itemIndex - 1]]);
        else
          table[itemIndex][subCapacity] = table[itemIndex - 1][subCapacity];
      }
    }
   
    const pickedItems = [];
    totalCost = table[length][capacity];
    subCapacity = capacity;
    for (itemIndex = length; itemIndex > 0 && totalCost > 0; itemIndex--) {
      if (totalCost === table[itemIndex - 1][subCapacity]) continue
      pickedItems.push(indices[itemIndex - 1]);
      totalCost -= costs[itemIndex - 1];
      subCapacity -= weights[itemIndex - 1];
    }

    return pickedItems.sort();
  }

  static report(pickedItems: number[][]): string {
    return pickedItems.map((indices) => {
      if (indices.length) return indices.join(',');
      return '-'
    }).join('\n');
  }
}
