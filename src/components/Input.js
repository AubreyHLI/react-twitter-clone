import React, {useState, useEffect} from 'react';
import './Input.css';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useRecoilState } from 'recoil';
import { inputInfoState } from '../atoms/userAuthAtom';


const Input =  ({type, id, placeholder, inputName }) => {
    const [inputInfo, setInputInfo] = useRecoilState(inputInfoState);
    const [isInputActive, setIsInputActive] = useState(false);
    const [pwVisible, setPsVisible] = useState(false);

    useEffect(() => {
        if(inputInfo[inputName]) {
            setIsInputActive(true);
        } else {
            setIsInputActive(false);
        }
    },[inputInfo[inputName]])


    // Update specific input field
    const handleInputChange = e => {
        e.preventDefault();
        setInputInfo(prevState => ({
            ...prevState, 
            [e.target.name]: e.target.value
        }))
    }

    
    let inputType = type !=='password' ? type : (pwVisible ? 'text' : 'password');


    return (
        <label className='login-input'> 
            <input type={inputType} id={id} name={inputName} onChange={handleInputChange} value={inputInfo[inputName]}/>
            <span className={`placeholder ${isInputActive ? 'label_active' : 'label_inactive'}`}>{placeholder}</span>
            {type === 'password' && (
            <span className='password-eye' onClick={() => setPsVisible(prev => !prev)}>
                {!pwVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </span>
            )}
        </label>
    )
};

export default Input;