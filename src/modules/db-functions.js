import { NotFoundError } from './custom-errors.js';
import { toFrontend, toDatabase, toCallList } from './mapper.js';

/**
 * loki filter for finding call list candidates
 */
const callListFilter = (contact) => {
  return contact.homePhone ? true : false;
};

/**
 * helper function for cleaning undefined from a json object.
 * used to make the object assign in update easier
 */

const cleanObject = (obj) => {
  return Object.keys(obj).reduce((acc, key) => {
    const newAcc = acc;
    if (obj[key] !== undefined) {
      newAcc[key] = obj[key];
    }
    return newAcc;
  }, {});
};

/**
 * function to get all items from a collection. Afterwards it maps
 * all items received to the frontend data schema
 */

export const getAllItems = (collection) => () => {
  const result = collection.find().map((item) => toFrontend(item));
  return result;
};

/**
 * function to get item by id from a collection. Afterwards it maps
 * all items received to the frontend data schema
 */
export const getItemById = (collection) => (id) => {
  const result = collection.findOne({id});
  if(!result) {
    throw new NotFoundError(id);
  }
  return toFrontend(result);
};

/**
 * function to create an item in the collection. It first
 * takes the item received from the frontend and transforms
 * it into the database schema
 */
export const createItem = (collection) => (item) => {
  const dbEntry = toDatabase(item);
  const result = collection.insert(dbEntry);
  return result.id;
};

/**
 * function to update an item in the collection. If the
 * provided by the client does not match existing entries
 * than a not found error is thrown. The old data and the new
 * data received from the client are combined and fed back into
 * the collection. The updated object is then served back to the client
 */
export const updateItem = (collection) => (id, item) => {
  const oldData = collection.findOne({id});
  if(!oldData) {
    throw new NotFoundError(id);
  }
  const newData = cleanObject(toDatabase(item));

  const combined = {...oldData, ...newData};
  collection.update(combined);
  return toFrontend(combined);
};

/**
 * function to delete by id. First it attempts to find the object. If it
 * does not it returns a 404 to the client. If the object does exist however
 * it removes it from the collection
 */
export const deleteItemById = (collection) => (id) => {
  const obj = collection.findOne({id});
  if(!obj) {
    throw new NotFoundError(id);
  }
  collection.remove(obj);
  return id;
};

/**
 * get call list function. This uses the filter described above to filter
 * out entries that do not have a homePhone. It then takes all the entries it found
 * and maps them to the appropriate call list schema
 */
export const getCallListItems = (collection) => () => {
  const results = collection.where(callListFilter).map((dbObj) => toCallList(dbObj));
  return results;
};
