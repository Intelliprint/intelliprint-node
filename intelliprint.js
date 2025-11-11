import axios from 'axios'
import axiosRetry from 'axios-retry'
import {readFileSync} from 'fs'
import {fileURLToPath} from 'url'
import {dirname, join} from 'path'

import Prints from './methods/prints.js'
import Backgrounds from './methods/backgrounds.js'
import MailingLists from './methods/mailing_lists.js'
import MailingListRecipients from './methods/mailing_list_recipients.js'

//Read the package.json file.
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const packageJSON = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf8'))



/**
 * The Intelliprint API client.
 * @param {string} apiKey - The Intelliprint API key.
 * @param {object} options - Any options for the Intelliprint API client.
 * @param {string} options.baseURL - The base URL for the Intelliprint API.
 * @param {number} options.timeout - A timeout for requests in milliseconds. Default is 60000 (1 minute).
 * @param {number} options.retries - The number of times to retry the request. Default is 3.
 * @param {function} options.retryDelay - The function to use to calculate the delay between retries. Default is axiosRetry.exponentialDelay.
 * @returns {Intelliprint} The Intelliprint API client.
 */
export default function Intelliprint(apiKey, options) {

  //Ensure this is called as a constructor.
  if(!(this instanceof Intelliprint)) return new Intelliprint(...arguments)

  //Setup axios.
  this.client = axios.create({
    baseURL: options?.baseURL || 'https://api.intelliprint.net/v1',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'User-Agent': `Intelliprint-Node/${packageJSON.version}`
    },
    timeout: options?.timeout || 60000 //1 minute timeout by default.
  })

  //Setup axios-retry to retry idempotent requests.
  axiosRetry(this.client, {
    retries: options?.retries || 3,
    retryDelay: options?.retryDelay || axiosRetry.exponentialDelay,
    shouldResetTimeout: true
  })



  //Assign the methods.
  this.prints = new Prints(this.client)
  this.backgrounds = new Backgrounds(this.client)
  this.mailing_lists = new MailingLists(this.client)
  this.mailing_list_recipients = new MailingListRecipients(this.client)
}
export {Intelliprint}



//Export errors so they can be checked against by users.
import {IntelliprintError, IntelliprintNetworkError, IntelliprintInvalidRequestError, IntelliprintAuthenticationError, IntelliprintPaymentError, IntelliprintRateLimitedError, IntelliprintInternalError} from './util/errors.js'
export {IntelliprintError, IntelliprintNetworkError, IntelliprintInvalidRequestError, IntelliprintAuthenticationError, IntelliprintPaymentError, IntelliprintRateLimitedError, IntelliprintInternalError}