// Backwards-compatible alias for AuthService.
// The admin auth service implementation lives in AuthService.js;
// this module re-exports it so existing imports of AdminAuthService keep working.
export { createAdminAuthService } from './AuthService.js'
