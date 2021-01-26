import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import {
	FormLayout,
	Heading,
	Page,
	TextField,
	Thumbnail
} from '@shopify/polaris';
import LoadingSpinner from './LoadingSpinner';

const GET_PRODUCTS_BY_ID = gql`
	query ($id: ID!) {
		product(id: $id) {
			id
			title
			images (first: 1) {
				edges {
					node {
						id
						originalSrc
						altText
					}
				}
			}
			metafields(first: 50) {
				edges {
					node {
						id
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

		let metafieldArr = []

		const loadMetafield = (metafieldData) => {
			metafieldData.map((item) => {
				metafieldArr.push(item);
			});

			return (
				<div>
					{metafieldArr.map((item, index) => {
						return (
							<div className='margin-bottom-30' key={index}>
								{item.node.key}
								<FormLayout.Group>
									<TextField label='Key' value={item.node.key} onChange={() => { }} />
									<TextField label='Namespace' value={item.node.namespace} onChange={() => { }} />
								</FormLayout.Group>
								<FormLayout.Group>
									<TextField label='Value' value={item.node.value} onChange={() => { }} />
								</FormLayout.Group>
							</div>
						)
					})}
				</div>
			)
		};

		const emptyMetafield = <div>Empty Metafields</div>

		return metafieldData.length > 0 ? loadMetafield(metafieldData) : emptyMetafield;
	}

	const LoadProductData = (props) => {
		const productData = props.data.data;

		const MetafieldComponent = (
				<FormLayout>
					<Heading>Metafields</Heading>
					<Metafields props={productData} />
				</FormLayout>
		);

		return MetafieldComponent;
	}

	return (
		<Query query={GET_PRODUCTS_BY_ID} variables={{ id: props.data }}>
			{(data, loading, error) => {
				if (error) return <div>{error.message}</div>;

				if (data.loading) {
					return <LoadingSpinner />
				} else {
					let productTitle, productImageSrc, productImageAlt;

					const productResult = data.data;
					const productImage = (productResult.product.images.edges).shift();

					productTitle = productResult.product.title;

					// TODO: Fix issue with missing img src on reload
					// productImageSrc = productImage.node.originalSrc;
					// productImageAlt = productImage.node.altText;


					return (
						<Page
							breadcrumbs={[{
								content: 'Back', onAction: () => {
									backToProducts();
								}
							}]}
							title={productTitle}
							primaryAction={{ content: 'Save', disabled: true }}
							// thumbnail={<Thumbnail source={productImageSrc} alt={productImageAlt} />}
						>
							<LoadProductData data={data}/>
						</Page>
					)
				}
			}}
		</Query>
	)
}

export default EditProduct;
