/**
 * This function handles errors thrown by axios and converts them into easily understandable Intelliprint errors.
 * @param {*} e - The exception thrown by axios. 
 */
export function parseIntelliprintError(e) {
  //Check if it is an axios error.
  if(!e.isAxiosError) return e

  //Check if we have a response.
  if(!e.response) return new IntelliprintNetworkError(`Unable to connect to the Intelliprint API: ${e.code || 'unknown'} (${e.message || 'No error message'})`, 'network_error', null, null, e)

  //Check for response errors.
  if(e.response?.data?.error) {
    const errorData = e.response.data.error
    if(errorData.type == 'invalid_request_error') return new IntelliprintInvalidRequestError(errorData.message, errorData.code, errorData.param, e.response.status, e)
    else if(errorData.type == 'authentication_error') return new IntelliprintAuthenticationError(errorData.message, errorData.code, errorData.param, e.response.status, e)
    else if(errorData.type == 'payment_error') return new IntelliprintPaymentError(errorData.message, errorData.code, errorData.param, e.response.status, e)
    else if(errorData.type == 'rate_limited') return new IntelliprintRateLimitedError(errorData.message, errorData.code, errorData.param, e.response.status, e)
    else if(errorData.type == 'internal_error') return new IntelliprintInternalError(errorData.message, errorData.code, errorData.param, e.response.status, e)
  }

  return e
}



/**
 * The base Intelliprint error class - This is the base class for all Intelliprint errors.
 * @param {string} message - The error message.
 * @param {string} code - The error code.
 * @param {string} param - The parameter that caused the error.
 * @param {number} status - The HTTP status code.
 * @param {string} type - The error type.
 * @returns {IntelliprintError} The Intelliprint error.
 */
export class IntelliprintError extends Error {
  constructor(message, code, param, status, type, e) {
    super(message)
    this.code = code
    this.param = param
    this.status = status
    this.type = type
    this.requestID = e?.response?.headers?.['request-id'] || undefined
    //this._raw = e
  }
}



/**
 * The Intelliprint network error class - This is triggered when a network error occurs. Please check your internet connection and try again.
 * @param {string} message - The error message.
 * @param {string} code - The error code.
 * @param {string} param - The parameter that caused the error.
 * @param {number} status - The HTTP status code.
 * @returns {IntelliprintNetworkError} The Intelliprint network error.
 */
export class IntelliprintNetworkError extends IntelliprintError {
  constructor (message, code, param, status, e) {
    super(message, code, param, status, 'network_error', e)
  }
}



/**
 * The Intelliprint invalid request error class - This is triggered when you've provided an invalid request. Please check your request body and try again.
 * @param {string} message - The error message.
 * @param {string} code - The error code.
 * @param {string} param - The parameter that caused the error.
 * @param {number} status - The HTTP status code.
 * @returns {IntelliprintInvalidRequestError} The Intelliprint invalid request error.
 */
export class IntelliprintInvalidRequestError extends IntelliprintError {
  constructor(message, code, param, status, e) {
    super(message, code, param, status, 'invalid_request_error', e)
  }
}



/**
 * The Intelliprint authentication error class - This is triggered when you haven't provided a valid API key. Please check your API key.
 * @param {string} message - The error message.
 * @param {string} code - The error code.
 * @param {string} param - The parameter that caused the error.
 * @param {number} status - The HTTP status code.
 * @returns {IntelliprintAuthenticationError} The Intelliprint authentication error.
 */
export class IntelliprintAuthenticationError extends IntelliprintError {
  constructor(message, code, param, status, e) {
    super(message, code, param, status, 'authentication_error', e)
  }
}



/**
 * The Intelliprint payment error class - This is triggered when you are unable to pay for a print job. Please add to your Intelliprint account balance, or contact support.
 * @param {string} message - The error message.
 * @param {string} code - The error code.
 * @param {string} param - The parameter that caused the error.
 * @param {number} status - The HTTP status code.
 * @returns {IntelliprintPaymentError} The Intelliprint payment error.
 */
export class IntelliprintPaymentError extends IntelliprintError {
  constructor(message, code, param, status, e) {
    super(message, code, param, status, 'payment_error', e)
  }
}



/**
 * The Intelliprint rate limited error class - This is triggered when you've made too many requests to the API. You should wait a minute or two and try again.
 * @param {string} message - The error message.
 * @param {string} code - The error code.
 * @param {string} param - The parameter that caused the error.
 * @param {number} status - The HTTP status code.
 * @returns {IntelliprintRateLimitedError} The Intelliprint rate limited error.
 */
export class IntelliprintRateLimitedError extends IntelliprintError {
  constructor(message, code, param, status, e) {
    super(message, code, param, status, 'rate_limited', e)
  }
}



/**
 * The Intelliprint internal error class - This is triggered when an error unrelated to your request occurs at Intelliprint's end.
 * @param {string} message - The error message.
 * @param {string} code - The error code.
 * @param {string} param - The parameter that caused the error.
 * @param {number} status - The HTTP status code.
 * @returns {IntelliprintInternalError} The Intelliprint internal error.
 */
export class IntelliprintInternalError extends IntelliprintError {
  constructor(message, code, param, status, e) {
    super(message, code, param, status, 'internal_error', e)
  }
}