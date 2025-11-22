/**
 * Convert SUI to WAL on Testnet
 * Uses the Walrus Protocol's token conversion contract
 */

import { config } from 'dotenv';
import { getFullnodeUrl } from '@mysten/sui/client';
import { SuiJsonRpcClient } from '@mysten/sui/jsonRpc';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';

// Load environment variables
config();

// Walrus token constants (from Walrus SDK)
const WAL_PACKAGE_ID = '0x8270feb7375eee355e64fdb69c50abb6b5f9393a722883c1cf45f8e26048810a';
const WAL_FAUCET_OBJECT_ID = '0x2::coin::TreasuryCap'; // This might need adjustment

async function convertSuiToWal() {
  console.log('🔄 Converting SUI to WAL...\n');

  try {
    // 1. Load private key
    const privateKey = process.env.privateKey;
    if (!privateKey) {
      throw new Error('privateKey not found in .env file');
    }

    const keypair = Ed25519Keypair.fromSecretKey(privateKey);
    const address = keypair.getPublicKey().toSuiAddress();
    console.log(`Address: ${address}\n`);

    // 2. Create client
    const client = new SuiJsonRpcClient({
      url: getFullnodeUrl('testnet'),
      network: 'testnet',
    });

    // 3. Check current balances
    console.log('📊 Current Balances:');
    const suiBalance = await client.getBalance({ owner: address });
    console.log(`   SUI: ${Number(suiBalance.totalBalance) / 1_000_000_000}`);

    try {
      const walBalance = await client.getBalance({
        owner: address,
        coinType: `${WAL_PACKAGE_ID}::wal::WAL`,
      });
      console.log(`   WAL: ${Number(walBalance.totalBalance) / 1_000_000_000}\n`);
    } catch (e) {
      console.log(`   WAL: 0 (no WAL coins found)\n`);
    }

    // 4. Use stakely.io faucet API to get WAL tokens
    console.log('🚰 Requesting WAL tokens from stakely.io faucet...');
    const faucetUrl = `https://stakely.io/api/faucet/walrus-testnet/0xacce198c8ca3f3416e9aa5c468473902d58861eede25aa92091de41c015f9640`;

    const response = await fetch(faucetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const result = await response.json();
      console.log('   ✅ WAL tokens requested successfully');
      console.log(`   Transaction: ${JSON.stringify(result)}\n`);
    } else {
      console.log(`   ⚠️  Faucet request failed: ${response.status} ${response.statusText}`);
      console.log('   Try manually at: https://stake.walrus.site\n');
    }

    // 5. Wait a bit and check balance again
    console.log('⏳ Waiting 10 seconds for transaction to complete...');
    await new Promise(resolve => setTimeout(resolve, 10000));

    const newWalBalance = await client.getBalance({
      owner: address,
      coinType: `${WAL_PACKAGE_ID}::wal::WAL`,
    });
    const walAmount = Number(newWalBalance.totalBalance) / 1_000_000_000;
    console.log(`\n   ✅ New WAL Balance: ${walAmount} WAL\n`);

    if (walAmount > 0) {
      console.log('🎉 Success! You now have WAL tokens.');
      console.log('   Ready to upload to Walrus!\n');
      return true;
    } else {
      console.log('❌ No WAL tokens received.');
      console.log('   Please visit https://stake.walrus.site to manually convert SUI to WAL\n');
      return false;
    }

  } catch (error) {
    console.error('\n❌ Conversion failed:');
    console.error(error.message);
    console.error('\nPlease visit https://stake.walrus.site to manually convert SUI to WAL\n');
    return false;
  }
}

// Run the conversion
convertSuiToWal()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
