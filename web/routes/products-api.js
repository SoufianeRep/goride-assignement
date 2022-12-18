import express from 'express';
import shopify from '../shopify.js';

/**
 *  @desc Takes express app and defines products routes as required
 *
 * @param {Express} app
 */
export default function productsEndpoints(app) {
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
}
