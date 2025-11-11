import {parseIntelliprintError, IntelliprintError} from '../util/errors.js'



/**
 * Mailing list recipient methods for the Intelliprint API.
 * @param {Intelliprint} client - The Intelliprint client.
 * @returns {MailingListRecipients} The MailingListRecipients class.
 */
export default class MailingListRecipients {

  //Assign the axios client.
  constructor (client) {
    this.client = client
  }


  
  /**
     * Creates a single new mailing list recipient.
     * @param {string} mailing_list - The ID of the mailing list to add the recipient to.
     * @param {object} recipient - The recipient object to add to the mailing list.
     * @param {object} recipient.address - The address object of the recipient.
     * @param {string} recipient.address.name - The name of the recipient.
     * @param {string} recipient.address.line - The complete address line for the recipient.
     * @param {string} recipient.address.postal_code - The postal code of the address.
     * @param {string} recipient.address.country - The country of the address (Example: 'GB').
     * @param {object} recipient.variables - Any dynamic fields to use for the recipient (Example: {name_full: 'John C. Doe'}).
     * @returns {Promise<Object>} The response from the Intelliprint API.
     * @throws {IntelliprintError} If an error occurs.
     */
  async create(mailing_list, recipient) {
    try {
      const response = await this.client({
        method: 'POST',
        url: `/mailing_lists/${mailing_list}/recipients`,
        data: recipient
      })
      return response.data
    }
    catch(e) {
      throw parseIntelliprintError(e)
    }
  }



  /**
     * Retrieves a mailing list recipient by its ID.
     * @param {string} mailing_list - The ID of the mailing list to retrieve the recipient from.
     * @param {string} recipient_id - The ID of the recipient to retrieve.
     * @returns {Promise<Object>} The response from the Intelliprint API.
     * @throws {IntelliprintError} If an error occurs.
     */
  async retrieve(mailing_list, recipient_id) {
    try {
      const response = await this.client({
        method: 'GET',
        url: `/mailing_lists/${mailing_list}/recipients/${recipient_id}`
      })
      return response.data
    }
    catch(e) {
      throw parseIntelliprintError(e)
    }
  }



  /**
     * Updates a mailing list recipient by its ID.
     * @param {string} mailing_list - The ID of the mailing list to update the recipient in.
     * @param {string} recipient_id - The ID of the recipient to update.
     * @param {object} recipient - The recipient object to update.
     * @param {object} recipient.address - The address object of the recipient.
     * @param {string} recipient.address.name - The name of the recipient.
     * @param {string} recipient.address.line - The complete address line for the recipient.
     * @param {string} recipient.address.postal_code - The postal code of the address.
     * @param {string} recipient.address.country - The country of the address (Example: 'GB').
     * @param {object} recipient.variables - Any dynamic fields to use for the recipient (Example: {name_full: 'John C. Doe'}).
     * @returns {Promise<Object>} The response from the Intelliprint API.
     * @throws {IntelliprintError} If an error occurs.
     */
  async update(mailing_list, recipient_id, recipient) {
    try {
      const response = await this.client({
        method: 'POST',
        url: `/mailing_lists/${mailing_list}/recipients/${recipient_id}`,
        data: recipient
      })
      return response.data
    }
    catch(e) {
      throw parseIntelliprintError(e)
    }
  }



  /**
     * Deletes a mailing list recipient by its ID.
     * @param {string} mailing_list - The ID of the mailing list to delete the recipient from.
     * @param {string} recipient_id - The ID of the recipient to delete.
     * @returns {Promise<Object>} The response from the Intelliprint API.
     * @throws {IntelliprintError} If an error occurs.
     */
  async delete(mailing_list, recipient_id) {
    try {
      const response = await this.client({
        method: 'DELETE',
        url: `/mailing_lists/${mailing_list}/recipients/${recipient_id}`
      })
      return response.data
    }
    catch(e) {
      throw parseIntelliprintError(e)
    }
  }



  /**
     * Returns a list of all the available mailing list recipients.
     * @param {object} options - The options for the list operation.
     * @param {number} options.limit - The number of mailing list recipients to return. Default is 10. Minimum 1 and maximum 1000.
     * @param {number} options.skip - The number of mailing list recipients to skip (For pagination). Default is 0.
     * @param {string} options.sort_field - The field to sort the mailing list recipients by. Default is 'created'. Available options are 'created' and 'name'.
     * @param {string} options.sort_order - The order to sort the mailing list recipients by. Default is 'desc'. Available options are 'asc' and 'desc'.
     * @param {string[]} options.fields - A filtered down list of fields to return in the response. Default is all fields. Example: ['id', 'name', 'address.line'].
     * @returns {Promise<Object>} The response from the Intelliprint API.
     * @throws {IntelliprintError} If an error occurs.
     */
  async list(mailing_list, options) {
    try {
      const response = await this.client({
        method: 'GET',
        url: `/mailing_lists/${mailing_list}/recipients`,
        params: options
      })
      return response.data
    }
    catch(e) {
      throw parseIntelliprintError(e)
    }
  }

}