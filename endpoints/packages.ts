/** External Dependencies */
import {Request, Response} from 'express';
import * as fs from 'fs';

/** Internal Dependencies */
import {Packer} from '../src/packer';
import {Storage} from '../src/storage';

/** Types and Interfaces */
import {
  itemType,
  jsonDataType,
  jsonErrorType,
  jsonSuccessType,
  pkgType,
  storageType,
} from '../src/types';

/** Constants */
const exampleInputFile: string = './resources/example_input';
const expectedOutputFile: string = './resources/example_output';
const storageFile: string = process.env.STORAGE || './resources/packages.json';
const storage: storageType = new Storage('json', storageFile);

/** Packages Endpoint Implementation */
export class Packages {
  /**
   * Creates the Package
   * @param {Request} req
   * @param {Response} res
   */
  static create(req: Request, res: Response): void {
    let statusCode: number;
    let jsonResponseData: jsonDataType|jsonErrorType|jsonSuccessType;
    const createObject: pkgType = req && req.body;
    if (!createObject) {
      statusCode = 400;
      jsonResponseData = {
        error: 'Missing Request Body',
        code: 'EINVALID',
      };
    } else {
      const id: string|any = storage.add(createObject);
      if (!id) {
        statusCode = 400;
        jsonResponseData = {
          error: 'Invalid Request Body',
          code: 'EINVALID',
        };
      } else {
        const pkg: pkgType = storage.retrieve(id);
        const indices: number[] = Packer.knapSack(pkg);
        const items: itemType[] = indices.map((index: number) => {
          return pkg.items[index - 1];
        });

        storage.update(id, {
          ...pkg,
          items,
          count: items.length,
        });

        statusCode = 200;
        jsonResponseData = {
          message: `Successfully Updated ${id}`,
          id,
        };
      }
    }

    res.status(statusCode).json(jsonResponseData);
  };

  /**
   * Shows the Example
   * @param {Request} req
   * @param {Response} res
   */
  static example(req: Request, res: Response): void {
    const input: string = fs.readFileSync(exampleInputFile, 'utf8');
    const expected: string = fs.readFileSync(expectedOutputFile, 'utf8');
    const output: string = Packer.pack(exampleInputFile);

    res.status(200).send([
      '<i><b>Example Input</b></i>:<br>',
      input.replace(/\r?\n|\r/g, '<br>'),
      '<br><br><i><b>Example Output</b></i>:<br>',
      expected.replace(/\r?\n|\r/g, '<br>'),
      '<br><br><i><b>Actual Output</b></i>:<br>',
      output.replace(/\r?\n|\r/g, '<br>'),
    ].join(''));
  }

  /**
   * Provides Information about the Service
   * @param {Request} req
   * @param {Response} res
   */
  static info(req: Request, res: Response): void {
    res.status(200).send([
      '<i>Welcome to Mobiquity Packaging Challenge!</i><br>',
      'Available Routes:',
      ' - <b>POST /packages</b>: Creates a package',
      ' - <b>GET /packages/example</b>: Displays the example calculation',
      ' - <b>GET /info</b>: Displays the details about the API',
      ' - <b>GET /packages</b>: Lists the Packages',
      ' - <b>DELETE /packages/:id</b>: Deletes the Package',
      ' - <b>GET /packages/:id</b>: Retrieves the Package',
      ' - <b>PUT /packages/:id</b>: Updates the Package',
    ].join('<br>'));
  };

  /**
   * Lists the Packages
   * @param {Request} req
   * @param {Response} res
   */
  static list(req: Request, res: Response): void {
    const ids: string[]|any = req && req.query && req.query.ids;
    res.status(200).json(storage.list(ids));
  };

  /**
   * Removes the Package
   * @param {Request} req
   * @param {Response} res
   */
  static remove(req: Request, res: Response): void {
    const id: string = req && req.params && req.params.id;

    let statusCode: number;
    let jsonResponseData: jsonDataType|jsonErrorType|jsonSuccessType;

    if (id) {
      statusCode = 200;
      jsonResponseData = {
        message: `Successfully Removed ${id}`,
        id,
      };
    } else {
      statusCode = 400;
      jsonResponseData = {
        error: 'Invalid or Missing Package ID',
        code: 'EINVALID',
      };
    }

    res.status(statusCode).json(jsonResponseData);
  };

  /**
   * Retrieves the Package
   * @param {Request} req
   * @param {Response} res
   */
  static retrieve(req: Request, res: Response): void {
    const id: string = req && req.params && req.params.id;
    let statusCode: number;
    let jsonResponseData: jsonDataType|jsonErrorType;

    if (id) {
      const pkg: pkgType|any = storage.retrieve(id);
      if (pkg) {
        statusCode = 200;
        jsonResponseData = pkg;
      } else {
        statusCode = 400;
        jsonResponseData = {
          error: `No Package Found for ${id}`,
          code: 'ENOTFOUND',
        };
      }
    } else {
      statusCode = 400;
      jsonResponseData = {
        error: 'Invalid or Missing Package ID',
        code: 'EINVALID',
      };
    }

    res.status(statusCode).json(jsonResponseData);
  };

  /**
   * Updates the Package
   * @param {Request} req
   * @param {Response} res
   */
  static update(req: Request, res: Response): void {
    const id: string = req && req.params && req.params.id;
    let statusCode: number;
    let jsonResponseData: jsonDataType|jsonErrorType|jsonSuccessType;

    if (!id) {
      statusCode = 400;
      jsonResponseData = {
        error: 'Invalid or Missing Package ID',
        code: 'EINVALID',
      };
    } else {
      const updateObject: pkgType = req && req.body;
      if (!updateObject) {
        statusCode = 400;
        jsonResponseData = {
          error: 'Missing Request Body',
          code: 'EINVALID',
        };
      } else {
        const updatedID: string|any = storage.update(id, updateObject);
        if (!updatedID) {
          statusCode = 400;
          jsonResponseData = {
            error: 'Invalid Request Body',
            code: 'EINVALID',
          };
        } else {
          const pkg: pkgType = storage.retrieve(updatedID);
          const indices: number[] = Packer.knapSack(pkg);
          const items: itemType[] = indices.map((index: number) => {
            return pkg.items[index - 1];
          });

          storage.update(updatedID, {
            ...pkg,
            items,
            count: items.length,
          });

          statusCode = 200;
          jsonResponseData = {
            message: `Successfully Updated ${id}`,
            id,
          };
        }
      }
    }

    res.status(statusCode).json(jsonResponseData);
  };
};

const gracefulShutdown = () => {
  storage.cleanup(24 * 60 * 60);
  storage.save();
};

// Graceful Shutdown Scenarios
process.once('SIGTERM', gracefulShutdown); // kill
process.once('SIGINT', gracefulShutdown); // ctrl+c
