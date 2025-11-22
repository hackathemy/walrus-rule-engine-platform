/**
 * Get WAL tokens using Playwright browser automation
 * Visits stake.walrus.site and converts SUI to WAL
 */

import { chromium } from 'playwright';
import { config } from 'dotenv';

config();

async function getWalTokens() {
  console.log('🌐 Opening browser to get WAL tokens...\n');

  const browser = await chromium.launch({
    headless: false, // Show browser for user to interact
    slowMo: 500, // Slow down for visibility
  });

  try {
    const context = await browser.newContext();
    const page = await context.newPage();

    // Navigate to Walrus staking site
    console.log('📍 Navigating to stake.walrus.site...');
    await page.goto('https://stake.walrus.site', { waitUntil: 'networkidle' });

    console.log('\n✋ MANUAL STEPS REQUIRED:\n');
    console.log('1. Connect your Sui wallet');
    console.log('2. Click "Get WAL" button');
    console.log('3. Convert some SUI to WAL (at least 1 WAL)');
    console.log('4. Approve the transaction in your wallet\n');
    console.log('⏱️  Browser will stay open for 5 minutes...\n');

    // Wait for 5 minutes to allow manual interaction
    await page.waitForTimeout(300000);

    console.log('✅ Time expired. Closing browser...\n');

  } catch (error) {
    console.error('❌ Browser automation error:', error.message);
  } finally {
    await browser.close();
  }

  console.log('Done! Now run: node test-walrus-upload.js\n');
}

getWalTokens().catch(console.error);
