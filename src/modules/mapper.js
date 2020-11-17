
/**
 * helper function to take the phone array given by the frontend model
 * and assigne them to the correct flattened objects in the database model.
 * If two of the same type are received, the latter gets assigned
 */
const extractPhoneNumbers = (phoneArray) => {
  if(phoneArray) {
    return phoneArray.reduce((acc, phoneObj) => {
      switch(phoneObj.type) {
        case 'home':
          return {...acc, homePhone: phoneObj.number};
        case 'work':
          return {...acc, workPhone: phoneObj.number};
        case 'mobile':
          return {...acc, mobilePhone: phoneObj.number};
        default:
          return acc;
      }
    }, {});
  }

  return {};
};

/**
 * helper function to pull phone params out of the database object
 * and use them to construct the phone type array used by the frontend
 * data model
 */

const compilePhoneArray = (dbObject) => {
  const phoneArray = [];
  if(dbObject.homePhone) {
    phoneArray.push({
      type: 'home',
      number: dbObject.homePhone,
    });
  }

  if(dbObject.mobilePhone) {
    phoneArray.push({
      type: 'mobile',
      number: dbObject.mobilePhone,
    });
  }

  if(dbObject.workPhone) {
    phoneArray.push({
      type: 'work',
      number: dbObject.workPhone,
    });
  }
  
  return phoneArray;
};

/**
 * maps an object returned from the frontend into the database
 * object form. These objects are what is stored in the database
 */

export const toDatabase = (feObject) => {
  const compiledPhones = extractPhoneNumbers(feObject.phone);
  /* jshint ignore:start */
  return {
    firstName: feObject.name?.first,
    middleName: feObject.name?.middle,
    lastName: feObject.name?.last,
    street: feObject.address?.street,
    city: feObject.address?.city,
    state: feObject.address?.state,
    zip: feObject.address?.zip,
    homePhone: compiledPhones.homePhone,
    workPhone: compiledPhones.workPhone,
    mobilePhone: compiledPhones.mobilePhone,
    email: feObject.email,
  }
  /* jshint ignore:end */
};

/**
 * maps an object returned from the database into the frontend
 * object form. These are returned on getById, get all, and update
 */
export const toFrontend = (dbObject) => ({
  id: dbObject.id,
  name: {
    first: dbObject.firstName,
    middle: dbObject.middleName,
    last: dbObject.lastName
  },
  address: {
    street: dbObject.street,
    city: dbObject.city,
    state: dbObject.state,
    zip: dbObject.zip,
  },
  phone: compilePhoneArray(dbObject),
  email: dbObject.email,
});

/**
 * maps an object returned from the database into the call list
 * object form. This is returned by getCallList
 */
export const toCallList = (dbObject) => ({
  name: {
    first: dbObject.firstName,
    middle: dbObject.middleName,
    last: dbObject.lastName
  },
  phone: dbObject.homePhone,
});