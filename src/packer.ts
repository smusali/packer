import * as fs from 'fs';

export class Packer {
    static pack(inputFile: string): any[] {
        const pkgs = Packer.readAndParse(inputFile);
        pkgs.forEach((pkg: any) => {
            return null
        });

        return pkgs;
    }

    static readAndParse(inputFile: string): string[] {
        let rawData: string;
        try{
            rawData = fs.readFileSync(inputFile, 'utf8');
        } catch (exception) {
            throw Error(`Unable to Parse ${inputFile}: ${exception}`);
        };

        interface Pkg {
          capacity: number,
          weights: number[],
          costs: number[]
        }

        return rawData.split(')\n').reduce((pkgs: any[], line: string) => {
            const lineSplit: string[] = line.replace(/ /g, '').split(':(');
            const pkg: Pkg = {
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

/*
[
  {
    "capacity": 81,
    "items": [
      {
        "index": 1,
        "weight": 53.38,
        "cost": "€45"
      },
      {
        "index": 2,
        "weight": 88.62,
        "cost": "€98"
      },
      {
        "index": 3,
        "weight": 78.48,
        "cost": "€3"
      },
      {
        "index": 4,
        "weight": 72.3,
        "cost": "€76"
      },
      {
        "index": 5,
        "weight": 30.18,
        "cost": "€9"
      },
      {
        "index": 6,
        "weight": 46.34,
        "cost": "€48"
      }
    ]
  },
  {
    "capacity": 8,
    "items": [
      {
        "index": 1,
        "weight": 15.3,
        "cost": "€34"
      }
    ]
  },
  {
    "capacity": 75,
    "items": [
      {
        "index": 1,
        "weight": 85.31,
        "cost": "€29"
      },
      {
        "index": 2,
        "weight": 14.55,
        "cost": "€74"
      },
      {
        "index": 3,
        "weight": 3.98,
        "cost": "€16"
      },
      {
        "index": 4,
        "weight": 26.24,
        "cost": "€55"
      },
      {
        "index": 5,
        "weight": 63.69,
        "cost": "€52"
      },
      {
        "index": 6,
        "weight": 76.25,
        "cost": "€75"
      },
      {
        "index": 7,
        "weight": 60.02,
        "cost": "€74"
      },
      {
        "index": 8,
        "weight": 93.18,
        "cost": "€35"
      },
      {
        "index": 9,
        "weight": 89.95,
        "cost": "€78"
      }
    ]
  },
  {
    "capacity": 56,
    "items": [
      {
        "index": 1,
        "weight": 90.72,
        "cost": "€13"
      },
      {
        "index": 2,
        "weight": 33.8,
        "cost": "€40"
      },
      {
        "index": 3,
        "weight": 43.15,
        "cost": "€10"
      },
      {
        "index": 4,
        "weight": 37.97,
        "cost": "€16"
      },
      {
        "index": 5,
        "weight": 46.81,
        "cost": "€36"
      },
      {
        "index": 6,
        "weight": 48.77,
        "cost": "€79"
      },
      {
        "index": 7,
        "weight": 81.8,
        "cost": "€45"
      },
      {
        "index": 8,
        "weight": 19.36,
        "cost": "€79"
      },
      {
        "index": 9,
        "weight": 6.76,
        "cost": "€64)"
      }
    ]
  }
]
*/
}
