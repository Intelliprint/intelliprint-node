//Tests all the Intelliprint client initialization functionality.
import {expect, test} from 'bun:test'



test('Initializing the Intelliprint client', async () => {

  //Import the Intelliprint client.
  const {default: Intelliprint} = await import('../intelliprint.js')
  expect(Intelliprint).toBeDefined()

  //Initialize the Intelliprint client.
  const ip = Intelliprint('test_api_key', {baseURL: 'https://test.com', timeout: 10500})
  expect(ip).toBeInstanceOf(Intelliprint)

  //Ensure the client is initialized correctly with the correct options.
  expect(ip.client).toBeDefined()
  expect(ip.client.defaults.headers.Authorization).toBe('Bearer test_api_key')
  expect(ip.client.defaults.baseURL).toBe('https://test.com') //The custom set base URL.
  expect(ip.client.defaults.timeout).toBe(10500) //The custom set timeout.
})