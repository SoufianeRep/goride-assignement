// @ts-check
import { join } from 'path';
import { readFileSync } from 'fs';

import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import serveStatic from 'serve-static';
import cron from 'node-cron';

import shopify from './shopify.js';
import { titlesUpdator, loadSession } from './titles-updator.js';
import GDPRWebhookHandlers from './gdpr.js';

// @ts-ignore
const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);
const SHOP = `${process.env.SHOP}.myshopify.com`;
console.log(SHOP);

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
  console.log('cron job');
  const session = await loadSession(SHOP);
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

// Get Route to fetch all the products from the store's Admin API
app.get('/api/products', async (req, res) => {
  try {
    const response = await shopify.api.rest.Product.all({
      session: res.locals.shopify.session,
    });
    res.status(200).send(response);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Patch route to update a products price with a given ID through the Admin api
app.patch('/api/products/:id', async (req, res) => {
  const session = res.locals.shopify.session;
  try {
    const product = await shopify.api.rest.Product.find({
      session,
      id: req.params.id,
    });

    const variant = new shopify.api.rest.Variant({ session });
    variant.id = product.variants[0].id;
    variant.price = req.body.price;
    await variant.save({
      update: true,
    });
    res.status(200).send(variant.price);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.use(serveStatic(STATIC_PATH, { index: false }));

app.use('/*', shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set('Content-Type', 'text/html')
    .send(readFileSync(join(STATIC_PATH, 'index.html')));
});

app.listen(PORT);
