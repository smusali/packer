/** External Dependencies */
import * as fs from 'fs';

/** Types and Interfaces */
import {pkgType} from '../../src/types';

export const data: pkgType|any = {
  capacity: 50,
  count: 1,
  items: [{
    weight: 10,
    index: 1,
    cost: 50,
  }],
};

export const exampleInputFile: string = './resources/example_input';
export const exampleOutputFile: string = './resources/example_output';
export const existentFile: string = './resources/package.json';
export const expectedResult: string = fs.readFileSync(
    exampleOutputFile,
    'utf-8',
);

export const inexistentFile: string = 'file.json';
export const invalidInputFile: string = './resources/example';
export const invalidDataFile: string = './resources/invalidPackage.json';
export const supportedType: string = 'json';
export const unsupportedType: string = 'text';
export const unsupportedExtension: string = 'file.txt';
