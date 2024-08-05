import { z } from 'zod';
import { Hono } from 'hono';
import { eq, and, inArray } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import { zValidator } from '@hono/zod-validator';
import { HTTPException } from 'hono/http-exception';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';

import { db } from '@/db/drizzle';
import { categories, insertCategorySchema } from '@/db/schema';

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
          id: categories.id,
          name: categories.name,
        })
        .from(categories)
        .where(eq(categories.userId, auth.userId));

      return ctx.json({ data });
    })
  .get(
    '/:id',
    clerkMiddleware(),
    zValidator('param', z.object({
      id: z.string().optional(),
    })),
    async (ctx) => {
      const auth = getAuth(ctx);

      if (!auth?.userId) {
        throw new HTTPException(401, {
          res: ctx.json({
            error: 'Not authorized',
          }),
        });
      }

      const { id } = ctx.req.valid('param');

      if (!id) {
        throw new HTTPException(400, {
          res: ctx.json({
            error: 'Missing id',
          }),
        });
      }

      const [data] = await db
        .select({
          id: categories.id,
          name: categories.name,
        })
        .from(categories)
        .where(
          and(
            eq(categories.userId, auth.userId),
            eq(categories.id, id),
          ),
        );

      console.log(data);

      if (!data) {
        throw new HTTPException(404, {
          res: ctx.json({
            error: 'Not found',
          }),
        });
      }

      return ctx.json({ data });
    },
  )
  .post(
    '/',
    clerkMiddleware(),
    zValidator('json', insertCategorySchema.pick({
      name: true,
    })),
    async (ctx) => {
      const auth = getAuth(ctx);

      if (!auth?.userId) {
        throw new HTTPException(401, {
          res: ctx.json({
            error: 'Not authorized',
          }),
        });
      }

      const values = ctx.req.valid('json');

      const [data] = await db.insert(categories)
        .values({
          id: createId(),
          userId: auth.userId,
          ...values,
        })
        .returning();

      return ctx.json({ data });
    },
  )
  .post(
    '/bulk-delete',
    clerkMiddleware(),
    zValidator('json', z.object({
      ids: z.array(z.string()),
    })),
    async (ctx) => {
      const auth = getAuth(ctx);

      if (!auth?.userId) {
        throw new HTTPException(401, {
          res: ctx.json({
            error: 'Not authorized',
          }),
        });
      }

      const values = ctx.req.valid('json');

      const data = await db
        .delete(categories)
        .where(
          and(
            eq(categories.userId, auth.userId),
            inArray(categories.id, values.ids),
          ),
        )
        .returning({
          id: categories.id,
        });

      return ctx.json({ data });
    },
  )
  .patch(
    '/:id',
    clerkMiddleware(),
    zValidator('param', z.object({
      id: z.string().optional(),
    })),
    zValidator('json', insertCategorySchema.pick({ name: true })),
    async (ctx) => {
      const auth = getAuth(ctx);

      if (!auth?.userId) {
        throw new HTTPException(401, {
          res: ctx.json({
            error: 'Not authorized',
          }),
        });
      }

      const { id } = ctx.req.valid('param');

      if (!id) {
        throw new HTTPException(400, {
          res: ctx.json({
            error: 'Missing id',
          }),
        });
      }

      const values = ctx.req.valid('json');

      const [data] = await db
        .update(categories)
        .set(values)
        .where(
          and(
            eq(categories.userId, auth.userId),
            eq(categories.id, id),
          ),
        )
        .returning();

      if (!data) {
        throw new HTTPException(404, {
          res: ctx.json({
            error: 'Not found',
          }),
        });
      }

      return ctx.json({ data });
    },
  )
  .delete(
    '/:id',
    clerkMiddleware(),
    zValidator('param', z.object({
      id: z.string().optional(),
    })),
    async (ctx) => {
      const auth = getAuth(ctx);

      if (!auth?.userId) {
        throw new HTTPException(401, {
          res: ctx.json({
            error: 'Not authorized',
          }),
        });
      }

      const { id } = ctx.req.valid('param');

      if (!id) {
        throw new HTTPException(400, {
          res: ctx.json({
            error: 'Missing id',
          }),
        });
      }

      const [data] = await db
        .delete(categories)
        .where(
          and(
            eq(categories.userId, auth.userId),
            eq(categories.id, id),
          ),
        )
        .returning({
          id: categories.id,
        });

      if (!data) {
        throw new HTTPException(404, {
          res: ctx.json({
            error: 'Not found',
          }),
        });
      }

      return ctx.json({ data });
    },
  )

export default app;
