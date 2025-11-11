//Tests all the error handling functionality.
import {expect, test} from 'bun:test'



test('Ensuring all errors are defined', async () => {

  //Import the errors.
  const {IntelliprintError, IntelliprintInvalidRequestError, IntelliprintAuthenticationError, IntelliprintPaymentError, IntelliprintRateLimitedError, IntelliprintNetworkError, IntelliprintInternalError} = await import('../intelliprint.js')

  //Ensure all the errors are defined.
  expect(IntelliprintError).toBeDefined()
  expect(IntelliprintInvalidRequestError).toBeDefined()
  expect(IntelliprintAuthenticationError).toBeDefined()
  expect(IntelliprintPaymentError).toBeDefined()
  expect(IntelliprintRateLimitedError).toBeDefined()
  expect(IntelliprintNetworkError).toBeDefined()
  expect(IntelliprintInternalError).toBeDefined()
})



test('Ensuring error creation works', async () => {

  const {parseIntelliprintError, IntelliprintError, IntelliprintInvalidRequestError, IntelliprintAuthenticationError, IntelliprintPaymentError, IntelliprintRateLimitedError, IntelliprintInternalError, IntelliprintNetworkError} = await import('../util/errors.js')

  //Create an axios response-like error.
  const axiosResponse = {
    isAxiosError: true,
    response: {
      status: 400,
      headers: {
        'request-id': 'test_request_id'
      },
      data: {
        error: {
          message: 'Test error',
          code: 'test_code',
          param: 'test_param',
          type: 'invalid_request_error'
        }
      },
    }
  }

  //Parse to an Intelliprint error.
  const e = parseIntelliprintError(axiosResponse)
  
  expect(e).toBeInstanceOf(IntelliprintError)
  expect(e).toBeInstanceOf(IntelliprintInvalidRequestError)
  expect(e.message).toBe('Test error')
  expect(e.code).toBe('test_code')
  expect(e.param).toBe('test_param')
  expect(e.status).toBe(400)
  expect(e.type).toBe('invalid_request_error')
  expect(e.requestID).toBe('test_request_id')

  //Ensure other error types also work the same.
  axiosResponse.response.data.error.type = 'authentication_error'
  const e2 = parseIntelliprintError(axiosResponse)
  expect(e2).toBeInstanceOf(IntelliprintAuthenticationError)
  expect(e2.type).toBe('authentication_error')

  axiosResponse.response.data.error.type = 'payment_error'
  const e3 = parseIntelliprintError(axiosResponse)
  expect(e3).toBeInstanceOf(IntelliprintPaymentError)
  expect(e3.type).toBe('payment_error')

  axiosResponse.response.data.error.type = 'rate_limited'
  const e4 = parseIntelliprintError(axiosResponse)
  expect(e4).toBeInstanceOf(IntelliprintRateLimitedError)
  expect(e4.type).toBe('rate_limited')

  axiosResponse.response.data.error.type = 'internal_error'
  const e5 = parseIntelliprintError(axiosResponse)
  expect(e5).toBeInstanceOf(IntelliprintInternalError)
  expect(e5.type).toBe('internal_error')

  //Check that if an unknown error is passed through, .
  axiosResponse.response.data = 'An unknown error occured somewhere in the middle.'
  const e6 = parseIntelliprintError(axiosResponse)
  expect(e6).toBe(axiosResponse) //The same input is returned when an unrecognised error is sent.

  //Try an internal network error (When no response is available from axios).
  axiosResponse.response = undefined
  const e7 = parseIntelliprintError(axiosResponse)
  expect(e7).toBeInstanceOf(IntelliprintNetworkError)
  expect(e7.type).toBe('network_error')
})



test('Testing live API error handling', async () => {

  //Initialize the Intelliprint client.
  const {default: Intelliprint, IntelliprintInvalidRequestError} = await import('../intelliprint.js')
  const ip = Intelliprint(process.env.INTELLIPRINT_API_KEY, {baseURL: 'https://api.intelliprint.net/v0'}) //Incorrect base URL should throw a not_found error.

  //Ensure errors are defined.
  expect(IntelliprintInvalidRequestError).toBeDefined()

  //Make a call.
  try {
    await ip.prints.create()
    throw new Error('Expected an error but did not get one.')
  }
  catch(e) {
    expect(e).toBeInstanceOf(IntelliprintInvalidRequestError)
    expect(e.message).toBe('No such resource exists: POST /v0/prints')
    expect(e.type).toBe('invalid_request_error')
    expect(e.code).toBe('not_found')
    expect(e.param).toBeFalsy()
    expect(e.status).toBe(404)
    expect(e.requestID).toBeDefined()
  }
})