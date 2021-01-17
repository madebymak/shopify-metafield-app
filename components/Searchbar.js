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
	Thumbnail
} from '@shopify/polaris';
import { SearchMinor } from '@shopify/polaris-icons';
import storeEngine from 'store-js/src/store-engine';

const GET_PRODUCT_BY_HANDLE = gql`
	query	($numProducts:	Int!,	$cursor:	String){
			products(first:	$numProducts,	after:	$cursor)	{
					pageInfo	{
							hasNextPage
							hasPreviousPage
					}
					edges	{
							cursor
							node	{
									title
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

	const paginationLimit = 10;
	const paginationCursor = '';

	return (
		<Query query={GET_PRODUCT_BY_HANDLE} variables={{ numProducts: paginationLimit }}>
			{(data, loading, error) => {
				console.log(1, data);
				let product;

				if (data.data) {
					product = data.data.products.edges;

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

									let { imageSrc, imageAlt } = '';

									(item.node.images.edges).forEach(element => {
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
											<h3>
												<TextStyle variation="strong">{item.node.title}</TextStyle>
											</h3>
										</ResourceItem>
									);
								}}
								hasMoreItems={true}
							/>
						</Card>
					)

				} else {
					return (
						<div> No items </div>
					)
				}
			}}
		</Query>

  );
}

export default SearchBar;