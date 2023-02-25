import React, {useState} from 'react';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
import { Outlet } from "react-router-dom";


const SharedMainLayout = () => {
	const [showAccountChange, setShowAccountChange] = useState(false);

	return (
		<div className='app'>
			<div className={`sidebar-container ${showAccountChange && 'disable-scroll'}`}>
				<Sidebar showAccountChange={showAccountChange} setShowAccountChange={setShowAccountChange}/>
			</div>
			<Outlet /> 
			<Modal />
		</div> 
	)
};

export default SharedMainLayout;


