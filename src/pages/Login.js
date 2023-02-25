import React, {useEffect} from 'react';
import './UserAuth.css';
import CloseIcon from '@mui/icons-material/Close';
import TwitterIcon from '@mui/icons-material/Twitter';
import Input from '../components/Input';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { inputInfoState } from '../atoms/userAuthAtom';
import { useAuth } from '../utils/auth';


const Login = () => {
    const [inputInfo, setInputInfo] = useRecoilState(inputInfoState);
    const navigate = useNavigate();
    const userAuth = useAuth();

    useEffect(() => {
        setInputInfo(i => ({...i, email: "", password: "", confirmedPW: "", username: "", selectedFile: null, tag: "" }));
    }, []);


    const handleLogin = async () => {
        try{
            const loginResponse = await signInWithEmailAndPassword(auth, inputInfo.email, inputInfo.password);
            const user = loginResponse.user; 
            alert('Successfully log in!') ;
            userAuth.updateProfileId(user.displayName);
            navigate('/', { replace: true });
        } catch(error) {
            alert(error.message);
        }
    }


    return (
        <div className='userAuth-container'>
            <Link to='/'>Home</Link>
            <div className="userAuth_header">
            {/* <img className='cat-icon' src='/images/cat.png' alt=''/> */}
            <TwitterIcon className='userAuth_twitter-icon'/>
            </div>
            <div className='userAuth-form'>                
                <h1 className="userAuth-form_heading"> Log in to Twitter</h1>
                <form>
                    <Input type='email' id='email' inputName='email' placeholder='Email' />
                    <Input type='password' id='password' inputName='password' placeholder='Password' />
                </form>
                <button className='userAuth-btn' onClick={handleLogin}>Log in</button>
                <div className='switch-link'>
                    <p>Don't have an account ?<Link to='/Signup'>Sign up</Link></p>
                </div>
            </div>
        </div>
    )
}

export default Login;