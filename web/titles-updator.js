import shopify from './shopify.js';

const ADJECTIVES = [
  'Autumn',
  'Dark',
  'Summer',
  'Delicate',
  'White',
  'Cool',
  'Spring',
  'Winter',
  'Crimson',
  'Blue',
  'Frosty',
  'Green',
  'Long',
  'Tight-fitting',
  'Baggy',
  'Casual',
  'Formal',
  'Colourful',
  'Plain',
  'Tasteful',
  'Unfashionable',
  'Smart',
  'Scruffy',
  'Trendy',
  'Sleeveless',
];

/**
 * A function that changes the provided product title
 * @desc Takes a product title and prepends a random adjective to it or a new one
 * if it already has an adjective.
 *
 * @param {string} title
 * @return {string}
 */
function randomTitle(title) {
  const randAdj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const firstWord = title.split(' ')[0];
  if (ADJECTIVES.includes(firstWord)) return title.replace(firstWord, randAdj);
  return `${randAdj} ${title}`;
}

/**
 * An async function that retrieve all the products from the Admin API
 * @desc Takes the shopify session object as argument and queries the store's admin
 * API to get a list of all the products GraphQL IDs and titles in an array containing
 * the products ({id, title}) and error (if an error is caught).
 *
 * @param {Object<SessionParams>} session Shopify session token object
 * @returns {array} Array [products, error]
 */
async function listProductsIds(session) {
  try {
    const response = await shopify.api.rest.Product.all({ session });

    const products = [];
    response.forEach((product) => {
      products.push({
        id: product.admin_graphql_api_id,
        title: product.title,
      });
    });
    return [products, null];
  } catch (err) {
    return [null, err];
  }
}

/**
 * An async function that updates all the stores products titles
 * @desc Takes the shopify session objects as argumet and updates all the store
 * products titles through a GraphQL mutation prepending a random adjective or
 * changing it.
 *
 * @param {Object<SessionParams>} session Shopify session token object
 * @returns {Promise<any, Error>} promise
 */
export async function titlesUpdator(session) {
  try {
    const [products, err] = await listProductsIds(session);
    if (err) throw err;

    const client = new shopify.api.clients.Graphql({ session });

    for (let i = 0; i < products.length; i++) {
      await client.query({
        data: `mutation {
          productUpdate(input: {
            id: "${products[i].id}",
            title: "${randomTitle(products[i].title)}"
          }) {
              product {
                id
            }
          }
        }`,
      });
    }
  } catch (err) {
    throw err;
  }
}

/**
 * @desc takes a store name and retruns the first session from the session storage
 * @param {string} shop store name
 * @returns {Object<SessionParams>} session
 */
export async function loadSession(shop) {
  const session = await shopify.config.sessionStorage.findSessionsByShop(shop);
  return session[0];
}
