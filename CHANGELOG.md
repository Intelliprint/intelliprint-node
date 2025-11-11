# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-04

### Added
- Initial release of the Intelliprint Node.js SDK
- Send letters and postcards via the Intelliprint API
- Manage mailing lists for batch sending
- Upload and manage backgrounds (letterheads, logos)
- Support for templates and custom backgrounds
- Automatic retry logic with exponential backoff for reliable delivery
- Comprehensive error handling with specific error classes:
  - `IntelliprintError` - Base error class
  - `IntelliprintAuthenticationError` - Invalid or missing API key
  - `IntelliprintInvalidRequestError` - Invalid request parameters
  - `IntelliprintPaymentError` - Payment or account balance issues
  - `IntelliprintRateLimitedError` - Rate limiting errors
  - `IntelliprintNetworkError` - Network connectivity issues
  - `IntelliprintInternalError` - Server-side errors
- Configurable client options (baseURL, timeout, retries, retryDelay)
- Support for multiple file upload methods (remote URL, file path, base64)
- Test mode support for integration testing without charges
- Full API coverage for print jobs, mailing lists, mailing list recipients, and backgrounds
- ESM (ES Module) support with modern JavaScript
- TypeScript-ready SDK structure