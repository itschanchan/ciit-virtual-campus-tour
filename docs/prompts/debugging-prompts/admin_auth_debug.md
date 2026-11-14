# Admin Authorization and

This Markdown file documents all of the current errors in the backend, specifically in admin authorization in the `backend\` layer of the web-application.

## Rules:

1. **Naming Convention:** Use "Admin" or "Admins" instead of "User" or "Users" in the backend files related to admins. Do not change the current file names if it has already renamed.
2. **Test Files:** In the `tests\` folder, the test files should be directly testing the admin files from `models\`, `controllers\`, `services\`, and `routes\` folders.

---

## Errors

These are the errors appeared after running the `npm run test` in the terminal. Read and analyze these errors before generating a plan.

```bash
RUN  v5.1.0 /media/itschanchan/Data/my-coding-projects/web-projects/ciit-virtual-campus-tour/apps/backend

❯ tests/AuthService.test.js (0 test)
✓ tests/env.test.js (4 tests) 23ms
❯ tests/Auth.test.js (0 test)
❯ tests/startup.test.js (0 test)
stderr | tests/adminProfile.test.js
◇ injected env (6) from .env

❯ tests/adminProfile.test.js (3 tests | 3 failed) 74ms
  ❯ User profile routes (3)
    × returns the authenticated admin profile 53ms
    × denies access without a token 13ms
    × denies rating count to a regular user 5ms

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Suites 3 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

FAIL  tests/Auth.test.js [ tests/Auth.test.js ]
FAIL  tests/startup.test.js [ tests/startup.test.js ]
Error: Cannot find module '../controllers/GamesController.js' imported from /media/itschanchan/Data/my-coding-projects/web-projects/ciit-virtual-campus-tour/apps/backend/routes/AdminRoutes.js
❯ routes/AdminRoutes.js:5:1
     3| import { requireRole } from "../middleware/authorize.js";
     4| import userController from "../controllers/AdminController.js";
     5| import gamesController from "../controllers/GamesController.js";
      | ^
     6|
     7| const router = Router();
❯ index.js:6:1

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/6]⎯

FAIL  tests/AuthService.test.js [ tests/AuthService.test.js ]
Error: Cannot find module '../services/AdminAuthService.js' imported from /media/itschanchan/Data/my-coding-projects/web-projects/ciit-virtual-campus-tour/apps/backend/tests/AuthService.test.js
❯ tests/AuthService.test.js:2:1
     1| import { afterEach, describe, expect, it, vi } from 'vitest'
     2| import { createAdminAuthService } from '../services/AdminAuthService.js'
      | ^
     3|
     4| describe('Admin auth service configuration', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/6]⎯


⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 3 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

FAIL  tests/adminProfile.test.js > User profile routes > returns the authenticated admin profile
Error: expected 200 "OK", got 404 "Not Found"
❯ tests/adminProfile.test.js:98:8
    96|       .get("/api/users/me")
    97|       .set("Authorization", "Bearer valid-token")
    98|       .expect(200);
      |        ^
    99|
   100|     expect(response.body).toMatchObject(userProfile);
❯ Test._assertStatus node_modules/supertest/lib/test.js:376:14
❯ node_modules/supertest/lib/test.js:432:13
❯ Test._assertFunction node_modules/supertest/lib/test.js:409:13
❯ Test.assert node_modules/supertest/lib/test.js:274:23
❯ localAssert node_modules/supertest/lib/test.js:196:38
❯ Server.<anonymous> node_modules/supertest/lib/test.js:203:13

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/6]⎯

FAIL  tests/adminProfile.test.js > User profile routes > denies access without a token
Error: expected 401 "Unauthorized", got 404 "Not Found"
❯ tests/adminProfile.test.js:104:62
   102|
   103|   it("denies access without a token", async () => {
   104|     const response = await request(app).get("/api/users/me").expect(401);
      |                                                              ^
   105|   });
   106|
❯ Test._assertStatus node_modules/supertest/lib/test.js:376:14
❯ node_modules/supertest/lib/test.js:432:13
❯ Test._assertFunction node_modules/supertest/lib/test.js:409:13
❯ Test.assert node_modules/supertest/lib/test.js:274:23
❯ localAssert node_modules/supertest/lib/test.js:196:38
❯ Server.<anonymous> node_modules/supertest/lib/test.js:203:13

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/6]⎯

FAIL  tests/adminProfile.test.js > User profile routes > denies rating count to a regular user
Error: expected 403 "Forbidden", got 404 "Not Found"
❯ tests/adminProfile.test.js:122:8
   120|       .get("/api/users/me/rating-count")
   121|       .set("Authorization", "Bearer regular-user-token")
   122|       .expect(403);
      |        ^
   123|   });
   124| });
❯ Test._assertStatus node_modules/supertest/lib/test.js:376:14
❯ node_modules/supertest/lib/test.js:432:13
❯ Test._assertFunction node_modules/supertest/lib/test.js:409:13
❯ Test.assert node_modules/supertest/lib/test.js:274:23
❯ localAssert node_modules/supertest/lib/test.js:196:38
❯ Server.<anonymous> node_modules/supertest/lib/test.js:203:13

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/6]⎯


Test Files  4 failed | 1 passed (5)
     Tests  3 failed | 4 passed (7)
  Start at  10:46:01
  Duration  1.35s (import 75%, transform 12%, worker 7%, tests 6%)
```
