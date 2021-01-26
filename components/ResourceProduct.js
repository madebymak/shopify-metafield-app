import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import {
	FormLayout,
	Heading,
	Page,
	TextField,
	Thumbnail,
	Spinner
} from '@shopify/polaris';

const GET_PRODUCTS_BY_ID = gql`
	query ($id: ID!) {
		product(id: $id) {
			title
			images (first: 1) {
				edges {
					node {
						originalSrc
						altText
					}
				}
			}
			metafields(first: 50) {
				edges {
					node {
						namespace
						key
						value
					}
				}
			}
		}
	}
`;

const EditProduct = (props) => {
	const backToProducts = () => {
		props.editProductState(false);
	}

	const Metafields = (data) => {
		const metafieldData = data.props.product.metafields.edges;

		const loadMetafield = (
			<div>
				<FormLayout.Group>
					<TextField label='Key' value='test' onChange={() => { }} />
					<TextField label='Namespace' value='test' onChange={() => { }} />
				</FormLayout.Group>
				<FormLayout.Group>
					<TextField label='Value' value='test' onChange={() => { }} />
				</FormLayout.Group>
			</div>
		);

		const emptyMetafield = <div>Empty Metafields</div>

		return metafieldData.length > 0 ? loadMetafield : emptyMetafield;
	}

	const LoadProductData = (props) => {
		const productData = props.data.data;

		const MetafieldComponent = (
				<FormLayout>
					<Heading>Metafields</Heading>
					<Metafields props={productData} />
				</FormLayout>
		);

		const LoadingSpinner = (
			<div className='text-center margin-32'>
				<Spinner accessibilityLabel='loading icon' size='large' color='inkLightest' />
			</div>
		);

		return productData ? MetafieldComponent : LoadingSpinner;
	}

	return (
		<Query query={GET_PRODUCTS_BY_ID} variables={{ id: props.data }}>
			{(data, loading, error,) => {
				if (loading) return <div>Loading…</div>
				if (error) return <div>{error.message}</div>;

				let productTitle, productImage, productAlt;

				if (data.data) {
					productTitle = data.data.product.title;
					productImage = data.data.product.images.edges[0].node.originalSrc;
					productAlt = data.data.product.images.edges[0].node.altText;
				}

				return (
					<Page
						breadcrumbs={[{
							content: 'Back', onAction: () => {
								backToProducts();
							}
						}]}
						title={productTitle}
						primaryAction={{ content: 'Save', disabled: true }}
						thumbnail={<Thumbnail source={productImage} alt={productAlt} />}
					>
						<LoadProductData data={data}/>
					</Page>
				)
			}}
		</Query>
	)
}

export default EditProduct;
