import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import {
  Card,
	Page,
  ResourceList,
  Stack,
  TextStyle,
	Thumbnail,
	Link
} from '@shopify/polaris';
import store from 'store-js';
import { Redirect } from '@shopify/app-bridge/actions';
import { Context } from '@shopify/app-bridge-react';
import { useState } from 'react';

const GET_PRODUCTS_BY_ID = gql`
	query ($id: ID!) {
		product(id: $id) {
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
	console.log({ props });
	const handleChange = () => {
		props.editProductState(false);
	}

	return (
		<Query query={GET_PRODUCTS_BY_ID} variables={{ id: props.data }}>
			{(data, loading, error) => { 
				if (loading) return <div>Loading…</div>;
				if (error) return <div>{error.message}</div>;
				// productData = data;
				console.log({data});

				return (
					<Page
						breadcrumbs={[{
							content: 'Back', onAction: () => {
								handleChange();
						} }]}>
						{/* <Link onClick={() => { 
							console.log('back');
						}}
						
						>
							Back
						</Link> */}
							testing product: {props.data}
					</Page>
				)
			}}
		</Query>
	)
		
}

export default EditProduct;
