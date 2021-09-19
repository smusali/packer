const fs = require('fs');

export class Packer {
    static pack(inputFile: string): string {
        const packages = readAndParse(inputFile)
        packages.forEach((package) => {
            return calculate(package)
        })
        throw Error("Not implemented");
    }

    static async readAndParse(inputFile: string): string[] {
        try{
            const rawData: string = await fs.readFile(inputFile, 'utf8')
        } catch (exception) {
            throw Error(`Unable to Parse ${inputFile}: ${exception}`)
        }

        return rawData.split(')\n').reduce((packages, line) => {
            const lineSplit = line.replace(/ /g, '').split(':(')
            const package = {
                capacity: Number(lineSplit[0]),
                weights: [],
                costs: []
            }

            lineSplit[1].split(')(').map((item) => {
                const itemSplit = item.split(',')
                package.weights.push(Number(itemSplit[1]))
                package.costs.push(Number(itemSplit[2].split('€')[1]))
            })

            packages.push(package)
            return packages
        }, [])
    }

    static calculate(package: any): any {

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

    static calculate(parsedData: any): any {

    }
}
