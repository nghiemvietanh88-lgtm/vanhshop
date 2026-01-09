import * as mailerService from '../src/services/mailer.service.js';
import configs from '../src/configs.js';

// Simple test to verify email functionality
// Run this with: node ./tool/test-email.js (from server directory)
async function test() {
  console.log('Testing email service...');
  console.log('Mailer config:', configs.mailer);

  const testEmail = configs.mailer.user; // Send to self for testing
  if (!testEmail) {
    console.error('No mailer user configured in environment which is required for this test.');
    process.exit(1);
  }

  try {
    console.log(`\n--- Sending password reset email to ${testEmail} ---`);
    await mailerService.sendPasswordResetEmail(testEmail, 'test-reset-token');
    console.log('✅ Password reset email sent successfully.');

    console.log(`\n--- Sending verification email to ${testEmail} ---`);
    await mailerService.sendVerificationEmail(testEmail, 'test-verify-token');
    console.log('✅ Verification email sent successfully.');
  } catch (err) {
    console.error('❌ Error sending email:', err);
  }
}

test();
