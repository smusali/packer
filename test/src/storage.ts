/** External Dependencies */
import * as fs from 'fs';
import {test, threw} from 'tap';

/** Internal Dependencies */
import {Storage} from '../../src/storage';

/** Types and Interfaces */
import {storageType} from '../../src/types';

/** Constants */
import {
  data,
  existentFile,
  inexistentFile,
  supportedType,
  unsupportedExtension,
  unsupportedType,
} from '../resources/constants';

/** Variable to Use */
let storage: storageType;

/** Test Storage Basic Functionality */
test('storage', async (t) => {
  t.throws(() => {
    return new Storage(unsupportedType, existentFile);
  },
  `Unsupported Storage Type: ${unsupportedType}`,
  'it should throw in case of unsupported type');

  t.throws(() => {
    return new Storage(supportedType, unsupportedExtension);
  }, `Unsupported File Extension: ${unsupportedExtension}`,
  'it should throw in case of unsupported extension');

  fs.writeFileSync(existentFile, JSON.stringify({}), 'utf-8');
  storage = new Storage(supportedType, existentFile);
  t.same(storage, {
    type: supportedType,
    file: existentFile,
    data: {},
  }, 'initializing an empty storage by loading');

  t.same(storage.add({}), undefined,
      'should not add an empty object');

  const id: string = storage.add(data);
  t.match(storage.retrieve(id), {
    ...data,
    created: Number,
    updated: Number,
  }, 'retrieving what has been added');

  storage.update(id, {
    ...data,
    capacity: data.capacity * 2,
    created: Number,
    updated: Number,
  });

  t.match(storage.retrieve(id), {
    ...data,
    capacity: data.capacity * 2,
    created: Number,
    updated: Number,
  }, 'retrieving what has been updated');

  t.same(storage.update(id, {}), undefined,
      'undefined for empty update');

  t.same(storage.update('fakeid', {
    ...data,
    capacity: data.capacity * 2,
    created: Number,
    updated: Number,
  }), undefined, 'undefined for take id');

  storage.cleanup(10);
  t.match(storage.retrieve(id), {
    ...data,
    capacity: data.capacity * 2,
    created: Number,
    updated: Number,
  }, 'retrieving what has been updated after potential cleanup');

  t.same(storage.list(), storage.list([id]),
      'retrieving the same list');

  t.same(storage.print(), storage.print([id]),
      'retrieving the same prints');

  storage.save();
  storage.load();
  storage.remove([id]);
  t.same(storage.retrieve(id), undefined,
      'cannot retrieve undefined data');
  storage.save();
}).catch(threw);

/** Test load() and save() */
test('test load and save', async (t) => {
  storage = new Storage(supportedType, inexistentFile);
  t.throws(() => {
    storage.load();
  }, `Unable to Read from ${inexistentFile}:` +
  ` Error: ENOENT: no such file or directory,` +
  ` open '${inexistentFile}'`, 'throws on unreadable file');
}).catch(threw);

/**
  * TO BE ADDED:
  * Explicit Tests to Capture the Exceptions
  * Coming from load() and save() Methods
  */
