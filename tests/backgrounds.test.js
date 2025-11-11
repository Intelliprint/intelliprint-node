//Tests all the backgrounds endpoints.
import {expect, test} from 'bun:test'



test('Ensuring all methods are present', async () => {

  //Initialize the Intelliprint client.
  const {default: Intelliprint} = await import('../intelliprint.js')
  const ip = Intelliprint(process.env.INTELLIPRINT_API_KEY)

  //Import the class.
  const {default: Backgrounds} = await import('../methods/backgrounds.js')
  expect(Backgrounds).toBeDefined()

  //Ensure the methods are assigned correctly.
  expect(ip.backgrounds).toBeDefined()
  expect(ip.backgrounds).toBeInstanceOf(Backgrounds)
  expect(ip.backgrounds.create).toBeDefined()
  expect(ip.backgrounds.retrieve).toBeDefined()
  expect(ip.backgrounds.update).toBeDefined()
  expect(ip.backgrounds.delete).toBeDefined()
  expect(ip.backgrounds.list).toBeDefined()
})



test('Testing CRUD methods (live)', async () => {

  //Initialize the Intelliprint client.
  const {default: Intelliprint} = await import('../intelliprint.js')
  const ip = Intelliprint(process.env.INTELLIPRINT_API_KEY)
  

  //Create a background.
  const {createReadStream} = await import('fs')

  const bg = await ip.backgrounds.create({
    name: 'Test Background',
    file: createReadStream(import.meta.dirname + '/resources/bg.pdf')
  })

  //Ensure the background was created correctly.
  expect(bg).toBeDefined()
  expect(bg.id).toBeDefined()
  expect(bg.object).toBe('background')
  expect(bg.account).toBeDefined()
  expect(bg.name).toBe('Test Background')
  expect(bg.file).toBeDefined()
  expect(bg.file.name).toBe('bg.pdf')
  expect(bg.file.size).toBeGreaterThan(1000)
  expect(bg.team).toBeNull()
  expect(bg.pdf).toBeDefined()
  expect(bg.created).toBeGreaterThan(1762819200)


  //Attempt updating the name of the background.
  const updated = await ip.backgrounds.update(bg.id, {
    name: 'Updated Background'
  })
  expect(updated).toBeDefined()
  expect(updated.object).toBe('background')
  expect(updated.id).toBe(bg.id)
  expect(updated.name).toBe('Updated Background')


  //Attempt retrieving it again.
  const retrieved = await ip.backgrounds.retrieve(bg.id)
  expect(retrieved).toBeDefined()
  expect(retrieved.object).toBe('background')
  expect(retrieved.id).toBe(bg.id)
  expect(retrieved.name).toBe('Updated Background') //Ensure the change was persisted (More of an API test).


  //Attempt listing backgrounds.
  const list = await ip.backgrounds.list({limit: 1, sort_field: 'created', sort_order: 'desc'})
  expect(list).toBeDefined()
  expect(list.object).toBe('list')
  expect(list.data).toBeDefined()
  expect(list.data.length).toBe(1)
  expect(list.data[0].object).toBe('background')
  expect(list.data[0].id).toBe(bg.id)
  expect(list.has_more).toBeDefined()


  //Attempt deleting the saved background.
  const deleted = await ip.backgrounds.delete(bg.id)
  expect(deleted).toBeDefined()
  expect(deleted.object).toBe('background')
  expect(deleted.id).toBe(bg.id)
  expect(deleted.deleted).toBe(true)
}, 60 * 1000)