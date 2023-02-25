import React, {useState, useEffect, useRef} from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';
import CloseIcon from '@mui/icons-material/Close';
import VerifiedIcon from '@mui/icons-material/Verified';
import { Avatar } from '@mui/material';
import { db, storage } from '../firebase';
import { addDoc, collection, doc, serverTimestamp, updateDoc, onSnapshot } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { useRecoilState } from 'recoil';
import { modalState, postIdState } from '../atoms/modalAtom';
import { useAuth } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import TweetBox from './TweetBox';
import Moment from 'react-moment';


const CommentModal = (props) => {
    const [isOpen, setIsOpen] = useRecoilState(modalState);
    const [postId, setPostId] = useRecoilState(postIdState);
    const [post, setPost] = useState();
    // const [comment, setComment] = useState("")
    const formRef = useRef();
    const userAuth = useAuth();
    const navigate = useNavigate();


    useEffect(() => {
        if(postId){
            onSnapshot(doc(db, "posts", postId), snapshot => {
                setPost(snapshot.data());
            })
        }
    }, [postId]);


    useEffect(() => {
        if(isOpen) {
            formRef.current.focusTextarea();
            document.body.style.overflow = 'hidden';  // lock the scroll of home page
        } else {
            formRef.current.resetTextarea();
            document.body.style.overflow = 'unset';  // unlock the scroll of home page
        }
   }, [isOpen] );


    const sendComment = async (uInput, selectedImg) => {
        const docRef = await addDoc(collection(db, "posts", postId, "comments"), {
            comment: uInput,
            userId: userAuth.currentAccount.userId,
            username: userAuth.currentAccount.username,
            userImg: userAuth.currentAccount.userImage,
            userEmail: userAuth.currentAccount.Email,
            usertag: userAuth.currentAccount.tag,
            timestamp: serverTimestamp(),
        });
        const imageRef = ref(storage, `posts/${postId}/comments/${docRef.id}/image`);
        if(selectedImg) {
            await uploadString(imageRef, selectedImg, 'data_url').then( async () => {
                const downloadURL = await getDownloadURL(imageRef);
                // after getting the url of image form firebase storage, update a fields of firebase databse
                await updateDoc(doc(db, "posts", postId, "comments", docRef.id), {
                    image: downloadURL,
                })
            })
        }

        setIsOpen(false);
        navigate(`/${postId}`);
   };



    return ReactDOM.createPortal(
        <>
        <div className={`overlay ${!isOpen && 'hidden'}`}>
            <div className='modal'>
                <div className='modal-closebtn' onClick={() => setIsOpen(false)}><CloseIcon /></div>
                <div className='modal-content'>
                    <div className='postInfo'>
                        <div className="post_avatar">
                            {/* <Avatar alt="" src={post?.userImg} className='avatar'>{post?.username === '' ? null : post?.username}</Avatar> */}
                            <Avatar alt="" src={post?.userImg} className='avatar' />
                            <div className="connect-line">
                                <span></span>
                            </div>
                        </div>
                        <div className="post_content">
                            <div className="post_header">
                                <div className="post_user">
                                    <h3 className="post_username">{post?.username}<VerifiedIcon className="post_badge"/></h3>
                                    <div className="post_details">
                                        <span className="post_usertag">
                                            @{post?.usertag}
                                        </span> 
                                        <span className="post_dot">·</span>
                                        <span>
                                            <Moment fromNow>{post?.timestamp?.toDate()}</Moment>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="post_body">
                                <div className='post_text'>
                                    <p>{post?.text}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <TweetBox 
                        placeholder='Tweet your reply'
                        sendForm={sendComment} 
                        chooseAudience={false} 
                        btnText='Reply'
                        ref={formRef}
                    />
                </div>
            </div>
        </div>
        </>,
        document.getElementById('portal')
    );
}

export default CommentModal;