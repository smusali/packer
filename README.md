# Mobiquity Packaging Code Challenge

This package is the source code for providing a solution to the Packaging Problem. This is very practical challenge involving the [0-1 KnapSack](https://en.wikipedia.org/wiki/Knapsack_problem#0-1_knapsack_problem).

## Description

Please, refer to [Description.pdf](./docs/Description.pdf) for more information.

## Usage

This can be used in 2 ways: as a server or just a regular package using [`Packer`](./src/packer.ts)

### API

`npm install --production && npm start` is enough to start the server supporting the following routes and methods:
 * `GET /` displays the details about the API
 * `GET /info` displays the details about the API
 * `POST /packages` creates a package
 * `GET /packages/example` displays the example package calculation
 * `GET /packages` lists the packages
 * `DELETE /packages/:id` deletes the package having the given `id`
 * `GET /packages/:id` retrieves the package having the given `id`
 * `PUT /packages/:id` updates the package having the given `id`

### Packer
The [`Packer`](./src/packer.ts) class provides the following `static` methods which can be used for calculating which packages can fit under the specified `capacity`:
 * `pack(inputFile: string): string` picks up the items after the calculation is done
 * `report(pkgIndices: number[][]): string` considers each line as a separate package and returns the indices of the picked items for each package
 * `knapSack(pkg: pkgType): number[]` applied the famous [0-1 KnapSack](https://en.wikipedia.org/wiki/Knapsack_problem#0-1_knapsack_problem) onto the mission to find out which items can fit under the given `capacity` and maximize the `cost` where `pkgType` depicts a package and has the following fields:
 ```typescript
 interface pkgType {
    capacity: number,
    count: number,
    created?: number,
    id?: string,
    items: itemType[],
    updated?: number,
}
 ```
 where `itemType` depicts a single item and has the following fields:
 ```typescript
 interface itemType {
    cost: number,
    index: number,
    weight: number,
}
 ```

## Testing
Currently, the unit testing coverage is around `~95%` and missing very explicit testing to catch the exceptions thrown by `load` and `save` methods of the [`Storage`](./src/storage.ts) class.

For running unit tests, `npm install && npm test` is enough since `npm test` also includes `npm run lint` which takes care of the linting issues.

You can also check out the [`example input`](./resources/example_input) and [`example output`](./resources/example_output) to understand the expected results.

## Notes

Please, refer to [NOTES.md](./docs/NOTES.md) for the notes and feedback I have on this challenge.

## License
This package has been published under an MIT license. See the [LICENSE](./LICENSE) file and https://opensource.org/licenses/MIT

