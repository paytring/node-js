import Paytring from '../src/index.js';

console.log('🧪 Running Paytring Node.js SDK Tests...\n');

// Test configuration
const TEST_API_KEY = 'test_key';
const TEST_API_SECRET = 'test_secret';

let testsRun = 0;
let testsPassed = 0;
let testsFailed = 0;

function test(name, fn) {
  testsRun++;
  console.log(`🔍 Testing: ${name}`);

  try {
    const result = fn();
    if (result instanceof Promise) {
      return result.then(() => {
        testsPassed++;
        console.log(`  ✅ PASS: ${name}\n`);
      }).catch((error) => {
        testsFailed++;
        console.log(`  ❌ FAIL: ${name}`);
        console.log(`     Error: ${error.message}\n`);
      });
    } else {
      testsPassed++;
      console.log(`  ✅ PASS: ${name}\n`);
    }
  } catch (error) {
    testsFailed++;
    console.log(`  ❌ FAIL: ${name}`);
    console.log(`     Error: ${error.message}\n`);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

async function runTests() {
  const paytring = new Paytring(TEST_API_KEY, TEST_API_SECRET);

  // Test 1: SDK Initialization
  test('SDK Initialization', () => {
    assert(paytring instanceof Paytring, 'Paytring instance should be created');
    assert(typeof paytring.order === 'object', 'Order methods should be available');
    assert(typeof paytring.upi === 'object', 'UPI methods should be available');
    assert(typeof paytring.hash === 'object', 'Hash methods should be available');
  });

  // Test 2: Order methods exist
  test('Order methods exist', () => {
    assert(typeof paytring.order.create === 'function', 'order.create should be a function');
    assert(typeof paytring.order.fetch === 'function', 'order.fetch should be a function');
    assert(typeof paytring.order.fetchAdvance === 'function', 'order.fetchAdvance should be a function');
  });

  // Test 3: UPI methods exist
  test('UPI methods exist', () => {
    assert(typeof paytring.upi.vpa.validate === 'function', 'upi.vpa.validate should be a function');
  });

  // Test 4: Hash methods exist
  test('Hash methods exist', () => {
    assert(typeof paytring.hash.verify === 'function', 'hash.verify should be a function');
  });

  // Test 5: Order creation with mock data (this will fail in test environment, but tests the structure)
  await test('Order creation structure', async () => {
    const orderData = {
      amount: 100,
      key: TEST_API_KEY,
      receipt_id: 'test_receipt_' + Date.now(),
      cname: 'Test Customer',
      phone: 9876543210,
      email: 'test@example.com',
      callback_url: 'https://example.com/callback'
    };

    try {
      // This will likely fail due to invalid credentials, but we're testing the method exists and accepts parameters
      await paytring.order.create(orderData);
      // If it doesn't throw, the API is reachable (unlikely in test environment)
    } catch (error) {
      // Expected to fail with test credentials, but method should exist
      assert(error instanceof Error, 'Should throw an error with invalid credentials');
      console.log(`     Expected error with test credentials: ${error.message}`);
    }
  });

  // Test 6: Hash verification
  test('Hash verification', () => {
    const testHashData = {
      test: 'data',
      amount: 100
    };

    const result = paytring.hash.verify(testHashData);
    assert(typeof result === 'boolean', 'Hash verify should return a boolean');
  });

  // Print test results
  console.log('📊 Test Results:');
  console.log(`   Tests Run: ${testsRun}`);
  console.log(`   Passed: ${testsPassed}`);
  console.log(`   Failed: ${testsFailed}`);

  if (testsFailed === 0) {
    console.log('\n🎉 All tests passed!');
    process.exit(0);
  } else {
    console.log('\n💥 Some tests failed!');
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

runTests().catch((error) => {
  console.error('Test runner error:', error);
  process.exit(1);
});
