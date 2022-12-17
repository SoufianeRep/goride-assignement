import { ProductCostMajor } from '@shopify/polaris-icons';
import {
  IndexTable,
  Thumbnail,
  TextStyle,
  Button,
  Popover,
  Layout,
  Spinner,
  TextField,
  FormLayout,
  Form,
  Toast,
} from '@shopify/polaris';
// import { Toast } from '@shopify/app-bridge-react';
import { useCallback, useState } from 'react';
import { useAuthenticatedFetch } from '../hooks';

export function ProductRow({ product, index }) {
  const [popoverActive, setPopoverActive] = useState(false);
  const [price, setPrice] = useState(product.variants[0].price);
  const [newPrice, setNewPrice] = useState(price);
  const [isToastActive, setIsToastActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetch = useAuthenticatedFetch();

  const togglePopover = useCallback(() => {
    setPopoverActive((prevState) => !prevState);
  }, []);

  const toggleToast = useCallback(() => {
    setIsToastActive((prevState) => !prevState);
  }, []);

  const handleNewPriceChange = useCallback((value) => {
    setNewPrice(value);
  }, []);

  const handleSubmitNewPrice = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLoading(true);
      const data = { price: newPrice };
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const price = await response.json();
        setPrice(price);
        setIsLoading(false);
        setIsToastActive(true);
      } else {
        setIsLoading(false);
      }
    },
    [newPrice],
  );

  const toastMarkup = isToastActive ? (
    <Toast
      content={`${product.title}'s price updated`}
      onDismiss={toggleToast}
      duration={3500}
    />
  ) : null;

  const activator = (
    <Button onClick={togglePopover} primary disclosure>
      Update Price
    </Button>
  );

  return (
    <IndexTable.Row id={product.id} key={product.id} position={index}>
      <IndexTable.Cell>
        <Thumbnail source={ProductCostMajor} alt="placeholder" size="medium" />
      </IndexTable.Cell>
      <IndexTable.Cell>
        <TextStyle>{product.title}</TextStyle>
      </IndexTable.Cell>
      <IndexTable.Cell>
        {isLoading ? (
          <Spinner size="small" />
        ) : (
          <TextStyle>¥ {price}</TextStyle>
        )}
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Popover
          activator={activator}
          active={popoverActive}
          onClose={togglePopover}
          sectioned
        >
          <Form onSubmit={handleSubmitNewPrice}>
            <FormLayout sectioned>
              <Layout.Section>
                <TextStyle alignement="start" heading>
                  Adjust {product.title} Price
                </TextStyle>
              </Layout.Section>
              <Layout.Section>
                <TextField
                  type="number"
                  onChange={handleNewPriceChange}
                  value={newPrice}
                  label="New Price"
                  prefix="¥"
                  autoComplete="off"
                />
              </Layout.Section>

              <Layout.Section>
                <Button size="slim" onClick={togglePopover} submit>
                  Set New Price
                </Button>
              </Layout.Section>
            </FormLayout>
          </Form>
        </Popover>
      </IndexTable.Cell>
      {toastMarkup}
    </IndexTable.Row>
  );
}
