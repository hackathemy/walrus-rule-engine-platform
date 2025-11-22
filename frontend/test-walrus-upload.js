/**
 * Walrus Upload Test Script
 * Tests uploading to Walrus using the SDK with a private key from .env
 */

import { readFileSync } from 'fs';
import { config } from 'dotenv';
import { getFullnodeUrl } from '@mysten/sui/client';
import { SuiJsonRpcClient } from '@mysten/sui/jsonRpc';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { walrus } from '@mysten/walrus';

// Load environment variables
config();

async function testWalrusUpload() {
  console.log('🧪 Starting Walrus Upload Test...\n');

  try {
    // 1. Load private key from .env
    console.log('1️⃣ Loading private key...');
    const privateKey = process.env.privateKey;
    if (!privateKey) {
      throw new Error('privateKey not found in .env file');
    }

    const keypair = Ed25519Keypair.fromSecretKey(privateKey);
    const address = keypair.getPublicKey().toSuiAddress();
    console.log(`   ✅ Loaded keypair for address: ${address}\n`);

    // 2. Create Walrus-extended SuiClient
    console.log('2️⃣ Creating Walrus client...');
    const client = new SuiJsonRpcClient({
      url: getFullnodeUrl('testnet'),
      network: 'testnet',
    }).$extend(walrus());
    console.log('   ✅ Client created\n');

    // 3. Check SUI balance
    console.log('3️⃣ Checking SUI balance...');
    const balance = await client.getBalance({ owner: address });
    const suiBalance = Number(balance.totalBalance) / 1_000_000_000;
    console.log(`   SUI Balance: ${suiBalance} SUI`);

    if (suiBalance < 0.1) {
      console.log('   ⚠️  Warning: Low SUI balance. Get testnet SUI from:');
      console.log('      https://faucet.testnet.sui.io/\n');
    } else {
      console.log('   ✅ Sufficient balance\n');
    }

    // 4. Load test file
    console.log('4️⃣ Loading test file...');
    const testFilePath = '../backend/data/test_upload.csv';
    const fileContent = readFileSync(testFilePath, 'utf-8');
    const fileBytes = new TextEncoder().encode(fileContent);
    console.log(`   ✅ Loaded ${fileBytes.length} bytes\n`);

    // 5. Upload to Walrus
    console.log('5️⃣ Uploading to Walrus testnet...');
    console.log('   This may take a moment...');

    const uploadStart = Date.now();
    const result = await client.walrus.writeBlob({
      blob: fileBytes,
      deletable: true,
      epochs: 5,
      signer: keypair,
    });
    const uploadTime = ((Date.now() - uploadStart) / 1000).toFixed(2);

    console.log(`   ✅ Upload completed in ${uploadTime}s\n`);

    // 6. Display results
    console.log('📊 Upload Results:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Blob ID: ${result.blobId}`);
    console.log(`Size: ${fileBytes.length} bytes`);
    console.log(`Epochs: 5`);
    console.log(`Aggregator URL: https://aggregator.walrus-testnet.walrus.space/v1/${result.blobId}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // 7. Verify by downloading
    console.log('7️⃣ Verifying upload by downloading...');
    const downloaded = await client.walrus.readBlob(result.blobId);
    const downloadedText = new TextDecoder().decode(downloaded);

    if (downloadedText === fileContent) {
      console.log('   ✅ Verification successful! Content matches.\n');
    } else {
      console.log('   ❌ Verification failed! Content mismatch.\n');
      return false;
    }

    console.log('🎉 All tests passed! Walrus upload is working correctly.\n');
    return true;

  } catch (error) {
    console.error('\n❌ Test failed with error:');
    console.error(error.message);

    if (error.message.includes('Insufficient')) {
      console.log('\n💡 Get testnet SUI from: https://faucet.testnet.sui.io/');
    }

    console.error('\nFull error:', error);
    return false;
  }
}

// Run the test
testWalrusUpload()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
