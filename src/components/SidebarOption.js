import React from 'react';
import './SidebarOption.css';
import { Link } from 'react-router-dom';

const SidebarOption = ({isActive, label, Icon, isHidden, path}) => {
  return (
    <div className={`sidebarLink ${label} ${isActive && 'sidebarOption-active'} ${isHidden && 'sidebaroption-hide'}`} >
      <Link to={path}>
        <div className="sidebarOption">
          <Icon className="icon"/>
          <h2>{label}</h2>
        </div>
      </Link>  
    </div>
  )
}

export default SidebarOption