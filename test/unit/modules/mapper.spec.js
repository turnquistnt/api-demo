import { toDatabase, toFrontend, toCallList } from '../../../src/modules/mapper.js';

describe('Mappers', () => {
  describe('toDatabase', () => {
    it('should map an expected js object', async () => {
      const fullFe = {
        name: {
            first: 'guy',
            middle: 'person',
            last: 'friend'
        },
        phone:[{
            type: 'home',
            number: 'someNumber'
        },{
            type: 'mobile',
            number: 'otherNumber'
        },{
          type: 'work',
          number: 'lastNumber'
        }],
        address: {
          street: 'someStreet',
          city: 'someCity',
          state: 'someState',
          zip: 'someZip',
        },
        email: 'mail@email.com'
      };

      const expected = {
        firstName: 'guy',
        middleName: 'person',
        lastName: 'friend',
        street: 'someStreet',
        city: 'someCity',
        state: 'someState',
        zip: 'someZip',
        homePhone: 'someNumber',
        workPhone: 'lastNumber',
        mobilePhone: 'otherNumber',
        email: 'mail@email.com'
      };

      const actual = toDatabase(fullFe);
      expect(actual).toEqual(expected);
    });

    it('should ignore non valid phone types', async () => {
      const fullFe = {
        name: {
          first: 'guy',
          middle: 'person',
          last: 'friend'
      },
        phone:[{
            type: 'home',
            number: 'someNumber'
        },{
            type: 'beeper',
            number: 'otherNumber'
        }],
      };

      const expected = {
        firstName: 'guy',
        middleName: 'person',
        lastName: 'friend',
        homePhone: 'someNumber',
      };

      const actual = toDatabase(fullFe);
      expect(actual).toEqual(expected);
    });
  });


  describe('toFrontend', () => {
    it('should map an expected frontend object', async () => {
      const fullBe = {
        id: 1,
        firstName: 'guy',
        middleName: 'person',
        lastName: 'friend',
        street: 'someStreet',
        city: 'someCity',
        state: 'someState',
        zip: 'someZip',
        homePhone: 'someNumber',
        workPhone: 'lastNumber',
        mobilePhone: 'otherNumber',
        email: 'mail@email.com'
      };

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
        },{
            type: 'mobile',
            number: 'otherNumber'
        },{
          type: 'work',
          number: 'lastNumber'
        }],
        address: {
          street: 'someStreet',
          city: 'someCity',
          state: 'someState',
          zip: 'someZip',
        },
        email: 'mail@email.com'
      };


      const actual = toFrontend(fullBe);
      expect(actual).toEqual(expected);
    });
  });

  describe('toCallList', () => {
    it('should map an expected frontend object', async () => {
      const fullBe = {
        id: 1,
        firstName: 'guy',
        middleName: 'person',
        lastName: 'friend',
        homePhone: 'someNumber',
      };

      const expected = {
        name: {
            first: 'guy',
            middle: 'person',
            last: 'friend'
        },
        phone: 'someNumber'
      };


      const actual = toCallList(fullBe);
      expect(actual).toEqual(expected);
    });
  });
});