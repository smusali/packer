import {test, threw} from 'tap';
import {Packer} from '../src/packer';

test('pack', async (t) => {
  const exampleInputFile: string = './resources/example_input';
  const invalidInputFile: string = './resources/example';
  const expected: string = [
    '4',
    '-',
    '2,7',
    '6,9',
    '1,3,5',
  ].join('\n');

  t.same(Packer.pack(exampleInputFile), expected, 'it should pack as expected');
  t.throws(() => {
    return Packer.pack(invalidInputFile);
  }, `Error: Unable to Read ${invalidInputFile}:` +
  ` Error: ENOENT: no such file or directory,` +
  ` open '${invalidInputFile}'`,
  'it should not pack from the invalid input');
}).catch(threw);

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
