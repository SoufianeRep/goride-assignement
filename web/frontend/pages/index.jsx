import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  Link,
  Heading,
} from '@shopify/polaris';
import { TitleBar, useNavigate } from '@shopify/app-bridge-react';

import { trophyImage } from '../assets';

import { ProductsCard } from '../components';

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
      <Layout></Layout>
    </Page>
  );
}
