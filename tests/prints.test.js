//Tests all the prints endpoints.
import {expect, test} from 'bun:test'



test('Ensuring all methods are present', async () => {

  //Initialize the Intelliprint client.
  const {default: Intelliprint} = await import('../intelliprint.js')
  const ip = Intelliprint(process.env.INTELLIPRINT_API_KEY)

  //Import the class.
  const {default: Prints} = await import('../methods/prints.js')
  expect(Prints).toBeDefined()

  //Ensure the methods are assigned correctly.
  expect(ip.prints).toBeDefined()
  expect(ip.prints).toBeInstanceOf(Prints)
  expect(ip.prints.create).toBeDefined()
  expect(ip.prints.retrieve).toBeDefined()
  expect(ip.prints.update).toBeDefined()
  expect(ip.prints.delete).toBeDefined()
  expect(ip.prints.list).toBeDefined()
})



test('Testing CRUD methods (live)', async () => {

  //Initialize the Intelliprint client.
  const {default: Intelliprint} = await import('../intelliprint.js')
  const ip = Intelliprint(process.env.INTELLIPRINT_API_KEY)


  //Create a simple print job.
  const print = await ip.prints.create({
    content: 'Hello, World!',
    recipients: [
      {
        address: {
          name: 'John Doe',
          line: '123 Main St',
          postcode: 'AB1 2CD',
          country: 'GB'
        }
      }
    ],
    reference: 'Test Print',
  })

  //Ensure the print job was created correctly.
  expect(print).toBeDefined()
  expect(print.id).toBeDefined()
  expect(print.object).toBe('print')
  expect(print.reference).toBe('Test Print')
  expect(print.letters.length).toBe(1)
  expect(print.confirmed).toBe(false)
  expect(print.type).toBe('letter')
  expect(print.pages).toBe(1)
  expect(print.sheets).toBe(1)


  //Attempt updating the print job.
  const updated = await ip.prints.update(print.id, {
    reference: 'Updated Print',
  })
  expect(updated).toBeDefined()
  expect(updated.object).toBe('print')
  expect(updated.id).toBe(print.id)
  expect(updated.reference).toBe('Updated Print')


  //Attempt retrieving it again.
  const retrieved = await ip.prints.retrieve(print.id)
  expect(retrieved).toBeDefined()
  expect(retrieved.object).toBe('print')
  expect(retrieved.id).toBe(print.id)
  expect(retrieved.reference).toBe('Updated Print') //Ensure the change was persisted (More of an API test).


  //Attempt listing print jobs.
  const list = await ip.prints.list({limit: 1, sort_field: 'created', sort_order: 'desc'})
  expect(list).toBeDefined()
  expect(list.object).toBe('list')
  expect(list.data).toBeDefined()
  expect(list.data.length).toBe(1)
  expect(list.data[0].object).toBe('print')
  expect(list.data[0].id).toBe(print.id)
  expect(list.has_more).toBeDefined()


  //Attempt deleting the print job.
  const deleted = await ip.prints.delete(print.id)
  expect(deleted).toBeDefined()
  expect(deleted.object).toBe('print')
  expect(deleted.id).toBe(print.id)
  expect(deleted.deleted).toBe(true)
}, 60 * 1000)



test('Testing direct file upload', async () => {

  //Initialize the Intelliprint client.
  const {default: Intelliprint} = await import('../intelliprint.js')
  const ip = Intelliprint(process.env.INTELLIPRINT_API_KEY)


  //Create a file-upload based print job.
  const {createReadStream} = await import('fs')

  const print = await ip.prints.create({
    splitting: {
      method: 'split_on_phrase',
      phrase: 'Dear',
    },
    remove_letters: {
      with_phrase: 'EMAIL ONLY'
    },
    testmode: true,
    confirmed: true,
    file: createReadStream(import.meta.dirname + '/resources/multiple_letters.pdf'),
  })

  //Ensure the print job was created correctly.
  expect(print).toBeDefined()
  expect(print.id).toBeDefined()
  expect(print.object).toBe('print')
  expect(print.type).toBe('letter')
  expect(print.testmode).toBe(true)
  expect(print.confirmed).toBe(true)
  expect(print.splitting).toBeDefined()
  expect(print.splitting.method).toBe('split_on_phrase')
  expect(print.splitting.phrase).toBe('Dear')
  expect(print.remove_letters).toBeDefined()
  expect(print.remove_letters.with_phrase).toBe('EMAIL ONLY')
  expect(print.pages).toBe(267) //Based on the test file.
  expect(print.letters.length).toBe(96) //Based on the test file and splitting/removal settings.
}, 60 * 1000)