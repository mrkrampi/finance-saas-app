import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { HTTPException } from 'hono/http-exception';

import summary from '@/app/api/[[...route]]/summary';
import accounts from '@/app/api/[[...route]]/accounts';
import categories from '@/app/api/[[...route]]/categories';
import transactions from '@/app/api/[[...route]]/transactions';

export const runtime = 'edge';

const app = new Hono().basePath('/api');

app.onError((err, ctx) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  return ctx.json({ error: 'Internal Error' }, 500);
});

const routes = app
  .route('/summary', summary)
  .route('/accounts', accounts)
  .route('/categories', categories)
  .route('/transactions', transactions);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
