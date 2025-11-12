# Intelliprint Node.js SDK

Send mail as easily as sending email.

The official Node.js SDK for the Intelliprint API, allowing you to send letters, postcards, and manage mailing lists programmatically.


Documentation and examples are available at [Intelliprint Docs](https://docs.intelliprint.net/api)

## Features

- 📮 Send letters and postcards
- 📋 Manage mailing lists
- 🎨 Upload and manage backgrounds (letterheads, logos)
- 🔄 Automatic retry logic for reliable delivery
- ⚡ Built with modern JavaScript (ESM)

## Example

```javascript
import Intelliprint from 'intelliprint'

// Initialize the client
const ip = Intelliprint('your-api-key-here')

// Send a letter
const printJob = await ip.prints.create({

  content: 'Hello World!\nThis is a letter!',
  
  recipients: [{
    address: {
      name: 'John Doe',
      line: '123 Main Street, Anytown, Anyplace',
      postcode: 'AB1 2CD',
      country: 'GB'
    }
  }],
  
  confirmed: false //Set to 'true' when you're ready to start submitting mail for printing.
})

console.log('Print job created:', printJob.id)
```

## Installation

```bash
npm install intelliprint
```

**Requirements:**
- Node.js 16 or higher, or Bun 1.0 or higher
- An Intelliprint API key ([Get one here](https://account.intelliprint.net/api_keys))

## Basic Usage

### Sending a Letter

```javascript
const printJob = await ip.prints.create({
  type: 'letter',
  
  // A File object or a File Stream or a URL to a file.
  file: {url: 'https://example.com/letter.pdf'},
  
  // OR:
  template: 'INTELLIPRINT_TEMPLATE_ID',
  
  // OR: 
  content: 'The text/HTML content of your letter!',
  
  recipients: [{
    address: {
      name: 'Jane Smith',
      line: '456 Oak Avenue, Apt 2B, Manchester',
      postcode: 'M1 1AA',
      country: 'GB'
    },
    variables: {
      custom_salutation: 'Ms.'
    }
  }],
  postage: {
    service: 'uk_first_class',
    ideal_envelope: 'c5'
  },
  confirmed: true
})
```

### Sending a Postcard

```javascript
import {createReadStream} from 'fs'

const postcard = await ip.prints.create({
  type: 'postcard',
  
  // A File object or a File Stream or a URL to a file.
  file: createReadStream('path/to/my/two-page.pdf'),
  
  // OR:
  template: 'INTELLIPRINT_TEMPLATE_ID',
  
  //OR: 
  content: '<h1>Sale!</h1><p style="color: blue">Get your postcards for cheap</p>'
  
  recipients: [{
    address: {
      name: 'Bob Johnson',
      line: '789 Pine Road, Birmingham',
      postcode: 'B1 1AA',
      country: 'GB'
    }
  }],
  printing: {
    matt_finish: true
  },
  confirmed: true
})
```

## API Reference

### Print Jobs

Manage print jobs (letters and postcards).

```javascript
// Create a print job
await ip.prints.create(data)

// Retrieve a print job
await ip.prints.retrieve(id)

// Update a print job
await ip.prints.update(id, data)

// Delete/cancel a print job
await ip.prints.delete(id)

// List all print jobs
await ip.prints.list(options)
```

### Mailing Lists

Manage mailing lists for batch sending.

```javascript
// Create a mailing list
await ip.mailing_lists.create(data)

// Retrieve a mailing list
await ip.mailing_lists.retrieve(id)

// Update a mailing list
await ip.mailing_lists.update(id, data)

// Delete a mailing list
await ip.mailing_lists.delete(id)

// List all mailing lists
await ip.mailing_lists.list(options)
```

### Mailing List Recipients

Manage mailing list recipients.

```javascript
// Create a single mailing list recipient
await ip.mailing_list_recipients.create(mailing_list, recipient)

// Retrieve a single mailing list recipient
await ip.mailing_list_recipients.retrieve(mailing_list, recipient_id)

// Update a single mailing list recipient
await ip.mailing_list_recipients.update(mailing_list, recipient_id, recipient)

// Delete a single mailing list recipient
await ip.mailing_list_recipients.delete(mailing_list, recipient_id)

// List all mailing list recipients in a mailing list
await ip.mailing_list_recipients.list(mailing_list, options)
```

### Backgrounds

Manage backgrounds (letterheads, logos) for print jobs.

```javascript
// Create a background
await ip.backgrounds.create(data)

// Retrieve a background
await ip.backgrounds.retrieve(id)

// Update a background
await ip.backgrounds.update(id, data)

// Delete a background
await ip.backgrounds.delete(id)

// List all backgrounds
await ip.backgrounds.list(options)
```

## Error Handling

The SDK provides specific error classes for different error types:

```javascript
import Intelliprint, {
  IntelliprintError,
  IntelliprintAuthenticationError,
  IntelliprintInvalidRequestError,
  IntelliprintPaymentError,
  IntelliprintRateLimitedError,
  IntelliprintNetworkError
} from 'intelliprint'

try {
  const printJob = await ip.prints.create({...})
} catch (error) {
  if (error instanceof IntelliprintAuthenticationError) {
    console.error('Invalid API key. Please check your credentials.')
  } else if (error instanceof IntelliprintInvalidRequestError) {
    console.error('Invalid request:', error.message)
    console.error('Parameter:', error.param)
  } else if (error instanceof IntelliprintPaymentError) {
    console.error('Payment issue. Please add funds to your account.')
  } else if (error instanceof IntelliprintRateLimitedError) {
    console.error('Rate limited. Please wait a moment and try again.')
  } else if (error instanceof IntelliprintNetworkError) {
    console.error('Network error. Please check your connection.')
  } else if (error instanceof IntelliprintError) {
    console.error('API error:', error.message)
  } else {
    console.error('Unexpected error:', error)
  }
}
```

### Error Types

- `IntelliprintError` - Base error class for all Intelliprint errors
- `IntelliprintAuthenticationError` - Invalid or missing API key
- `IntelliprintInvalidRequestError` - Invalid request parameters
- `IntelliprintPaymentError` - Payment or account balance issue
- `IntelliprintRateLimitedError` - Too many requests (rate limiting)
- `IntelliprintNetworkError` - Network connectivity issues
- `IntelliprintInternalError` - Server-side error at Intelliprint

## Configuration

You can customize the client with options:

```javascript
const ip = Intelliprint('your-api-key', {
  baseURL: 'https://api.intelliprint.net/v1', // Default
  timeout: 60000, // 1 minute in milliseconds
  retries: 3, // Number of retry attempts
  retryDelay: axiosRetry.exponentialDelay // Retry delay function
})
```

### Configuration Options

- `baseURL` (string) - API base URL (default: `'https://api.intelliprint.net/v1'`)
- `timeout` (number) - Request timeout in milliseconds (default: `60000`)
- `retries` (number) - Number of retry attempts for failed requests (default: `3`)
- `retryDelay` (function) - Function to calculate delay between retries (default: exponential backoff)

## Test Mode

Use test mode to verify your integration without actually sending mail:

```javascript
const printJob = await ip.prints.create({
  testmode: true, // No charges, no actual mail sent
  type: 'letter',
  file: 'https://example.com/letter.pdf',
  mailing_list: 'INTELLIPRINT_MAILING_LIST_ID',
  confirmed: true
})
```

## Common Use Cases

### Batch Sending with Multiple Recipients

```javascript
const printJob = await ip.prints.create({
  type: 'letter',
  file: 'https://example.com/letter.pdf',
  recipients: [
    { address: { name: 'Person 1', line: 'Address 1', postcode: 'POST', country: 'GB' } },
    { address: { name: 'Person 2', line: 'Address 2', postcode: 'POST', country: 'GB' } },
    { address: { name: 'Person 3', line: 'Address 3', postcode: 'POST', country: 'GB' } }
  ],
  confirmed: true
})
```

### Scheduled Sending

```javascript
const printJob = await ip.prints.create({
  type: 'letter',
  file: 'https://example.com/letter.pdf',
  recipients: [...],
  postage: {
    mail_date: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // UNIX epoch timestamp, 7 days from now
  },
  confirmed: true
})
```

### Tracking Print Job Status

```javascript
// Retrieve a print job to check its status
const printJob = await ip.prints.retrieve('print-job-id')

console.log('Letter statuses:', printJob.letters.map(letter => letter.status))
```

## Requirements

- Node.js 16 or higher
- Valid Intelliprint API key

## Support

- 📚 [Full API Documentation](https://docs.intelliprint.net/api)
- 🐛 [Report Issues](https://github.com/Intelliprint/intelliprint-node/issues)
- 💬 [Contact Support](mailto:hello@intelliprint.net)
- 🌐 [Website](https://intelliprint.net)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and version history.

---

Made with ❤️ by [Intelliprint](https://intelliprint.net). Thank you for reading!