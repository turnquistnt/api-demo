import { toDatabase, toFrontend, toCallList } from '../../../src/modules/mapper.js';
import { getAllItems, getItemById } from '../../../src/modules/db-functions.js';
import {jest} from '@jest/globals';
import { NotFoundError } from '../../../src/modules/custom-errors.js';

describe('Database Functions', () => {
  describe('getAllItems', () => {
    it('should get all items', async () => {
      const dummyData = [{
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

      const mockCollection = {
        find: () => dummyData,
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
      const dummyData = {
        id: 1,
        firstName: 'guy',
        middleName: 'person',
        lastName: 'friend',
        homePhone: 'someNumber',
      };

      const mockCollection = {
        findOne: () => dummyData,
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

  // export const getItemById = (collection) => (id) => {
  //   const result = collection.findOne({id});
  //   if(!result) {
  //     throw new NotFoundError(id);
  //   }
  //   return toFrontend(result);
  // };

});