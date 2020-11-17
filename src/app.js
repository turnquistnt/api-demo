import {
  getAllItems,
  getItemById,
  getCallListItems,
  createItem,
  updateItem,
  deleteItemById,
} from './modules/db-functions.js';

import express from 'express';
import Loki from 'lokijs';
import { handleError } from './modules/custom-errors.js';
var db = new Loki('AppDB');

// establishing collection
var contacts = db.addCollection('contacts', {
  unique: 'id'
});

contacts.on('insert', function(input) { input.id = input.$loki; });

// Setting up the functions to be used by the api endpoints
const getAll = getAllItems(contacts);
const getById = getItemById(contacts);
const getCallList = getCallListItems(contacts);
const create = createItem(contacts);
const update = updateItem(contacts);
const deleteById = deleteItemById(contacts);

// creating express app and exposing it to port 3000
const app = express();
const port = 3000;

// setting json in order to extract json body from request
app.use(express.json());

app.listen(port, () => {
  console.log(`Server Started:
  Available Entrypoints:
    GET     /contacts
    POST    /contacts
    PUT     /contacts/{id}
    GET     /contacts/{id}
    DELETE  /contacts/{id}
    GET     /contacts/call-list`);

  /* 
    get all contacts endpoint. When hit it will serve all contacts
    stored in the collection as an array
  */
  app.get('/contacts', (req, res) => {
    try {
      const retrieved = getAll();
      res.status(200).json(retrieved);
    } catch (e) {
      const errResp = handleError(e);
      res.status(errResp.code).send(errResp.message);
    }
  });

  /*
    create endpoint. Takes a json request body from client, transforms it,
    and deposits it into collection. returns message with id of item created
   */
  app.post('/contacts', (req, res) => {
    try {
      const itemId = create(req.body);
      res.status(201).json({ message: `Created Entry ${itemId}`});
    } catch (e) {
      const errResp = handleError(e);
      res.status(errResp.code).send(errResp.message);
    }
  });

  /*
    update endpoint. Receives an id and a full or partial json body
    from the client. The service will update the fields given while
    maintaining existing parameters. Returns the updated object back
    to the client
   */
  app.put('/contacts/:id', (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = update(id, req.body);
      res.status(200).json(result);
    } catch (e) {
      const errResp = handleError(e);
      res.status(errResp.code).send(errResp.message);
    }
  });

  /*
    call list endpoint. Searches the api for contacts that have a
    home phone set, transforms them into a call list object, and
    serves them back to the client as a json array
  */

  app.get('/contacts/call-list', (req, res) => {
    try {
      const result = getCallList();
      res.status(200).json(result);
    } catch (e) {
      const errResp = handleError(e);
      res.status(errResp.code).send(errResp.message);
    }
  });

  /*
    get by id endpoint. Receives and id in the form of a path param
    and serves the client back the document if it exists. If it
    does not, the client receives a 404
  */

  app.get('/contacts/:id', (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = getById(id);
      res.status(200).json(result);
    } catch (e) {
      const errResp = handleError(e);
      res.status(errResp.code).send(errResp.message);
    }
  });
  
  /*
    delete endpoint. Receives and id in the form of a path param
    and uses it to delete the entry with the matching id.
  */
  app.delete('/contacts/:id', (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const itemId = deleteById(id);
      res.status(204).send(`Delete for ${itemId} Received`);
    } catch (e) {
      const errResp = handleError(e);
      res.status(errResp.code).send(errResp.message);
    }
  });

  /*
    health check
  */

  app.get('/health', (req, res) => {
    res.status(200).send('ok');
  });
});
