import { useAppQuery } from '../hooks';

import {
  Card,
  Page,
  IndexTable,
  SkeletonBodyText,
  Frame,
} from '@shopify/polaris';
import { TitleBar, Loading } from '@shopify/app-bridge-react';

import { ProductRow } from '../components/ProductRow';

export default function Products() {
  const breadcrumbs = [{ content: 'GoRide Assignement', url: '/' }];

  const {
    data: products,
    isLoading,
    isRefetching,
  } = useAppQuery({
    url: '/api/products',
  });

  const loadingMarkup = (
    <>
      <Loading />
      <Card sectioned>
        <SkeletonBodyText />
        <br />
        <SkeletonBodyText lines={2} />
      </Card>
    </>
  );

  const rowMarkup = products?.map((product, index) => {
    return <ProductRow product={product} index={index} />;
  });

  return (
    <Page>
      <Frame>
        {isLoading || isRefetching ? (
          loadingMarkup
        ) : (
          <>
            <TitleBar
              title="Products"
              breadcrumbs={breadcrumbs}
              primaryAction={null}
            ></TitleBar>

            <Card>
              <IndexTable
                itemCount={products?.length}
                resourceName={{
                  plural: 'Products',
                  singular: 'Product',
                }}
                selectable={false}
                headings={[
                  { title: 'Thumbnail', hidden: true },
                  { title: 'Title' },
                  { title: 'Price' },
                  { title: 'Action' },
                ]}
              >
                {rowMarkup}
              </IndexTable>
            </Card>
          </>
        )}
      </Frame>
    </Page>
  );
}
