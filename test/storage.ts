import {test, threw} from 'tap';
import * as fs from 'fs';
import {Storage} from '../src/storage';
import {storageType, pkgType} from '../src/types';

let file: string = './resources/package.json';
const type: string = 'json';
const data: pkgType|any = {
  capacity: 50,
  count: 1,
  items: [{
    weight: 10,
    index: 1,
    cost: 50,
  }],
};

let storage: storageType;

test('storage', async (t) => {
  const unsupportedType: string = 'text';
  t.throws(() => {
    return new Storage(unsupportedType, file);
  },
  `Unsupported Storage Type: ${unsupportedType}`,
  'it should throw in case of unsupported type');

  const unsupportedExtension: string = `${file}.txt`;
  t.throws(() => {
    return new Storage(type, unsupportedExtension);
  }, `Unsupported File Extension: ${unsupportedExtension}`,
  'it should throw in case of unsupported extension');

  fs.writeFileSync(file, JSON.stringify({}), 'utf-8');
  storage = new Storage(type, file);
  t.same(storage, {type, file, data: {}},
      'initializing an empty storage by loading');

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

  storage.cleanup(0.001);
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

test('test load and save', async (t) => {
  file = file.replace('.', '');
  storage = new Storage(type, file);
  t.throws(() => {
    storage.load();
  }, `Unable to Read from ${file}:` +
  ` Error: ENOENT: no such file or directory,` +
  ` open '${file}'`, 'throws on unreadable file');

  storage.save();
}).catch(threw);

/**
  * TO BE ADDED:
  * Explicit Tests to Capture the Exceptions
  * Coming from load() and save() Methods
  */
