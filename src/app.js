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

var contacts = db.addCollection('contacts', {
  unique: 'id'
});

contacts.on('insert', function(input) { input.id = input.$loki; });

const getAll = getAllItems(contacts);
const getById = getItemById(contacts);
const getCallList = getCallListItems(contacts);
const create = createItem(contacts);
const update = updateItem(contacts);
const deleteById = deleteItemById(contacts);

const app = express();
const port = 3000;

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

  app.get('/contacts', (req, res) => {
    try {
      const retrieved = getAll();
      res.status(200).json(retrieved);
    } catch (e) {
      const errResp = handleError(e);
      res.status(errResp.code).send(errResp.message);
    }
  });

  app.post('/contacts', (req, res) => {
    try {
      const itemId = create(req.body);
      res.status(201).send(`Created Entry ${itemId}`);
    } catch (e) {
      const errResp = handleError(e);
      res.status(errResp.code).send(errResp.message);
    }
  });

  app.put('/contacts/:id', (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = update(id, req.body);
      res.status(200).json(`Updated Entry ${result}`);
    } catch (e) {
      const errResp = handleError(e);
      res.status(errResp.code).send(errResp.message);
    }
  });

  app.get('/contacts/call-list', (req, res) => {
    try {
      const result = getCallList();
      res.status(200).json(result);
    } catch (e) {
      const errResp = handleError(e);
      res.status(errResp.code).send(errResp.message);
    }
  });

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
  

  app.delete('/contacts/:id', (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const itemId = deleteById(id);
      res.status(200).send(`Entry ${itemId} deleted successfully`);
    } catch (e) {
      const errResp = handleError(e);
      res.status(errResp.code).send(errResp.message);
    }
  });

  app.get('/health', (req, res) => {
    res.status(200).send('ok');
  });
});
