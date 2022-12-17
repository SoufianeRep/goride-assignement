import {
  Card,
  Page,
  Layout,
  Heading,
  TextStyle,
  DisplayText,
  TextContainer,
} from '@shopify/polaris';
import { TitleBar, useNavigate } from '@shopify/app-bridge-react';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Page narrowWidth>
      <TitleBar
        title="GoRide Assignement"
        primaryAction={{
          content: 'Products Page',
          onAction: () => navigate('/products'),
        }}
      />
      <Layout>
        <Layout.Section>
          <Card title="Assignement Explanation" sectioned>
            <TextContainer spacing="loose">
              <p>
                Sample products are created with a default title and price. You
                can remove them at any time.
              </p>
              <Heading element="h4">
                TOTAL PRODUCTS
                <DisplayText size="medium">
                  <TextStyle variation="strong"></TextStyle>
                </DisplayText>
              </Heading>
            </TextContainer>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
