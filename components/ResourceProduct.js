import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import {
	FormLayout,
	Heading,
	Page,
	TextField,
	Spinner
} from '@shopify/polaris';
import store from 'store-js';
import { Redirect } from '@shopify/app-bridge/actions';
import { Context } from '@shopify/app-bridge-react';
import { useState } from 'react';

const GET_PRODUCTS_BY_ID = gql`
	query ($id: ID!) {
		product(id: $id) {
			title
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

	const LoadProductData = (props) => {
		const productData = props.data.data;

		if (productData) {
			return(
				<div>
					<Page separator>
						<FormLayout>
							<Heading>Metafields</Heading>
							<FormLayout.Group>
								<TextField label="Key" onChange={() => {}} />
								<TextField label="Namespace" onChange={() => {}} />
							</FormLayout.Group>
							<TextField label="Value" onChange={() => {}} />
						</FormLayout>
					</Page>
				</div>
			)
		} else {
			return (
				<div className='text-center margin-32'>
					<Spinner accessibilityLabel='loading icon' size='large' color='inkLightest' />
				</div>
			)
		}
	}

	return (
		<Query query={GET_PRODUCTS_BY_ID} variables={{ id: props.data }}>
			{(data, loading, error,) => {
				if (loading) return <div>Loading…</div>
				if (error) return <div>{error.message}</div>;

				let productTitle;

				if (data.data) {
					productTitle = data.data.product.title;
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
					>
						<LoadProductData data={data}/>
					</Page>
				)
			}}
		</Query>
	)
}

export default EditProduct;
