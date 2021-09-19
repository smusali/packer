import * as fs from 'fs';
import * as util from "util";

interface Pkg {
  capacity: number,
  weights: number[],
  costs: number[]
}

export class Packer {
  static pack(inputFile: string): any[] {
    const pkgs = Packer.readAndParse(inputFile);
    return Packer.calculate(pkgs);
  }

  static readAndParse(inputFile: string): string[] {
    let rawData: string;
    try{
      rawData = fs.readFileSync(inputFile, 'utf8');
    } catch (exception) {
      throw Error(`Unable to Parse ${inputFile}: ${exception}`);
    };

    return rawData.split(')\n').reduce((pkgs: string[], line: string) => {
      const lineSplit: string[] = line.replace(/ /g, '').split(':(');
      const pkg: any = {
        capacity: Number(lineSplit[0]),
        weights: [],
        costs: []
      };

      lineSplit[1].split(')(').forEach((item: string) => {
        const itemSplit: string[] = item.split(',');
        pkg.weights.push(Number(itemSplit[1]));
        pkg.costs.push(Number(itemSplit[2].split(')')[0].split('€')[1]));
      });

      pkgs.push(pkg);
      return pkgs;
    }, [])
  }

  static calculate(pkgs: string[]) {
    return pkgs.map((pkg: any) => {
      const count = pkg.weights.length
      const table = new Map()
      return Packer.knapsack(pkg.capacity, pkg.weights, pkg.costs, table, count)
    })
  }

  static knapsack(capacity: number, weights: number[], costs: number[], table: Map<string, number>, count: number): number {
    if (count <= 0 || capacity <= 0) return 0;
    const key = `count:${count}&capacity:${capacity}`
    if (!table.has(key)) {
      const include: number = costs[count - 1] + Packer.knapsack(Number((capacity - weights[count - 1]).toFixed(2)), weights, costs, table, count - 1)
      const exclude: number = Packer.knapsack(capacity, weights, costs, table, count - 1)
      table.set(key, Math.max(include, exclude));
    }

    return table.get(key) ?? 0
  }

/*
[ { capacity: 81,
    weights: [ 53.38, 88.62, 78.48, 72.3, 30.18, 46.34 ],
    costs: [ 45, 98, 3, 76, 9, 48 ] },
  { capacity: 8, weights: [ 15.3 ], costs: [ 34 ] },
  { capacity: 75,
    weights: [ 85.31, 14.55, 3.98, 26.24, 63.69, 76.25, 60.02, 93.18, 89.95 ],
    costs: [ 29, 74, 16, 55, 52, 75, 74, 35, 78 ] },
  { capacity: 56,
    weights: [ 90.72, 33.8, 43.15, 37.97, 46.81, 48.77, 81.8, 19.36, 6.76 ],
    costs: [ 13, 40, 10, 16, 36, 79, 45, 79, 64 ] } ]
*/
}
