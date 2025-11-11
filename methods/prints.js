import {parseIntelliprintError, IntelliprintError} from '../util/errors.js'



/**
 * Print job methods for the Intelliprint API.
 * @param {Intelliprint} client - The Intelliprint client.
 * @returns {Prints} The Prints class.
 */
export default class Prints {

  //Assign the axios client.
  constructor(client) {
    this.client = client
  }


  
  /**
     * Creates a new print job. Print jobs can contain a single letter or many letters, or even postcards. Print jobs can be created from a file, text/HTML content, or a template, and sent out to an individual or thousands of recipients at once, personalized to each recipient.
     * @param {object} data - The data object for the print job.
     * @param {boolean} data.testmode - Whether to run the print job in test mode. Testmode print jobs are not charged for and are not actually sent out.
     * @param {string} data.type - The type of print job to create. Possible values are 'letter' and 'postcard'. Default is 'letter'.
     * @param {string} data.reference - A friendly description for the print job.
     * @param {any} data.file - The file to print. This can be a remote URL (Example: {url: 'https://example.com/my/letter.pdf'}), a readable stream (Example: createReadStream('path/to/my/letter.pdf')) or a Base64 encoded object (Example: {content: "BASE64_ENCODED_PDF", name: "Filename.pdf"}). If you are using a template or providing content, this is not required.
     * @param {string} data.content - Instead of a pre-generated file, you can provide text/HTML content to create the print job from.
     * @param {string} data.template - Instead of content or a file, you can provide the ID of a pre-designed template to use for the print job.
     * @param {string} data.mailing_list - The ID of a mailing list to send this print job to.
     * @param {object[]} data.recipients - Instead of a mailing list, you can provide a list of recipients to send this print job to.
     * @param {object} data.recipients[].address - The address object of the recipient.
     * @param {string} data.recipients[].address.name - The name of the recipient.
     * @param {string} data.recipients[].address.line - The complete address line for the recipient.
     * @param {string} data.recipients[].address.postcode - The postal code of the address.
     * @param {string} data.recipients[].address.country - The country code of the address. This is an [ISO 3166-1 alpha-2 country code](https://www.iban.com/country-codes). Example: `GB`.
     * @param {object} data.recipients[].variables - Any dynamic fields to use for the recipient (Example: {name: 'John Doe'}).
     * @param {boolean} data.confirmed - Whether to confirm the print job. Default is false. Once a print job is confirmed, it is submitted for printing and cannot be updated anymore.
     * @param {object} data.splitting - The splitting settings, generally used for print jobs where a single file contains multiple letters with pre-inserted addresses within it.
     * @param {string} data.splitting.method - The method to use to split the print job. Possible values are 'none', 'split_on_phrase' and 'split_on_pages'. Default is 'none'.
     * @param {string} data.splitting.phrase - The phrase to use to split the print job. Only used if data.splitting.method is 'split_on_phrase'.
     * @param {number} data.splitting.pages - The number of pages to split the print job into different letters at. Only used if data.splitting.method is 'split_on_pages'.
     * @param {object} data.printing - The printing settings.
     * @param {string} data.printing.double_sided - Whether to print the print job double sided. Possible values are 'no', 'yes' and 'mixed'. Default is 'no'.
     * @param {string} data.printing.double_sided_specific_pages - The specific page indexes to print double sided. Only used if data.printing.double_sided is 'mixed'.
     * @param {boolean} data.printing.premium_quality - Whether to print the print job in premium quality. Default is false.
     * @param {boolean} data.printing.black_and_white - Whether to print the print job in black and white. Default is false.
     * @param {boolean} data.printing.matt_finish - Whether to print the print job with a matt finish. Default is false. This is only available for postcards.
     * @param {object} data.postage - The postage settings.
     * @param {string} data.postage.service - The postage service to use for the print job.Available values are 'uk_second_class', 'uk_second_class_signed_for', 'uk_first_class', 'uk_first_class_signed_for', 'uk_special_delivery_9am', 'uk_special_delivery', 'international', 'tracked_24' or 'tracked_48'. Default is 'uk_second_class'.
     * @param {string} data.postage.ideal_envelope - The ideal envelope to use for the print job. Available values are 'c4', 'c5', 'c4_plus', 'a4_box' for letters, and 'postcard_a6', 'postcard_a5' or 'postcard_a5_enveloped' for postcards. Default is 'c5' for letters and 'postcard_a6' for postcards.
     * @param {number} data.postage.mail_date - Used to schedule the printing of the print job at a specific date in the future. This is a UNIX timestamp (day-adjusted).
     * @param {object} data.background - The background settings.
     * @param {string} data.background.first_page - A Background ID to apply on the first page of the print job. Usually a letterhead or logo. (Only available for letters).
     * @param {string} data.background.other_pages - A Background ID to apply on the other pages of the print job. Usually a continuation design or logo. (Only available for letters).
     * @param {boolean} data.confidential - Whether to print the print job as confidential. Default is false.
     * @param {object} data.extra_documents - Any extra documents to include in the print job.
     * @param {any} data.extra_documents.document - The document to include in the print job. This can be a readable stream (Example: createReadStream('path/to/my/extra/document.pdf')) or a Base64 encoded object (Example: {content: "BASE64_ENCODED_PDF", name: "Filename.pdf"}).
     * @param {boolean} data.extra_documents.apply_background - Whether to apply the background.other_pages to the extra document. Default is false.
     * @param {object} data.remove_letters - Settings to aid in removing some letters from the entire split print job.
     * @param {string} data.remove_letters.with_phrase - If provided, any letter in which this phrase is present will be removed from the print job (Example: "EMAIL ONLY").
     * @param {object} data.nudge - Settings to aid in nudging the address window to the right or left of the page.
     * @param {number} data.nudge.x - In mm. The horizontal distance to nudge the address window to the right.
     * @param {number} data.nudge.y - In mm. The vertical distance to nudge the address window down.
     * @param {boolean} data.confirmation_email - Whether to send a confirmation email to the account owner once the print job is confirmed. Default is false.
     * @param {object} data.metadata - An arbitrary object of any data you'd like to associate with this print job for your own usage (Example: {custom_id: "abc", uploaded_by: "John Doe"}).
     * @returns {Promise<Object>} The response from the Intelliprint API.
     * @throws {IntelliprintError} If an error occurs.
     */
  async create(data) {
    try {

      const response = await this.client({
        method: 'POST',
        url: '/prints',
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
    * Retrieves a print job by its ID.
    * @param {string} id - The ID of the print job to retrieve.
    * @returns {Promise<Object>} The response from the Intelliprint API.
    * @throws {IntelliprintError} If an error occurs.
    */
  async retrieve(id) {
    try {
      const response = await this.client({
        method: 'GET',
        url: `/prints/${id}`
      })
      return response.data
    }
    catch(e) {
      throw parseIntelliprintError(e)
    }
  }



  /**
     * Updates a print job by its ID.
     * @param {string} id - The ID of the print job to update.
     * @param {object} data - The data object for the print job.
     * @param {boolean} data.testmode - Whether to run the print job in test mode. Testmode print jobs are not charged for and are not actually sent out.
     * @param {string} data.reference - A friendly description for the print job.
     * @param {boolean} data.confirmed - Whether to confirm the print job. Default is false. Once a print job is confirmed, it is submitted for printing and cannot be updated anymore.
     * @param {object} data.splitting - The splitting settings, generally used for print jobs where a single file contains multiple letters with pre-inserted addresses within it.
     * @param {string} data.splitting.method - The method to use to split the print job. Possible values are 'none', 'split_on_phrase' and 'split_on_pages'. Default is 'none'.
     * @param {string} data.splitting.phrase - The phrase to use to split the print job. Only used if data.splitting.method is 'split_on_phrase'.
     * @param {number} data.splitting.pages - The number of pages to split the print job into different letters at. Only used if data.splitting.method is 'split_on_pages'.
     * @param {object} data.printing - The printing settings.
     * @param {string} data.printing.double_sided - Whether to print the print job double sided. Possible values are 'no', 'yes' and 'mixed'. Default is 'no'.
     * @param {string} data.printing.double_sided_specific_pages - The specific page indexes to print double sided. Only used if data.printing.double_sided is 'mixed'.
     * @param {boolean} data.printing.premium_quality - Whether to print the print job in premium quality. Default is false.
     * @param {boolean} data.printing.black_and_white - Whether to print the print job in black and white. Default is false.
     * @param {boolean} data.printing.matt_finish - Whether to print the print job with a matt finish. Default is false. This is only available for postcards.
     * @param {object} data.postage - The postage settings.
     * @param {string} data.postage.service - The postage service to use for the print job.Available values are 'uk_second_class', 'uk_second_class_signed_for', 'uk_first_class', 'uk_first_class_signed_for', 'uk_special_delivery_9am', 'uk_special_delivery', 'international', 'tracked_24' or 'tracked_48'. Default is 'uk_second_class'.
     * @param {string} data.postage.ideal_envelope - The ideal envelope to use for the print job. Available values are 'c4', 'c5', 'c4_plus', 'a4_box' for letters, and 'postcard_a6', 'postcard_a5' or 'postcard_a5_enveloped' for postcards. Default is 'c5' for letters and 'postcard_a6' for postcards.
     * @param {number} data.postage.mail_date - Used to schedule the printing of the print job at a specific date in the future. This is a UNIX timestamp (day-adjusted).
     * @param {object} data.background - The background settings.
     * @param {string} data.background.first_page - A Background ID to apply on the first page of the print job. Usually a letterhead or logo. (Only available for letters).
     * @param {string} data.background.other_pages - A Background ID to apply on the other pages of the print job. Usually a continuation design or logo. (Only available for letters).
     * @param {boolean} data.confidential - Whether to print the print job as confidential. Default is false.
     * @param {object} data.extra_documents - Any extra documents to include in the print job.
     * @param {any} data.extra_documents.document - The document to include in the print job. This can be a readable stream (Example: createReadStream('path/to/my/extra/document.pdf')) or a Base64 encoded object (Example: {content: "BASE64_ENCODED_PDF", name: "Filename.pdf"}).
     * @param {boolean} data.extra_documents.apply_background - Whether to apply the background.other_pages to the extra document. Default is false.
     * @param {object} data.remove_letters - Settings to aid in removing some letters from the entire split print job.
     * @param {string} data.remove_letters.with_phrase - If provided, any letter in which this phrase is present will be removed from the print job (Example: "EMAIL ONLY").
     * @param {object} data.nudge - Settings to aid in nudging the address window to the right or left of the page.
     * @param {number} data.nudge.x - In mm. The horizontal distance to nudge the address window to the right.
     * @param {number} data.nudge.y - In mm. The vertical distance to nudge the address window down.
     * @param {boolean} data.confirmation_email - Whether to send a confirmation email to the account owner once the print job is confirmed. Default is false.
     * @param {object} data.metadata - An arbitrary object of any data you'd like to associate with this print job for your own usage (Example: {custom_id: "abc", uploaded_by: "John Doe"}).
     * @returns {Promise<Object>} The response from the Intelliprint API.
     * @throws {IntelliprintError} If an error occurs.
     */
  async update(id, data) {
    try {
      const response = await this.client({
        method: 'POST',
        url: `/prints/${id}`,
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
     * Attempts to cancel a confirmed print job, or deletes an unconfirmed print job.
     * @param {string} id - The ID of the print job to cancel or delete.
     * @returns {Promise<Object>} The response from the Intelliprint API.
     * @throws {IntelliprintError} If an error occurs.
     */
  async delete(id) {
    try {
      const response = await this.client({
        method: 'DELETE',
        url: `/prints/${id}`
      })
      return response.data
    }
    catch(e) {
      throw parseIntelliprintError(e)
    }
  }



  /**
     * Returns a list of all the available print jobs.
     * @param {object} options - The options for the list operation.
     * @param {number} options.limit - The number of print jobs to return. Default is 10. Minimum 1 and maximum 1000.
     * @param {number} options.skip - The number of print jobs to skip (For pagination). Default is 0.
     * @param {string} options.sort_field - The field to sort the print jobs by. Default is 'created'. Available options are 'created', 'mail_date', 'cost.amount', 'cost.after_tax', 'letters.returned.date', 'pages', 'sheets', 'letters', 'reference', 'type', 'confirmed_at'.
     * @param {string} options.sort_order - The order to sort the print jobs by. Default is 'desc'. Available options are 'asc' and 'desc'.
     * @param {string[]} options.fields - A filtered down list of fields to return in the response. Default is all fields. Example: ['id', 'reference', 'letters.status'].
     * @param {boolean} options.testmode - Whether to return testmode print jobs or live print jobs. Default is false - Only return live print jobs.
     * @param {boolean} options.confirmed - Whether to return only confirmed (true) or non-confirmed (false) print jobs. By default, both kinds are returned.
     * @param {string} options.letters.status - Returns only print jobs in which at least one letter has this status. Multiple values are possible by separating them with a comma. Example: 'waiting_to_print,printing'.
     * @param {string} options.reference - Returns only print jobs with this reference set (Exact match).
     * @param {string} options.type - Returns only print jobs of this type. Available options are 'letter' and 'postcard'.
     * @returns {Promise<Object>} The response from the Intelliprint API.
     * @throws {IntelliprintError} If an error occurs.
     */
  async list(options) {
    try {
      const response = await this.client({
        method: 'GET',
        url: '/prints',
        params: options
      })
      return response.data
    }
    catch(e) {
      throw parseIntelliprintError(e)
    }
  }

}