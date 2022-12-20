import shopify from '../shopify.js';

/**
 * @desc takes a store name and retruns the first session from the session storage
 * @param {string} shop store name
 * @returns {Object<SessionParams>} session
 */
export default async function loadSession(store) {
  const session = await shopify.config.sessionStorage.findSessionsByShop(store);
  return session[0];
}
