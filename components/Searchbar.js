import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import { useState, useCallback, useEffect } from 'react';
import {
	Autocomplete,
	Icon,
	ResourceList,
	ResourceItem,
	Card,
	TextStyle,
	Thumbnail,
	Stack,
	Badge,
	Pagination
} from '@shopify/polaris';
import EditProduct from './ResourceProduct';
import LoadingSpinner from './LoadingSpinner';

const GET_ALL_PRODUCTS = gql`
	query	($numProducts:	Int, $lastNum: Int, $before: String,	$after:	String) {
		products(first:	$numProducts, last: $lastNum, before: $before,	after:	$after, sortKey:TITLE)	{
			pageInfo	{
					hasNextPage
					hasPreviousPage
			}
			edges	{
				cursor
				node	{
					id
					title
					descriptionHtml
					images (first: 1) {
						edges {
							node {
								originalSrc
								altText
							}
						}
					}
					metafields(first:1) {
						edges {
							node {
								namespace
							}
						}
					}
				}
			}
		}
	}
`;

const SearchBar = (props) => {
	const deselectedOptions = [
    {value: 'rustic', label: 'Rustic'},
    {value: 'antique', label: 'Antique'},
    {value: 'vinyl', label: 'Vinyl'},
    {value: 'vintage', label: 'Vintage'},
    {value: 'refurbished', label: 'Refurbished'},
	];

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');
	const [options, setOptions] = useState(deselectedOptions);

	const limit = 10;

	const [editProductState, setEditProduct] = useState(false)

	const [paginationState, setPaginationState] = useState({
		first: limit,
		last: null,
		before: null,
		after: null
	});

	const [productId, setProductId] = useState('');

	const nextPage = useCallback((cursor) => {
		setPaginationState({
			first: limit,
			last: null,
			before: null,
			after: cursor
		})
	});

	const prevPage = useCallback((cursor) => {
		setPaginationState({
			first: null,
			last: limit,
			before: cursor,
			after: null
		})
	});

	const getProductId = useCallback((id) => { 
		console.log({ id });
		setProductId(id);
	})

	useEffect(() => {}, [paginationState]);

	  // const updateText = useCallback(
  //   (value) => {
  //     setInputValue(value);
  //     if (value === '') {
  //       setOptions(deselectedOptions);
  //       return;
	// 		}

  //     const filterRegex = new RegExp(value, 'i');
  //     const resultOptions = deselectedOptions.filter((option) =>
  //       option.label.match(filterRegex),
  //     );
  //     setOptions(resultOptions);
  //   },
  //   [deselectedOptions],
	// );

  // const updateSelection = useCallback(
  //   (selected) => {
  //     const selectedValue = selected.map((selectedItem) => {
  //       const matchedOption = options.find((option) => {
  //         return option.value.match(selectedItem);
  //       });
  //       return matchedOption && matchedOption.label;
	// 		});

  //     setSelectedOptions(selected);
  //     setInputValue(selectedValue);
  //   },
  //   [options],
	// );

  // const textField = (
  //   <Autocomplete.TextField
  //     onChange={updateText}
  //     label="Tags"
  //     value={inputValue}
  //     prefix={<Icon source={SearchMinor} color="inkLighter" />}
  //     placeholder="Search"
  //   />
	// );

	return (

		<Query query={GET_ALL_PRODUCTS} variables={{
			numProducts: paginationState.first,
			lastNum: paginationState.last,
			before: paginationState.before,
			after: paginationState.after,
		}}>
			{(data, loading, error) => {
				if (error) return <div>{error.message}</div>;
				let product, pageInfo, prevCursor, nextCursor;

				if (data.loading) {
					return <LoadingSpinner />
				} else {
					product = data.data.products.edges;
					pageInfo = data.data.products.pageInfo;

					(product).forEach((item, pos, array) => {
						if (pos == 0) {
							prevCursor = item.cursor;
						}

						if (pos == (array.length - 1)) {
							nextCursor = item.cursor;
						}
					});

					const page = pageInfo;

					return (
						<Card sectioned>
							{editProductState ? <EditProduct editProductState={setEditProduct} data={productId} /> :
								<ResourceList
									resourceName={{ singular: 'Product', plural: 'Products' }}
									items={product}
									renderItem={(item) => {
										// console.log('item', item.node.images.edges);

										let imageSrc, imageAlt;
										const productItem = item.node;
										const productMetafields = (item.node.metafields.edges).length;
										const hasMetafields = productMetafields == 0 ? 'No Metafields' : 'Metafields';
										const metafieldStatus = productMetafields == 0 ? 'default' : 'success';

										(productItem.images.edges).forEach(element => {
											imageSrc = element.node.originalSrc;
											imageAlt = element.node.altText;
										});

										const productId = item.node.id;

										return (
											<ResourceItem
												// id={id}
												// url={url}
												media={<Thumbnail source={imageSrc} alt={imageAlt} />}
												// accessibilityLabel={`View details for ${name}`}
												onClick={() => {
													// console.log({ item });
													getProductId(item.node.id);
													setEditProduct(true);
												}}
											>
												<div className='float-right'>
													<Badge status={metafieldStatus}>
														{hasMetafields}
													</Badge>
												</div>
												<h3>
													<TextStyle variation="strong">{productItem.title}</TextStyle>
												</h3>
												<TextStyle>{productItem.title}</TextStyle>

											</ResourceItem>
										);
									}}
								/>
									}

							<div className='text-center'>
								<Pagination
									label=''
									hasPrevious={ page.hasPreviousPage }
									onPrevious={() => {
										prevPage(prevCursor);
									}}
									hasNext={ page.hasNextPage }
									onNext={() => {
										nextPage(nextCursor);
									}}
								/>
							</div>
						</Card>
					)
				}
			}}
		</Query>

  );
}

export default SearchBar;
