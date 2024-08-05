import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { HTTPException } from 'hono/http-exception';

import accounts from './accounts';
import categories from '@/app/api/[[...route]]/categories';

export const runtime = 'edge';

const app = new Hono().basePath('/api');

app.onError((err, ctx) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  return ctx.json({ error: 'Internal Error' }, 500);
});

const routes = app
  .route('/accounts', accounts)
  .route('/categories', categories);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
