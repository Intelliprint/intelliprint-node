import {parseIntelliprintError, IntelliprintError} from '../util/errors.js'



/**
 * Backgrounds methods for the Intelliprint API.
 * @param {Intelliprint} client - The Intelliprint client.
 * @returns {Backgrounds} The Backgrounds class.
 */
export default class Backgrounds {

  //Assign the axios client.
  constructor(client) {
    this.client = client
  }


  
  /**
     * Creates a new background. Backgrounds are used to apply frequently used designs and artwork to print jobs easily. This is useful for things like letterheads, logos, and other common designs.
     * @param {object} data - The data object for the background.
     * @param {string} data.name - A friendly name for the background.
     * @param {string} data.team - The team ID that the background is available to. Can be set to null to make the background available to everyone.
     * @param {File} data.file - (Required) The file to upload as the background. This can be a readable stream (Example: createReadStream('path/to/my/background.pdf')) or a Base64 encoded object (Example: {content: "BASE64_ENCODED_PDF", name: "Filename.pdf"}).
     * @returns {Promise<Object>} The response from the Intelliprint API.
     * @throws {IntelliprintError} If an error occurs.
     */
  async create(data) {
    try {
      const response = await this.client({
        method: 'POST',
        url: '/backgrounds',
        data,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    }
    catch(e) {
      throw parseIntelliprintError(e)
    }
  }



  /**
     * Retrieves a background by its ID.
     * @param {string} id - The ID of the background to retrieve.
     * @returns {Promise<Object>} The response from the Intelliprint API.
     * @throws {IntelliprintError} If an error occurs.
     */
  async retrieve(id) {
    try {
      const response = await this.client({
        method: 'GET',
        url: `/backgrounds/${id}`
      })
      return response.data
    }
    catch(e) {
      throw parseIntelliprintError(e)
    }
  }



  /**
     * Updates a background by its ID.
     * @param {string} id - The ID of the background to update.
     * @param {object} data - The data object for the background.
     * @param {string} data.name - A friendly name for the background.
     * @param {string} data.team - The team ID that the background is available to. Can be set to null to make the background available to everyone.
     * @returns {Promise<Object>} The response from the Intelliprint API.
     * @throws {IntelliprintError} If an error occurs.
     */
  async update(id, data) {
    try {
      const response = await this.client({
        method: 'POST',
        url: `/backgrounds/${id}`,
        data
      })
      return response.data
    }
    catch(e) {
      throw parseIntelliprintError(e)
    }
  }



  /**
     * Deletes a background by its ID.
     * @param {string} id - The ID of the background to delete.
     * @returns {Promise<Object>} The response from the Intelliprint API.
     * @throws {IntelliprintError} If an error occurs.
     */
  async delete(id) {
    try {
      const response = await this.client({
        method: 'DELETE',
        url: `/backgrounds/${id}`
      })
      return response.data
    }
    catch(e) {
      throw parseIntelliprintError(e)
    }
  }



  /**
     * Returns a list of all the available backgrounds.
     * @param {object} options - The options for the list operation.
     * @param {number} options.limit - The number of backgrounds to return. Default is 10. Minimum 1 and maximum 1000.
     * @param {number} options.skip - The number of backgrounds to skip (For pagination). Default is 0.
     * @param {string} options.sort_field - The field to sort the backgrounds by. Default is 'created'. Available options are 'created' and 'name'.
     * @param {string} options.sort_order - The order to sort the backgrounds by. Default is 'desc'. Available options are 'asc' and 'desc'.
     * @param {string[]} options.fields - A filtered down list of fields to return in the response. Default is all fields. Example: ['id', 'name', 'file.name'].
     * @param {string} options.team - Returns only backgrounds that are assigned to this team ID.
     * @returns {Promise<Object>} The response from the Intelliprint API.
     * @throws {IntelliprintError} If an error occurs.
     */
  async list(options) {
    try {
      const response = await this.client({
        method: 'GET',
        url: '/backgrounds',
        params: options
      })
      return response.data
    }
    catch(e) {
      throw parseIntelliprintError(e)
    }
  }

}