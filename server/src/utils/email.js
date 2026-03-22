// Emails are disabled by default. This file provides a no-op `sendEmail` function
// so the rest of the codebase can call it without errors. This avoids any
// SMTP connections or nodemailer dependencies when you don't want outgoing mail.

const sendEmail = async ({ to, subject, html, text }) => {
  console.log('[email disabled] to:', to, 'subject:', subject);
  // Return a dummy result to keep callers happy.
  return null;
};

module.exports = { sendEmail };