import React from 'react';
import { Avatar } from '@mui/material';

const Follow = ({result}) => {
  return (
    <div className='follow-item widget-item_content'>
      <Avatar src={result.userImg} alt='' className='avatar'/>
      <div className='follow-item_content'>
        <h4 className='follow-content_name'>{result.username}</h4>
        <h5 className='follow-content_tag'>{result.tag}</h5>
      </div>
      <button className='follow-item_btn'>Follow</button>
    </div>
  )
}

export default Follow;
