import { useAppBridge } from '@shopify/app-bridge-react';
import { authenticatedFetch } from '@shopify/app-bridge-utils';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from '@apollo/client';

export function MyApolloProvider({ children }) {
  const app = useAppBridge();
  const client = new ApolloClient({
    uri: `${app.hostOrigin}/admin/api/2021-07/graphql.json`,
    cache: new InMemoryCache(),
    headers: {
      'Access-Control-Allow-Origin': app.hostOrigin,
    },
    fetch: authenticatedFetch(app),
    credentials: 'include',
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
