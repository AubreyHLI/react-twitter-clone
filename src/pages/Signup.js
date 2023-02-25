import React, {useRef, useState, useEffect} from 'react';
import './UserAuth.css';
import CloseIcon from '@mui/icons-material/Close';
import TwitterIcon from '@mui/icons-material/Twitter';
import Input from '../components/Input';
import { Avatar } from '@mui/material';
import { db, storage, auth } from '../firebase';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { createUserWithEmailAndPassword, updateProfile} from "firebase/auth";
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { inputInfoState } from '../atoms/userAuthAtom';
import { useAuth } from '../utils/auth';


const Signup = () => {
    const [inputInfo, setInputInfo] = useRecoilState(inputInfoState);
    const [hasSignup, setHasSignup] = useState(false);
    const [signupInfo, setSignupInfo] = useState({
        userId: '',
        email: ''
    });
    const filePickerRef = useRef();
    const userAuth = useAuth();
    const navigate = useNavigate();


    useEffect(()=>{
        setSignupInfo(u => ({...u, userId: '', Email: '' }));
        setInputInfo(i => ({...i, email: "", password: "", confirmedPW: "", username: "", selectedFile: null, tag: "" }));
    },[]);


    /* sign up form */
    const validatePassword = () => {
        let isValid = true;
        if (inputInfo.password !== '' && inputInfo.confirmedPW !== ''){
          if (inputInfo.password !== inputInfo.confirmedPW ) {
            isValid = false;
            alert('Passwords does not match')
          }
        }
        return isValid;
    }


    const handleSignup = async () => {
        if(validatePassword()){
        try {
            const signupResponse = await createUserWithEmailAndPassword(auth, inputInfo.email, inputInfo.password);
            const user = signupResponse.user;
            console.log('new user:', user);
            if(user) {
                alert('Successfully create an accoount!');
                setHasSignup(true);
                userAuth.updateProfileId(null);
                setSignupInfo(u => ({...u, userId: user.uid, Email: user.email}))
                console.log('set signupInfo');
            }
        } catch(error) {
            console.log(error.code);
            alert(error.message);
        }}
    }


    /* set up profile form */
    const addUserImage = e => {
        const reader = new FileReader();
        if(e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
        }
        reader.onload = e => {
            setInputInfo(prevState => ({ ...prevState, selectedFile: e.target.result }))
        }
    }

    const validateUsername = () => {
        if (inputInfo.username === '') {
            alert('Please enter username');
            return `用户${signupInfo.Email}`;
        }
        return inputInfo.username;
    }


    const sendUserInfo = async () => {
        const docRef = await addDoc(collection(db, 'profiles'), {
            userId: signupInfo.userId,
            username: validateUsername(),
            Email: signupInfo.Email,
            tag: inputInfo.tag,
        });
        await updateProfile(auth.currentUser, {displayName: docRef.id}); // link profile to user
        const imageRef = ref(storage, `profiles/${docRef.id}/image`);

        if(inputInfo.selectedFile) {
            await uploadString(imageRef, inputInfo.selectedFile, 'data_url').then( async () => {
                const downloadURL = await getDownloadURL(imageRef);
                await updateDoc(doc(db, 'profiles', docRef.id), {
                    userImage: downloadURL,
                });
            })
        } else {
            await updateDoc(doc(db, 'profiles', docRef.id), {
                userImage: null
            })
        }
        setHasSignup(false);
        userAuth.updateProfileId(docRef.id);
        navigate('/');
    }

    const clickUploadPicture = e => {
        e.preventDefault();
        filePickerRef.current.click();
    }

    return (
        <div className='userAuth-container'>
            <div className="userAuth_header">
                <TwitterIcon className='userAuth_twitter-icon'/>
            </div>
            <div className='userAuth-form'>                
                <h1 className="userAuth-form_heading"> {!hasSignup ? "Create new account" : "Next step: Set up your profile"}</h1>
                {!hasSignup
                ? <>
                    <form>
                        <Input type='email' id='email' inputName='email' placeholder='Email' />
                        <Input type='password' id='password' inputName='password' placeholder='Password' />
                        <Input type='password' id='confirmPassword' inputName='confirmedPW' placeholder='Confirm Password' />
                    </form>
                    <button className='userAuth-btn' onClick={handleSignup}>Sign up</button>
                    <div className='switch-link'>
                        <p>Already have an account ?<Link to='/Login'>Log in</Link></p>
                    </div>
                </>
                : <>
                    <form className='profileinfo-form'>
                        <div className='profileinfo-form_avatar'>
                            <Avatar alt='' src={inputInfo.selectedFile} className='profile-avatar'/>
                            <input type='file' ref={filePickerRef} onChange={addUserImage} className='hidden'/>
                            <button onClick={clickUploadPicture}>Upload a profile picture</button> 
                        </div>
                        <Input type='text' id='username' inputName='username' placeholder='Username' />
                        <Input type='text' id='tag' inputName='tag' placeholder='Tag' />
                    </form>
                    <button className='userAuth-btn' onClick={sendUserInfo}>Complete</button>
                </>}
            </div>
        </div>
    )
}

export default Signup;