import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';

import { db } from '@/db/drizzle';
import { accounts } from '@/db/schema';

const app = new Hono()
  .get(
    '/',
    clerkMiddleware(),
    async (ctx) => {
      const auth = getAuth(ctx);

      if (!auth?.userId) {
        throw new HTTPException(401, {
          res: ctx.json({
            error: 'Not authorized',
          }),
        });
      }

      const data = await db
        .select({
          id: accounts.id,
          name: accounts.name,
        })
        .from(accounts)
        .where(eq(accounts.userId, auth.userId));

      return ctx.json({ data });
    });

export default app;
