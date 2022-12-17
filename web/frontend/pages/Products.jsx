import { useState, useEffect } from 'react';
import { useAppQuery } from '../hooks';

import { Card, Page, IndexTable, SkeletonBodyText } from '@shopify/polaris';
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

  console.log(products);

  const rowMarkup = products?.map((product, index) => {
    return <ProductRow product={product} index={index} />;
  });

  const loadingMarkup = (
    <>
      <Loading />
      <SkeletonBodyText />
      );
    </>
  );

  return (
    <Page>
      <TitleBar
        title="Products"
        breadcrumbs={breadcrumbs}
        primaryAction={null}
      ></TitleBar>

      <Card>
        <IndexTable
          itemCount={products?.length}
          resourceName={{
            plural: 'Fake products',
            singular: 'Fake product',
          }}
          selectable={false}
          headings={[
            { title: 'Thumbnail', hidden: true },
            { title: 'Title' },
            { title: 'Price' },
            { title: 'Action' },
          ]}
        >
          {isLoading || isRefetching ? loadingMarkup : rowMarkup}
        </IndexTable>
      </Card>
    </Page>
  );
}
