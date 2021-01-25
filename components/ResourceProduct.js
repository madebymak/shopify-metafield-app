import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import {
	Page,
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
				<div>{productData.product.title}</div>
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

				return (
					<Page
						breadcrumbs={[{
							content: 'Back', onAction: () => {
								backToProducts();
							}
						}]}
					>
							<LoadProductData data={data}/>
					</Page>
				)
			}}
		</Query>
	)
}

export default EditProduct;
