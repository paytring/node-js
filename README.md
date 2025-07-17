# Paytring Node.js SDK (ES Modules)

The official Node.js SDK for Paytring Payment Gateway with ES modules support. This SDK provides a modern, easy-to-use interface for integrating Paytring's payment services into your Node.js applications using `import` statements.

## 📦 Installation

```bash
npm install @paytring/nodejs-sdk
```

## 🛠️ Requirements

- Node.js >= 14.0.0
- Your project must support ES modules (see [Setup](#setup) below)

## ⚙️ Setup

### ES Modules Configuration

This SDK uses ES modules. Make sure your project is configured to support them:

**Option 1:** Add `"type": "module"` to your `package.json`:

```json
{
  "type": "module"
}
```

**Option 2:** Use `.mjs` file extension for your files.

## 🚀 Quick Start

```javascript
import Paytring from '@paytring/nodejs-sdk';

const paytring = new Paytring('YOUR_API_KEY', 'YOUR_API_SECRET');

// Create an order
const orderData = {
  amount: 100,
  key: 'YOUR_API_KEY',
  receipt_id: 'order_' + Date.now(),
  cname: 'John Doe',
  phone: 9876543210,
  email: 'john@example.com',
  callback_url: 'https://yoursite.com/payment/callback'
};

try {
  const order = await paytring.order.create(orderData);
  console.log('Order created:', order);
} catch (error) {
  console.error('Error creating order:', error.message);
}
```

## 📚 API Reference

### Initialize SDK

```javascript
import Paytring from '@paytring/nodejs-sdk';

const paytring = new Paytring(apiKey, apiSecret);
```

**Parameters:**
- `apiKey` (string): Your Paytring API key
- `apiSecret` (string): Your Paytring API secret

### Order Management

#### Create Order

```javascript
const orderData = {
  amount: 100,                    // Amount in INR
  key: 'YOUR_API_KEY',           // Your API key
  receipt_id: 'unique_receipt',   // Unique receipt identifier
  cname: 'Customer Name',         // Customer name
  phone: 9876543210,             // Customer phone number
  email: 'customer@email.com',    // Customer email
  callback_url: 'https://...'     // Payment callback URL
};

const order = await paytring.order.create(orderData);
```

**Response:**
```javascript
{
  status: true,
  data: {
    order_id: "order_xyz123",
    amount: 100,
    receipt_id: "unique_receipt",
    status: "created",
    created_at: "2024-01-01T10:00:00Z"
    // ... other order details
  }
}
```

#### Fetch Order

```javascript
const order = await paytring.order.fetch('order_xyz123');
```

#### Fetch Order (Advanced)

```javascript
const order = await paytring.order.fetchAdvance('order_xyz123');
```

### UPI Services

#### Validate UPI VPA

```javascript
const vpaResult = await paytring.upi.vpa.validate('customer@upi');
```

**Response:**
```javascript
{
  status: true,
  data: {
    valid: true,
    name: "Customer Name"
    // ... other VPA details
  }
}
```

### Hash Verification

```javascript
const hashData = {
  // Your hash verification data
};

const isValid = paytring.hash.verify(hashData);
console.log('Hash is valid:', isValid);
```

## 🔒 Security Best Practices

1. **Never expose your API secret** in client-side code
2. **Store credentials in environment variables**:

```javascript
import Paytring from '@paytring/nodejs-sdk';

const paytring = new Paytring(
  process.env.PAYTRING_API_KEY,
  process.env.PAYTRING_API_SECRET
);
```

3. **Validate webhooks** using hash verification
4. **Use HTTPS** for all callback URLs

## 🧪 Testing

Create a test file (e.g., `test.mjs`):

```javascript
import Paytring from '@paytring/nodejs-sdk';

const paytring = new Paytring('test_key', 'test_secret');

async function test() {
  try {
    // Test order creation
    const orderData = {
      amount: 100,
      key: 'test_key',
      receipt_id: 'test_' + Date.now(),
      cname: 'Test Customer',
      phone: 9876543210,
      email: 'test@example.com',
      callback_url: 'https://example.com/callback'
    };

    const order = await paytring.order.create(orderData);
    console.log('✅ Order created successfully:', order);

    // Test UPI validation
    const vpaResult = await paytring.upi.vpa.validate('test@upi');
    console.log('✅ UPI validation result:', vpaResult);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

test();
```

Run the test:
```bash
node test.mjs
```

## 🔄 Migration from CommonJS

If you're migrating from the CommonJS version (`commonjs-sdk`), here are the key changes:

### Before (CommonJS):
```javascript
const Paytring = require('commonjs-sdk');
```

### After (ES Modules):
```javascript
import Paytring from '@paytring/nodejs-sdk';
```

The API methods remain the same, only the import syntax changes.

## 📝 TypeScript Support

This SDK includes full TypeScript definitions. For TypeScript projects:

```typescript
import Paytring, { OrderData, PaytringResponse } from '@paytring/nodejs-sdk';

const paytring = new Paytring('api_key', 'api_secret');

const orderData: OrderData = {
  amount: 100,
  key: 'api_key',
  receipt_id: 'order_123',
  cname: 'John Doe',
  phone: 9876543210,
  email: 'john@example.com',
  callback_url: 'https://example.com/callback'
};

const order: PaytringResponse = await paytring.order.create(orderData);
```

## ⚠️ Error Handling

Always wrap SDK calls in try-catch blocks:

```javascript
try {
  const order = await paytring.order.create(orderData);
  // Handle success
} catch (error) {
  console.error('Payment error:', error.message);
  // Handle error appropriately
}
```

## 🌟 Examples

### Complete Payment Flow

```javascript
import Paytring from '@paytring/nodejs-sdk';

class PaymentService {
  constructor() {
    this.paytring = new Paytring(
      process.env.PAYTRING_API_KEY,
      process.env.PAYTRING_API_SECRET
    );
  }

  async createPayment(customerData, amount) {
    try {
      // Create order
      const orderData = {
        amount,
        key: process.env.PAYTRING_API_KEY,
        receipt_id: `order_${Date.now()}`,
        cname: customerData.name,
        phone: customerData.phone,
        email: customerData.email,
        callback_url: 'https://yoursite.com/payment/callback'
      };

      const order = await this.paytring.order.create(orderData);

      if (!order.status) {
        throw new Error('Order creation failed');
      }

      return {
        success: true,
        orderId: order.data.order_id,
        paymentUrl: order.data.payment_url
      };

    } catch (error) {
      console.error('Payment creation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async verifyPayment(orderId) {
    try {
      const order = await this.paytring.order.fetch(orderId);
      return order.data;
    } catch (error) {
      console.error('Payment verification failed:', error);
      throw error;
    }
  }
}

export default PaymentService;
```

## 🆚 CommonJS vs ES Modules

| Feature | CommonJS (`commonjs-sdk`) | ES Modules (this SDK) |
|---------|-------------------------|----------------------|
| Import Syntax | `require()` | `import` |
| File Extension | `.js` | `.js` or `.mjs` |
| Top-level await | ❌ | ✅ |
| Tree Shaking | Limited | ✅ Full Support |
| Modern Standards | ❌ | ✅ |
| Package.json | No `"type"` field | `"type": "module"` |

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Paytring Website](https://paytring.com)
- [API Documentation](https://docs.paytring.com)
- [Support](https://paytring.com/support)
- [GitHub Issues](https://github.com/paytring/nodejs-sdk/issues)

## 📞 Support

If you encounter any issues or need help:

1. Check our [FAQ](https://docs.paytring.com/faq)
2. Search [existing issues](https://github.com/paytring/nodejs-sdk/issues)
3. Create a [new issue](https://github.com/paytring/nodejs-sdk/issues/new)
4. Contact [support@paytring.com](mailto:support@paytring.com)

---

**Note:** This SDK requires ES modules support. If you need CommonJS support, use our [`commonjs-sdk`](https://www.npmjs.com/package/commonjs-sdk) package instead.
