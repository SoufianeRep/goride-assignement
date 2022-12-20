// @ts-check
import { join } from 'path';
import { readFileSync } from 'fs';

import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import serveStatic from 'serve-static';
import cron from 'node-cron';

import shopify from './shopify.js';
import { titlesUpdator } from './utils/titles-updator.js';
import loadSession from './utils/session-loader.js';
import GDPRWebhookHandlers from './gdpr.js';

import productsEndpoints from './routes/products-api.js';

// @ts-ignore
const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);
const STORE = `${process.env.SHOPIFY_FLAG_STORE}.myshopify.com`;

const STATIC_PATH =
  process.env.NODE_ENV === 'production'
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot(),
);
app.post(
  shopify.config.webhooks.path,
  // @ts-ignore
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers }),
);

// The cron job updating the fake shops products every hour on the hour using
// cron-node schedule method
cron.schedule('0 0 * * * *', async function () {
  const session = await loadSession(STORE);
  await titlesUpdator(session);
});

/*
================================================================================
  Routes
================================================================================
*/

// All endpoints after this point will require an active session
app.use('/api/*', shopify.validateAuthenticatedSession());
app.use(express.json());

// The required products endpoints
productsEndpoints(app);

app.use(serveStatic(STATIC_PATH, { index: false }));

app.use('/*', shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set('Content-Type', 'text/html')
    .send(readFileSync(join(STATIC_PATH, 'index.html')));
});

app.listen(PORT);
