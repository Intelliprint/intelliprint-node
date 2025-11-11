//Tests all the backgrounds endpoints.
import {expect, test} from 'bun:test'



test('Ensuring all methods are present', async () => {

  //Initialize the Intelliprint client.
  const {default: Intelliprint} = await import('../intelliprint.js')
  const ip = Intelliprint(process.env.INTELLIPRINT_API_KEY)

  //Import the class.
  const {default: MailingListRecipients} = await import('../methods/mailing_list_recipients.js')
  expect(MailingListRecipients).toBeDefined()

  //Ensure the methods are assigned correctly.
  expect(ip.mailing_list_recipients).toBeDefined()
  expect(ip.mailing_list_recipients).toBeInstanceOf(MailingListRecipients)
  expect(ip.mailing_list_recipients.create).toBeDefined()
  expect(ip.mailing_list_recipients.retrieve).toBeDefined()
  expect(ip.mailing_list_recipients.update).toBeDefined()
  expect(ip.mailing_list_recipients.delete).toBeDefined()
  expect(ip.mailing_list_recipients.list).toBeDefined()
})



test('Testing CRUD methods (live)', async () => {

  //Initialize the Intelliprint client.
  const {default: Intelliprint} = await import('../intelliprint.js')
  const ip = Intelliprint(process.env.INTELLIPRINT_API_KEY)

  //Create a mailing list.
  const ml = await ip.mailing_lists.create({name: 'Test Mailing List'})

  //Create a mailing list recipient.
  const rcp = await ip.mailing_list_recipients.create(ml.id, {
    address: {
      name: 'John Doe',
      line: '123 Main St',
      postcode: 'AB1 2CD',
      country: 'GB'
    },
    variables: {
      slangName: 'John Doe'
    }
  })

  //Ensure the mailing list recipient was created correctly.
  expect(rcp).toBeDefined()
  expect(rcp.id).toBeDefined()
  expect(rcp.object).toBe('mailing_list_recipient')
  expect(rcp.mailing_list).toBe(ml.id)
  expect(rcp.account).toBeDefined()
  expect(rcp.address).toBeDefined()
  expect(rcp.address.name).toBe('John Doe')
  expect(rcp.address.line).toBe('123 Main St')
  expect(rcp.address.postcode).toBe('AB1 2CD')
  expect(rcp.address.country).toBe('GB')
  expect(rcp.variables).toBeDefined()
  expect(rcp.variables.slangName).toBe('John Doe')
  expect(rcp.created).toBeGreaterThan(1762819200)


  //Attempt updating the mailing list recipient.
  const updated = await ip.mailing_list_recipients.update(ml.id, rcp.id, {
    address: {
      name: 'Updated Doe',
    }
  })
  expect(updated).toBeDefined()
  expect(updated.object).toBe('mailing_list_recipient')
  expect(updated.id).toBe(rcp.id)
  expect(updated.address.name).toBe('Updated Doe')
  expect(updated.variables).toBeDefined()
  expect(updated.variables.slangName).toBe('John Doe')

  //Attempt retrieving it again.
  const retrieved = await ip.mailing_list_recipients.retrieve(ml.id, rcp.id)
  expect(retrieved).toBeDefined()
  expect(retrieved.object).toBe('mailing_list_recipient')
  expect(retrieved.id).toBe(rcp.id)
  expect(retrieved.address.name).toBe('Updated Doe')

  //Attempt listing mailing list recipients.
  const list = await ip.mailing_list_recipients.list(ml.id, {limit: 1, sort_field: 'created', sort_order: 'desc'})
  expect(list).toBeDefined()
  expect(list.object).toBe('list')
  expect(list.data).toBeDefined()
  expect(list.data.length).toBe(1) 
  expect(list.data[0].object).toBe('mailing_list_recipient')
  expect(list.data[0].id).toBe(rcp.id)
  expect(list.has_more).toBeDefined()


  //Attempt deleting the mailing list recipient.
  const deleted = await ip.mailing_list_recipients.delete(ml.id, rcp.id)
  expect(deleted).toBeDefined()
  expect(deleted.object).toBe('mailing_list_recipient')
  expect(deleted.id).toBe(rcp.id)
  expect(deleted.deleted).toBe(true)
}, 60 * 1000)