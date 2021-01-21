import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import store from 'store-js';

import { useState, useCallback } from 'react';
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
import { SearchMinor } from '@shopify/polaris-icons';
import storeEngine from 'store-js/src/store-engine';
import next from 'next';

const GET_ALL_PRODUCTS = gql`
	query	($numProducts:	Int, $lastNum: Int, $before: String,	$after:	String){
		products(first:	$numProducts, last: $lastNum, before: $before,	after:	$after)	{
					pageInfo	{
							hasNextPage
							hasPreviousPage
					}
					edges	{
							cursor
							node	{
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

	const limit = 5;

	const [pageState, setPageState] = useState({
		next: false,
		prev: false
	});

	const [pagination, setPaginationState] = useState({
		first: limit,
		last: null,
		before: null,
		after: null
	})

  const updateText = useCallback(
    (value) => {
      setInputValue(value);
      if (value === '') {
        setOptions(deselectedOptions);
        return;
			}

      const filterRegex = new RegExp(value, 'i');
      const resultOptions = deselectedOptions.filter((option) =>
        option.label.match(filterRegex),
      );
      setOptions(resultOptions);
    },
    [deselectedOptions],
	);

  const updateSelection = useCallback(
    (selected) => {
      const selectedValue = selected.map((selectedItem) => {
        const matchedOption = options.find((option) => {
          return option.value.match(selectedItem);
        });
        return matchedOption && matchedOption.label;
			});

      setSelectedOptions(selected);
      setInputValue(selectedValue);
    },
    [options],
	);

  const textField = (
    <Autocomplete.TextField
      onChange={updateText}
      label="Tags"
      value={inputValue}
      prefix={<Icon source={SearchMinor} color="inkLighter" />}
      placeholder="Search"
    />
	);

	const updatePagination = useCallback(
		(element) => {
			setPageState(element);
		}
	);

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

	return (

		<Query query={GET_ALL_PRODUCTS} variables={{
			numProducts: pagination.first,
			lastNum: pagination.last,
			before: pagination.before,
			after: pagination.after,
		}}>
			{(data, loading, error) => {
				if (loading) return <div>Loading…</div>;
				if (error) return <div>{error.message}</div>;
				let product, paginationState, prevCursor, nextCursor;

				if (data.data) {
					product = data.data.products.edges;
					paginationState = data.data.products.pageInfo;

					(product).forEach((item, pos, array) => {
						if (pos == 0) {
							prevCursor = item.cursor;
						}

						if (pos == (array.length - 1)) {
							nextCursor = item.cursor;
						}
					});

					// console.log({prevCursor, nextCursor});
					updatePagination(paginationState);
					const page = pageState;

					return (
						<Card sectioned>
						{/* <Autocomplete
							options={options}
							selected={selectedOptions}
							onSelect={updateSelection}
							textField={textField}
						/> */}
							<ResourceList
								resourceName={{ singular: 'Product', plural: 'Products' }}
								items={product}
								renderItem={(item) => {
									// console.log('item', item.node.images.edges);

									let imageSrc, imageAlt;
									const productItem = item.node;
									const pageCursor = item.cursor;

									(productItem.images.edges).forEach(element => {
										imageSrc = element.node.originalSrc;
										imageAlt = element.node.altText;
									});

									return (
										<ResourceItem
											// id={id}
											// url={url}
											media={<Thumbnail source={imageSrc} />}
											// accessibilityLabel={`View details for ${name}`}
										>
											<div className='float-right'>
												<Badge>
													No Metafields
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

							<Pagination
								hasPrevious={ page.hasPreviousPage }
								onPrevious={() => {
									console.log('Previous');
									prevPage(prevCursor);

								}}
								hasNext={ page.hasNextPage }
								onNext={() => {
									console.log('Next');
									nextPage(nextCursor);
								}}
							/>
						</Card>
					)

				} else {
					return (
						<div> No items found</div>
					)
				}
			}}
		</Query>

  );
}

export default SearchBar;
