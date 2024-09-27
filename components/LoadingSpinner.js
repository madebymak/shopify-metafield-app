import {
	Spinner
} from '@shopify/polaris';

const LoadingSpinner = () => { 
	return (
		<div className='text-center margin-32'>
			<Spinner accessibilityLabel='loading icon' size='large' color='inkLightest' />
		</div>
	)
}

export default LoadingSpinner;