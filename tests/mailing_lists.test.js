//Tests all the backgrounds endpoints.
import {expect, test} from 'bun:test'



test('Ensuring all methods are present', async () => {

  //Initialize the Intelliprint client.
  const {default: Intelliprint} = await import('../intelliprint.js')
  const ip = Intelliprint(process.env.INTELLIPRINT_API_KEY)

  //Import the class.
  const {default: MailingLists} = await import('../methods/mailing_lists.js')
  expect(MailingLists).toBeDefined()

  //Ensure the methods are assigned correctly.
  expect(ip.mailing_lists).toBeDefined()
  expect(ip.mailing_lists).toBeInstanceOf(MailingLists)
  expect(ip.mailing_lists.create).toBeDefined()
  expect(ip.mailing_lists.retrieve).toBeDefined()
  expect(ip.mailing_lists.update).toBeDefined()
  expect(ip.mailing_lists.delete).toBeDefined()
  expect(ip.mailing_lists.list).toBeDefined()
})



test('Testing CRUD methods (live)', async () => {

  //Initialize the Intelliprint client.
  const {default: Intelliprint} = await import('../intelliprint.js')
  const ip = Intelliprint(process.env.INTELLIPRINT_API_KEY)


  //Create a mailing list.
  const ml = await ip.mailing_lists.create({
    name: 'Test Mailing List',
    recipients: [
      {
        address: {
          name: 'John Doe',
          line: '123 Main St',
          postcode: 'AB1 2CD',
          country: 'GB'
        },
        variables: {
          slangName: 'John Doe'
        }
      },
      {
        address: {
          name: 'Jane Doe',
          line: '456 Oak Ave',
          postcode: 'M1 1AA',
          country: 'GB'
        },
        variables: {
          slangName: 'Jane Doe'
        }
      }
    ]
  })

  //Ensure the mailing list was created correctly.
  expect(ml).toBeDefined()
  expect(ml.id).toBeDefined()
  expect(ml.object).toBe('mailing_list')
  expect(ml.account).toBeDefined()
  expect(ml.name).toBe('Test Mailing List')
  expect(ml.recipients).toBe(2)
  expect(ml.variables).toBeDefined()
  expect(ml.variables.length).toBe(1)


  //Attempt updating the mailing list.
  const updated = await ip.mailing_lists.update(ml.id, {
    name: 'Updated Mailing List',
    delete_old_recipients: true,
    recipients: [
      {
        address: {
          name: 'Last Doe',
          line: '789 Pine St',
          postcode: 'AB1 2CD',
          country: 'GB'
        },
        variables: {
          slangName: 'Last Doe'
        }
      }
    ]
  })
  expect(updated).toBeDefined()
  expect(updated.object).toBe('mailing_list')
  expect(updated.id).toBe(ml.id)
  expect(updated.name).toBe('Updated Mailing List')
  expect(updated.recipients).toBe(1)
  expect(updated.variables).toBeDefined()
  expect(updated.variables.length).toBe(1)

  //Attempt retrieving it again.
  const retrieved = await ip.mailing_lists.retrieve(ml.id)
  expect(retrieved).toBeDefined()
  expect(retrieved.object).toBe('mailing_list')
  expect(retrieved.id).toBe(ml.id)
  expect(retrieved.name).toBe('Updated Mailing List') //Ensure the change was persisted (More of an API test).

  //Attempt listing mailing lists.
  const list = await ip.mailing_lists.list({limit: 1, sort_field: 'created', sort_order: 'desc'})
  expect(list).toBeDefined()
  expect(list.object).toBe('list')
  expect(list.data).toBeDefined()
  expect(list.data.length).toBe(1)
  expect(list.data[0].object).toBe('mailing_list')
  expect(list.data[0].id).toBe(ml.id)
  expect(list.has_more).toBeDefined()


  //Attempt deleting the mailing list.
  const deleted = await ip.mailing_lists.delete(ml.id)
  expect(deleted).toBeDefined()
  expect(deleted.object).toBe('mailing_list')
  expect(deleted.id).toBe(ml.id)
  expect(deleted.deleted).toBe(true)
}, 60 * 1000)