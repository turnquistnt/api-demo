export class NotFoundError extends Error {
  constructor(id) {
    super(`Entry ${id} not found`);
    this.name = 'NotFoundError';
    this.code = 404;
  }
}

export class InternalError extends Error {
  constructor() {
    super(`Internal Service Error`);
    this.name = 'InternalError';
    this.code = 500;
  }
}

export const handleError = (error) => {
  return {
    code: error.code || 500,
    message: error.message || 'Internal Service Error'
  };
};