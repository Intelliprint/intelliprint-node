import {parseIntelliprintError, IntelliprintError} from '../util/errors.js'



/**
 * Mailing list methods for the Intelliprint API.
 * @param {Intelliprint} client - The Intelliprint client.
 * @returns {MailingLists} The MailingLists class.
 */
export default class MailingLists {

  //Assign the axios client.
  constructor (client) {
    this.client = client
  }


  
  /**
     * Creates a new mailing list. Mailing lists are used to group recipients together for sending mailings to each of them.
     * @param {object} data - The data object for the mailing list.
     * @param {string} data.name - A friendly name for the mailing list.
     * @param {object[]} data.recipients - An optional array of recipients to add to the mailing list
     * @param {object} data.recipients[].address - The address object of the recipient.
     * @param {string} data.recipients[].address.name - The name of the recipient.
     * @param {string} data.recipients[].address.line - The complete address line for the recipient.
     * @param {string} data.recipients[].address.postcode - The postal code of the address.
     * @param {string} data.recipients[].address.country - The country code of the address. This is an [ISO 3166-1 alpha-2 country code](https://www.iban.com/country-codes). Example: `GB`.
     * @param {object} data.recipients[].variables - Any dynamic fields to use for the recipient (Example: {name: 'John Doe'}).
     * @returns {Promise<Object>} The response from the Intelliprint API.
     * @throws {IntelliprintError} If an error occurs.
     */
  async create(data) {
    try {
      const response = await this.client({
        method: 'POST',
        url: '/mailing_lists',
        data
      })
      return response.data
    }
    catch(e) {
      throw parseIntelliprintError(e)
    }
  }



  /**
     * Retrieves a mailing list by its ID.
     * @param {string} id - The ID of the mailing list to retrieve.
     * @returns {Promise<Object>} The response from the Intelliprint API.
     * @throws {IntelliprintError} If an error occurs.
     */
  async retrieve(id) {
    try {
      const response = await this.client({
        method: 'GET',
        url: `/mailing_lists/${id}`
      })
      return response.data
    }
    catch(e) {
      throw parseIntelliprintError(e)
    }
  }



  /**
     * Updates a mailing list by its ID.
     * @param {string} id - The ID of the mailing list to update.
     * @param {object} data - The data object for the mailing list.
     * @param {string} data.name - A friendly name for the mailing list.
     * @param {boolean} data.delete_old_recipients - Whether to delete all current recipients from the mailing list. Default is false.
     * @param {object[]} data.recipients - An optional array of new recipients to add to the mailing list.
     * @param {object} data.recipients[].address - The address object of the recipient.
     * @param {string} data.recipients[].address.name - The name of the recipient.
     * @param {string} data.recipients[].address.line - The complete address line for the recipient.
     * @param {string} data.recipients[].address.postcode - The postal code of the address.
     * @param {string} data.recipients[].address.country - The country code of the address. This is an [ISO 3166-1 alpha-2 country code](https://www.iban.com/country-codes). Example: `GB`.
     * @param {object} data.recipients[].variables - Any dynamic fields to use for the recipient (Example: {name: 'John Doe'}).
     * @returns {Promise<Object>} The response from the Intelliprint API.
     * @throws {IntelliprintError} If an error occurs.
     */
  async update(id, data) {
    try {
      const response = await this.client({
        method: 'POST',
        url: `/mailing_lists/${id}`,
        data
      })
      return response.data
    }
    catch(e) {
      throw parseIntelliprintError(e)
    }
  }



  /**
     * Deletes a mailing list by its ID.
     * @param {string} id - The ID of the mailing list to delete.
     * @returns {Promise<Object>} The response from the Intelliprint API.
     * @throws {IntelliprintError} If an error occurs.
     */
  async delete(id) {
    try {
      const response = await this.client({
        method: 'DELETE',
        url: `/mailing_lists/${id}`
      })
      return response.data
    }
    catch(e) {
      throw parseIntelliprintError(e)
    }
  }



  /**
     * Returns a list of all the available mailing lists.
     * @param {object} options - The options for the list operation.
     * @param {number} options.limit - The number of mailing lists to return. Default is 10. Minimum 1 and maximum 1000.
     * @param {number} options.skip - The number of mailing lists to skip (For pagination). Default is 0.
     * @param {string} options.sort_field - The field to sort the mailing lists by. Default is 'created'. Available options are 'created', 'name' and 'recipients'.
     * @param {string} options.sort_order - The order to sort the mailing lists by. Default is 'desc'. Available options are 'asc' and 'desc'.
     * @param {string[]} options.fields - A filtered down list of fields to return in the response. Default is all fields. Example: ['id', 'name'].
     * @returns {Promise<Object>} The response from the Intelliprint API.
     * @throws {IntelliprintError} If an error occurs.
     */
  async list(options) {
    try {
      const response = await this.client({
        method: 'GET',
        url: '/mailing_lists',
        params: options
      })
      return response.data
    }
    catch(e) {
      throw parseIntelliprintError(e)
    }
  }

}