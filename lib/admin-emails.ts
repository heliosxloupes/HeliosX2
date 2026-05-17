export function getAdminSeedEmails() {
  return (process.env.ADMIN_SEED_EMAILS ?? 'heliosxloupes@gmail.com,kylelieberbaum@gmail.com')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}
