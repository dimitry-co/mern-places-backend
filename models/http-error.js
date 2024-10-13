class HttpError extends Error {
  constructor(message, errorCode) {
    super(message); // Add the 'message' property of the error instance. super() calls the constructor of the parent 'Error' class and pass arg. message to it.
    this.code = errorCode; // Add a "code" property
  }
}

export default HttpError; // export the HttpError class
