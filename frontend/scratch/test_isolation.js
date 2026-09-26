// Simple unit test to verify getStorageKeyForEmail and state isolation helper logic
function getStorageKeyForEmail(email) {
  if (!email || !email.trim()) return 'habitloop_guest_user';
  const cleanEmail = email.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
  return `habitloop_user_${cleanEmail}`;
}

const keyA = getStorageKeyForEmail('student@test.com');
const keyB = getStorageKeyForEmail('pro@test.com');

console.log('Key A:', keyA);
console.log('Key B:', keyB);

if (keyA !== keyB && keyA === 'habitloop_user_student_test_com' && keyB === 'habitloop_user_pro_test_com') {
  console.log('✓ Storage key isolation test PASSED!');
} else {
  console.error('✕ Storage key isolation test FAILED!');
  process.exit(1);
}
