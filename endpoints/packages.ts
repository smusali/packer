import {
  Request,
  Response
} from 'express';

import {Storage} from '../src/storage';
import {
  jsonDataType,
  jsonErrorType,
  jsonSuccessType,
  pkgType,
  storageType,
} from '../src/types';

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
        statusCode = 200;
        jsonResponseData = {
          message: `Successfully Updated ${id}`,
        };
      }
    }

    res.status(statusCode).json(jsonResponseData);
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
   * Retrieves a Package
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
          statusCode = 200;
          jsonResponseData = {
            message: `Successfully Updated ${id}`,
          };
        }
      }
    }

    res.status(statusCode).json(jsonResponseData);
  };
};

// Graceful Shutdown Scenarios
process.once('SIGTERM', storage.save) // kill
process.once('SIGINT', storage.save) // ctrl+c
