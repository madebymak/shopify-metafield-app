import { EmptyState, Layout, Page, Card, Heading, Autocomplete, Icon } from '@shopify/polaris';
import { ResourcePicker, TitleBar } from '@shopify/app-bridge-react';
import store from 'store-js';
import ResourceListWithProducts from '../components/ResourceList';
import SearchBar from '../components/Searchbar';
import ResourceProduct from '../components/ResourceProduct';


const img = 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg';

class Index extends React.Component {
	state = { open: true };

	test = (props) => { 
		console.log({props});
	}

  render() {
		const emptyState = !store.get('ids');
		let test= 'test';

		return (
			<Page>
				<Heading>
					{/* Search Products */}
				</Heading>
				<SearchBar name='test' />
			</Page>

      // <Page
      //   primaryAction={{
      //     content: 'Select products',
      //     onAction: () => this.setState({ open: true }),
      //   }}
			// >
      //   <ResourcePicker
      //     resourceType="Product"
      //     showVariants={false}
      //     open={this.state.open}
      //     onSelection={(resources) => this.handleSelection(resources)}
      //     onCancel={() => this.setState({ open: false })}
      //   />
      //   {emptyState ? (
      //     <Layout>
      //       <EmptyState
      //         heading="Discount your products temporarily"
      //         action={{
      //           content: 'Select products',
      //           onAction: () => this.setState({ open: true }),
      //         }}
      //         image={img}
      //       >
      //         <p>Select products to change their price temporarily.</p>
      //       </EmptyState>
      //     </Layout>
      //   ) : (
      //       <ResourceListWithProducts />
      //     )}
      // </Page>
    );
  }

	handleSelection = (resources) => {
		const idsFromResources = resources.selection.map((product) => product.id);

		this.setState({ open: false })
		store.set('ids', idsFromResources);
  };
}

export default Index;