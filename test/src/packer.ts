/** External Dependencies */
import {test, threw} from 'tap';

/** Internal Dependencies */
import {Packer} from '../../src/packer';

/** Constants */
import {
  exampleInputFile,
  expectedResult,
  invalidInputFile,
} from '../resources/constants';

/** Test the Main Pack Functionality */
test('pack', async (t) => {
  t.same(Packer.pack(exampleInputFile), expectedResult,
      'it should pack as expected');
  t.throws(() => {
    return Packer.pack(invalidInputFile);
  }, `Error: Unable to Read ${invalidInputFile}:` +
  ` Error: ENOENT: no such file or directory,` +
  ` open '${invalidInputFile}'`,
  'it should not pack from the invalid input');
}).catch(threw);

/** Test the Reporter */
test('report', async (t) => {
  t.same(Packer.report([
    [1, 3, 5],
    [],
    [3, 5, 6],
    [],
  ]), [
    '1,3,5',
    '-',
    '3,5,6',
    '-',
  ].join('\n'), 'it should report as expected');
}).catch(threw);
