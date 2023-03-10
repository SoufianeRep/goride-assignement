import {
  Card,
  Page,
  Layout,
  Heading,
  TextStyle,
  TextContainer,
  Button,
} from '@shopify/polaris';
import { TitleBar, useNavigate } from '@shopify/app-bridge-react';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Page narrowWidth>
      <TitleBar
        title="GoRide Assignment"
        primaryAction={{
          content: 'Products Page',
          onAction: () => navigate('/products'),
        }}
      />
      <Layout>
        <Layout.Section>
          <Card title="ASSIGNMENT EXPLANATION" sectioned>
            <TextContainer spacing="loose">
              <p>
                First I would like to thank you for giving me this opportunity.
                Having to get familiar with Shopify documentation was a pleasant
                journey.
              </p>
              <p>
                Ahead of assessing my work I would like to provide some
                explanation related to the required tasks.
              </p>
              <Heading element="h4">Backend Task</Heading>
              <p>
                The backend fires a job on the hour every hour and updates the
                fake product names as instructed. It prepends a random adjective
                to the product's title if it doesn't have any otherwise it just
                updates it in the following way:
                <br />
                <br />
                <TextStyle variation="strong">
                  Fake Product {'->'} Formal Fake Product {'->'} Dark Fake
                  Product
                </TextStyle>
              </p>
              <p>
                Since the job is outside of any route it can not leverage from
                the
                <TextStyle variation="code">
                  shopify.validateAuthenticatedSession()
                </TextStyle>{' '}
                middleware to pull the current session in order to query the
                store's Admin API. Instead, it pulls the session from the
                session storage setup on initialization in this case a local
                SQLite database.
              </p>
              <Heading element="h4">Frontend Task</Heading>
              <p>
                The front end is a simple page listing all the products in the
                store with a button allowing the user to update the price
                manually.
              </p>
              <p>
                Against all my efforts to query the Admin API from the front
                end, it seems like Shopify blocks all requests generated from a
                browser or a different origin other than the server. As a
                workaround I took the liberty to set up two routes in the back
                end, one to get all the products and a second to update the
                chosen product using its id.
              </p>
            </TextContainer>
            <Card.Section>
              <Button primary onClick={() => navigate('/products')}>
                Products Page
              </Button>
            </Card.Section>
            <TextContainer spacing="loose">
              <p>
                Hopefully, this assignment responds to all your expectations.
                Looking forward to discussing my code and choices if you deem
                them deserving.
              </p>
            </TextContainer>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
