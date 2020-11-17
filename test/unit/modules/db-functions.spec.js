import {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItemById,
  getCallListItems
} from '../../../src/modules/db-functions.js';

import { NotFoundError } from '../../../src/modules/custom-errors.js';

describe('Database Functions', () => {

  const multiDummyData = [{
    id: 1,
    firstName: 'guy',
    middleName: 'person',
    lastName: 'friend',
    homePhone: 'someNumber',
  },
  {
    id: 2,
    firstName: 'fella',
    middleName: 'buddy',
    lastName: 'chief',
    homePhone: 'another',
  }];

  describe('getAllItems', () => {
    it('should get all items', async () => {

      const mockCollection = {
        find: () => multiDummyData,
      };

      const getAll = getAllItems(mockCollection);
      const actual = getAll();
      const expected = [{
        id: 1,
        name: {
          first: 'guy',
          middle: 'person',
          last: 'friend'
        },
        phone:[{
            type: 'home',
            number: 'someNumber'
        }],
        address: {}
      }, {
        id: 2,
        name: {
          first: 'fella',
          middle: 'buddy',
          last: 'chief'
        },
        phone:[{
            type: 'home',
            number: 'another'
        }],
        address: {}
      }];

      expect(actual).toEqual(expected);
    });
  });

  describe('getItemById', () => {
    it('should get item', async () => {
      const multiDummyData = {
        id: 1,
        firstName: 'guy',
        middleName: 'person',
        lastName: 'friend',
        homePhone: 'someNumber',
      };

      const mockCollection = {
        findOne: () => multiDummyData,
      };

      const getItem = getItemById(mockCollection);
      const actual = getItem();
      const expected = {
        id: 1,
        name: {
          first: 'guy',
          middle: 'person',
          last: 'friend'
        },
        phone:[{
            type: 'home',
            number: 'someNumber'
        }],
        address: {}
      };

      expect(actual).toEqual(expected);
    });

    it('should throw if item does not exits', async () => {

      const mockCollection = {
        findOne: () => null,
      };

      const getItem = getItemById(mockCollection);

      expect(() => getItem('someId')).toThrow(NotFoundError);
    });
  });

describe('createItem', () => {
  it('should create the item and get a genereated id back', async () => {

    const mockCollection = {
      insert: () => ({ id: 1 }),
    };

    const create = createItem(mockCollection);
    const actual = create({});

    expect(actual).toEqual(1);
  });
});

describe('updateItem', () => {
  it('should combine the data and update item', async () => {
    const oldData = {
      id: 1,
      firstName: 'guy',
      middleName: 'person',
      lastName: 'friend',
      homePhone: 'someNumber',
    };

    const newData = {
      name: {
        first: 'guy',
        middle: 'person',
        last: 'newLastName'
      },
      phone:[{
        type: 'work',
        number: 'newWorkPhone'
      }],
    }

    const mockCollection = {
      findOne: () => oldData,
      update: () => {},
    };

    const update = updateItem(mockCollection);
    const actual = update(oldData.id, newData);
    const expected = {
      id: 1,
      name: {
        first: 'guy',
        middle: 'person',
        last: 'newLastName'
      },
      phone:[{
          type: 'home',
          number: 'someNumber'
      },
      {
        type: 'work',
        number: 'newWorkPhone'
      }],
      address: {}
    };

    expect(actual).toEqual(expected);
  });

  it('should throw Not Found if item does not exits', async () => {

    const mockCollection = {

      findOne: () => null,
    };

    const update = updateItem(mockCollection);

    expect(() => update('someId', {})).toThrow(NotFoundError);
  });
});

describe('deleteItemById', () => {
  it('should delete item and return id', async () => {

    const mockCollection = {      
      findOne: () => ({id: 1}),
      remove: () => {}
    };

    const deleteItem = deleteItemById(mockCollection);
    const actual = deleteItem(1);

    expect(actual).toEqual(1);
  });
});
describe('getCallListItems', () => {
  it('should get all items and transform into call list format', async () => {
    const mockCollection = {
      where: () => multiDummyData,
    };

    const getCallList = getCallListItems(mockCollection);
    const actual = getCallList();

    const expected = [{
      name: {
          first: 'guy',
          middle: 'person',
          last: 'friend'
      },
      phone: 'someNumber'
    }, {
      name: {
          first: 'fella',
          middle: 'buddy',
          last: 'chief'
      },
      phone: 'another'
    }];

    expect(actual).toEqual(expected);
  });
});

});