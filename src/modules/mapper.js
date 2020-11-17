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

const compilePhoneNumbers = (dbObject) => {
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
  phone: compilePhoneNumbers(dbObject),
  email: dbObject.email,
});

export const toCallList = (dbObject) => ({
  name: {
    first: dbObject.firstName,
    middle: dbObject.middleName,
    last: dbObject.lastName
  },
  phone: dbObject.homePhone,
});