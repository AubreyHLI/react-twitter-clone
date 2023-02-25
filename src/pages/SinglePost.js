import React, { useState, useEffect } from 'react';
import './SinglePost.css';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Toolbox from '../components/Toolbox';
import Post from '../components/Post';
import { useAuth } from '../utils/auth';
import { useParams } from "react-router-dom";
import { useRecoilState } from 'recoil';
import { backHomeState } from '../atoms/locationAtom';
import { db } from '../firebase';
import { collection, onSnapshot, orderBy, query, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Comment from '../components/Comment';
import Widgets from '../components/Widgets';


const SinglePost = () => {
    let { IdOfPost } = useParams();  // 用{ } destructure 是因为useParams() returns an object
    const [backHome, setBackHome] = useRecoilState(backHomeState);
    const [post, setPost] = useState();
    const [comments, setComments] = useState([]);
    const userAuth = useAuth();
    const navigate = useNavigate();


    useEffect(() => {
        onSnapshot(doc(db, "posts", IdOfPost), snapshot => {
            setPost(snapshot.data());
        })
    }, [db, IdOfPost]);

    useEffect(() => {
        onSnapshot( query(collection(db, "posts", IdOfPost, "comments"), orderBy("timestamp", "desc")), snapshot => {
            setComments(snapshot.docs)
        })
    }, [db, IdOfPost]);


    const handleClickBack = () => {
        setBackHome(true);
        navigate(-1);
    }

    return (
    <>
        <div className='main-container'>
            <div className='singlePost main'>
                {/* Header */}
                <div className='main-header'>
                    <Toolbox tip='Top Tweets' Icon={KeyboardBackspaceIcon} handleOnClick={handleClickBack}/>
                    <h2>Tweet</h2>                            
                </div>
                
                {/* Post */}
                <Post id={IdOfPost} post={post} currentAccount={userAuth.currentAccount} postPage />

                {/* Comments */}
                <div className='comments-container'>
                    <div className='comments_header'>
                        <h4>Comments: {comments.length}</h4>
                    </div>
                    { comments.length > 0 && 
                    <div className="comments">
                    { comments.map( c => (
                        <Comment key={c.id} id={c.id} comment={c.data()} 
                            currentAccount={userAuth.currentAccount} IdOfPost={IdOfPost}/>
                    ))}
                    </div>
                    }
                </div>
            </div>
        </div>
        <div className='widget-container'>
            <Widgets />
        </div>
    </>  
    )
}

export default SinglePost