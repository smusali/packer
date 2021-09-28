/** External Dependencies */
import * as fs from 'fs';
import {test, threw} from 'tap';

/** Internal Dependencies */
import {Packer} from '../src/packer';

/** Test the Main Pack Functionality */
test('pack', async (t) => {
  const exampleInputFile: string = './resources/example_input';
  const exampleOutputFile: string = './resources/example_output';
  const invalidInputFile: string = './resources/example';
  const expected: string = fs.readFileSync(exampleOutputFile, 'utf-8');

  t.same(Packer.pack(exampleInputFile), expected, 'it should pack as expected');
  t.throws(() => {
    return Packer.pack(invalidInputFile);
  }, `Error: Unable to Read ${invalidInputFile}:` +
  ` Error: ENOENT: no such file or directory,` +
  ` open '${invalidInputFile}'`,
  'it should not pack from the invalid input');
}).catch(threw);

/** Test the Reporter */
test('report', async (t) => {
  const input: number[][] = [
    [1, 3, 5],
    [],
    [3, 5, 6],
    [],
  ];

  const expected: string = [
    '1,3,5',
    '-',
    '3,5,6',
    '-',
  ].join('\n');

  t.same(Packer.report(input), expected, 'it should report as expected');
}).catch(threw);
