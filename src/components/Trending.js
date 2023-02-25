import React from 'react';
import Toolbox from './Toolbox';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const Trending = ({result}) => {
  return (
    <div className='trending-item widget-item_content'>
        <p className='trending-item_heading'>{result.heading}</p>
        <div className='trending-item_content'>
            <div className='trending-content_text'>
                <h6 className='trending-content_desc'>{result.description}</h6>
                <p className='trending-content_tag'>Trending with
                {result.tags.map((tag, index) => <span key={index}>{` ${tag}`}</span>)}</p>
            </div>
            {result.img ? <img src={result.img} alt='' className='trending-image'/>
            : <Toolbox tip='More' Icon={MoreHorizIcon} handleOnClick={() => console.log('more')}/>}
        </div>
    </div>
  )
}

export default Trending