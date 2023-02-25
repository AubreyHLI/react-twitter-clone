import React from 'react';
import './Widgets.css';
import trendingData from '../api/trendingData.json';
import followData from '../api/followData.json';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Trending from './Trending';
import Follow from './Follow';

const Widgets = () => {

  return (
	<div className='widgets'>
		{/* Search Bar */}
		<div className='widgets-header'>
			<div className='searchBox'>
				<input type='text' className='search-input' placeholder='Search Twitter'/>
				<SearchOutlinedIcon className='search-icon'/>
			</div>
		</div>

		<div className='widgets-item trend-container'>
			<h2 className='widgets-item_header trend-container-header'>Trending now</h2>
			{ trendingData.map((result, index) => 
			<Trending key={index} result={result}/>
			)}
			<button className='showMoreBtn'>
			Show more
			</button>
		</div>

		<div className='widgets-item follow-container'>
			<h2 className='widgets-item_header follow-container-header'>Who to follow</h2>
			{ followData.map((result, index) => 
			<Follow key={index} result={result}/>
			)}
			<button className='showMoreBtn'>
			Show more
			</button>
		</div>

	</div>
  )
}

export default Widgets