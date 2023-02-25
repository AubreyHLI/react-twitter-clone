import React, {useState, useRef, useImperativeHandle} from 'react';
import './TweetBox.css';
import { Avatar } from '@mui/material';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import CloseIcon from '@mui/icons-material/Close';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import GifBoxOutlinedIcon from '@mui/icons-material/GifBoxOutlined';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import Toolbox from './Toolbox';
import { useAuth } from '../utils/auth';
// import { db, storage } from '../firebase';
// import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
// import { getDownloadURL, ref, uploadString } from 'firebase/storage';


const TweetBox = React.forwardRef((props, formRef) => {
    const [userInput, setUserInput] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [showEmojis, setShowEmojis] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const filePickerRef = useRef(null);
    const textareaRef = useRef();
    const userAuth = useAuth();
    
    useImperativeHandle(formRef, () => {
        return {
            focusTextarea: () => textareaRef.current.focus(),
            resetTextarea: () => {
                setIsLoading(false);
                setUserInput("");
                setSelectedFile(null);
                setShowEmojis(false);
            },
        }
    }, [])

    const handleKeyup = () => {
        let prevH =  textareaRef.current.style.height;
        textareaRef.current.style.height ='auto';
        let scHeight = textareaRef.current.scrollHeight;
        if(prevH !== scHeight) {
            textareaRef.current.style.height = `${scHeight}px`;
        }
    }

    const addImg = e => {
        const reader = new FileReader();
        if(e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
        }
        reader.onload = (event) => {
            setSelectedFile(event.target.result);
        }
    }

    const addEmoji = e => {
        let sym = e.unified.split("-");
        let codesArray = [];
        sym.forEach( el => codesArray.push("0x" + el) );
        let emoji = String.fromCodePoint(...codesArray);
        setUserInput(prevInput => prevInput + emoji);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(isLoading) return;
        else setIsLoading(true);

        props.sendForm(userInput, selectedFile)
        .then((response) => {
            // reset
            setIsLoading(false);
            setUserInput("");
            setSelectedFile(null);
            setShowEmojis(false);
        });
    }


    /*
    const sendPost = async () => {
        if(isLoading) return;
        else setIsLoading(true);

        const docRef = await addDoc(collection(db, 'posts'), {
            userId: userAuth.currentAccount.userId,
            username: userAuth.currentAccount.username,
            userImg: userAuth.currentAccount.userImage,
            userEmail: userAuth.currentAccount.Email,
            usertag: userAuth.currentAccount.tag,
            text: userInput,
            timestamp: serverTimestamp(),
        });

        const imageRef = ref(storage, `posts/${docRef.id}/image`);

        // if selected image, upload the image as string to firebase storage
        // @storage Reference: imageRef, @storage value: selectedFiles, @format of the string to upload: 'data_url'
        if(selectedFile) {
            await uploadString(imageRef, selectedFile, 'data_url').then( async () => {
                const downloadURL = await getDownloadURL(imageRef);
                // after getting the url of image form firebase storage, update a fields of firebase databse
                await updateDoc(doc(db, 'posts', docRef.id), {
                    image: downloadURL,
                })
            })
        }

        // reset
        setIsLoading(false);
        setUserInput("");
        setSelectedFile(null);
        setShowEmojis(false);
    }*/

    return (
        <div className={`tweetBox ${isLoading && 'disabled'}`} >
            {/* <Avatar alt='' src={userAuth.currentAccount?.userImage} className='avatar'>{userAuth.currentAccount?.username === '' ? null : userAuth.currentAccount?.username.charAt(0)}</Avatar> */}
            <Avatar alt='' src={userAuth.currentAccount?.userImage} className='avatar' />
            <form ref={formRef}>
                <div className='tweetBox_inputBox'>
                    <div className='tweetBox_input_container'>
                        <textarea 
                            placeholder={props.placeholder} required 
                            ref={textareaRef}
                            onKeyUp={handleKeyup}
                            value={userInput}
                            onChange={ e => setUserInput(e.target.value)}
                        />
                    </div>
                    { selectedFile && 
                    <div className='tweetBox_image_container'>
                        <div className='close_btn' onClick={() => setSelectedFile(null)}>
                            <CloseIcon />
                        </div>
                        <img src={selectedFile} alt=""/>
                    </div> }
                    { props.chooseAudience && 
                    <div className='privacy-container'>
                        <div className='privacy'>
                            <PublicOutlinedIcon /><span>Everyone can reply</span>
                        </div>
                    </div>}
                </div>
                { !isLoading &&
                <div className="attachment-container">
                    <ul className="attachment-options">
                        <li>
                            <Toolbox tip='Media' Icon={ImageOutlinedIcon} handleOnClick={() => filePickerRef.current.click()}/>
                            <input type='file' ref={filePickerRef} onChange={addImg} className='hidden' />
                        </li>
                        <li><Toolbox tip='GIF' Icon={GifBoxOutlinedIcon} handleOnClick={() => console.log('gif')}/></li>
                        <li>
                            <Toolbox tip='Emoji' Icon={EmojiEmotionsOutlinedIcon} handleOnClick={() => setShowEmojis(!showEmojis)}/>
                            { showEmojis && (
                            <div className='emoji_picker'>
                                <Picker data={data} onEmojiSelect={addEmoji} previewPosition='none' navPosition='bottom' maxFrequentRows='2'/>
                            </div>) }
                        </li>
                        <li><Toolbox tip='Location' Icon={LocationOnOutlinedIcon} handleOnClick={() => console.log('location')}/></li>
                    </ul>
                    <button type="submit" className={`submitBtn ${!userInput.trim() && !selectedFile ? 'disabled' : null}`} 
                        onClick={handleSubmit}>{ props.btnText }</button>
                </div>
                }
            </form>
        </div>
    )
});

export default TweetBox;