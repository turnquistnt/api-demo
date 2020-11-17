import { handleError, InternalError, NotFoundError } from '../../../src/modules/custom-errors';

describe('Custom Errors', () => {
  describe('NotFoundError', () => {
    it('should create the error with the correct code and message', async () => {
      const id = 'someId';
      const error = new NotFoundError(id);
      expect(error.code).toEqual(404);
      expect(error.message).toEqual(`Entry ${id} not found`);
    });
  });

  describe('InternalError', () => {
    it('should create the error with the correct code and message', async () => {
      const error = new InternalError();
      expect(error.code).toEqual(500);
      expect(error.message).toEqual('Internal Service Error');
    });
  });

  describe('handleError', () => {
    it('should display correct code from error if it exists', async () => {
      const id = 'someId';
      const error = new NotFoundError(id);
      const errorResp = handleError(error);
      expect(errorResp.code).toEqual(404);
      expect(errorResp.message).toEqual(`Entry ${id} not found`);
    });

    it('should display default data if expected params are not present', async () => {
      const error = new Error();
      const errorResp = handleError(error);
      expect(errorResp.code).toEqual(500);
      expect(errorResp.message).toEqual('Internal Service Error');
    });
  });

});