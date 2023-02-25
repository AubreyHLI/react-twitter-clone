import React from 'react';
import './Toolbox.css';

const Toolbox = ({Icon, stati, tip, handleOnClick}) => {
  return (
    <div className={`toolbox ${tip}`} onClick={handleOnClick}>
        <div className='iconBox'>
            <Icon className='icon'/>
            <span className='tooltip'>{tip}</span>
        </div>
        {stati > 0 && <span className='stati'>{stati}</span>}
    </div>
  )
}

export default Toolbox