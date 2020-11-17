import { NotFoundError } from './custom-errors.js';
import { toFrontend, toDatabase, toCallList } from './mapper.js';

// move to its own guy
const callListFilter = (contact) => {
  return contact.homePhone ? true : false;
};

export const getAllItems = (collection) => () => {
  const result = collection.find().map((item) => toFrontend(item));
  return result;
};

export const getItemById = (collection) => (id) => {
  const result = collection.findOne({id});
  if(!result) {
    throw new NotFoundError(id);
  }
  return toFrontend(result);
};

export const createItem = (collection) => (item) => {
  const dbEntry = toDatabase(item);
  collection.insert(dbEntry);
  return dbEntry.$loki;
};

export const updateItem = (collection) => (id, item) => {
  const oldData = collection.findOne({id});
  if(!oldData) {
    throw new NotFoundError(id);
  }
  const newData = toDatabase(item);

  const combined = {...oldData, ...newData};
  collection.update(combined);
  // not sure about this one
};

export const deleteItemById = (collection) => (id) => {
  collection.chain().find({id}).remove();
  return id;
};

export const getCallListItems = (collection) => () => {
  const results = collection.where(callListFilter).map((dbObj) => toCallList(dbObj));
  return results;
};
