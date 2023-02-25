import React, { useState, useEffect } from 'react';
import './Post.css';
import { Avatar } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RepeatOutlinedIcon from '@mui/icons-material/RepeatOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import Toolbox from './Toolbox';
import { db, storage } from '../firebase';
import { ref, deleteObject } from "firebase/storage";
import { collection, deleteDoc, doc, onSnapshot, setDoc, orderBy, query } from "@firebase/firestore";
import { useRecoilState } from 'recoil';
import { modalState, postIdState } from '../atoms/modalAtom';
import { backHomeState } from '../atoms/locationAtom';
import { useNavigate } from 'react-router-dom';
import Moment from 'react-moment';



const Post = ({id, post, postPage, currentAccount, recordScrollY}) => {
    const [backHome, setBackHome] = useRecoilState(backHomeState);
    const [isOpen, setIsOpen] = useRecoilState(modalState);
    const [postId, setPostId] = useRecoilState(postIdState);
    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState([]);
    const [isLiked, setIsLiked] = useState(false);

    const navigate = useNavigate();

    // set likes
    useEffect(() => {
        onSnapshot( collection(db, "posts", id, "likes"), snapshot => {
            setLikes(snapshot.docs)
        })
    }, [db, id]);


    // set isLiked
    useEffect(() => {
        const i = likes.findIndex(l => l.id === currentAccount?.userId);
        setIsLiked( i > -1);
    }, [currentAccount, likes]);


    // set comment
    useEffect(() => {
        onSnapshot( query( collection(db, "posts", id, "comments"), orderBy("timestamp", "desc")), snapshot => {
            setComments(snapshot.docs)
        })
    }, [db, id]);


    // click comment, to open modal and set postId
    const handleClickComment = e => {
        e.stopPropagation();  //prevent click event pass to the parent
        console.log('comment');
        setPostId(id);
        setIsOpen(true);
    }

    const handleClickDelete = e => {
        e.stopPropagation();
        if(post?.image) {
        deleteObject(ref(storage, `posts/${id}/image`))
            .then(() => {
                console.log('image delated successfully:', id);
            }).catch((error) => {
                alert(error.message);
            });
        } 
        deleteDoc(doc(db, "posts", id));
        console.log('delete');
        navigate('/');
    }

    const likePost = async () => {
        if (isLiked) {  //if is already liked, click to unlike the post
          await deleteDoc(doc(db, "posts", id, "likes", currentAccount?.userId));
        } else {
          await setDoc(doc(db, "posts", id, "likes", currentAccount?.userId), {
            username: currentAccount?.username
          });
        }
    };

    const handleClickLike = e => {
        e.stopPropagation();
        console.log('like');
        likePost();
    }

    const handleClickRetweet = e => {
        e.stopPropagation();
        console.log('retweet');
    }

    const handleClickShare = e => {
        e.stopPropagation();
        console.log('share');
        const refImg = ref(storage, `posts/${id}/image`);
        console.log('refImg:', refImg);
        const refComment = ref(storage, `posts/${id}/comments`);
        console.log('refComment:', refComment);
    }

    const handleClickMore = e => {
        e.stopPropagation();
        console.log('more');
    }

    const handleClickPost = () => {
        if(!postPage) {
            recordScrollY();
            navigate(`/${ id }`);
        }
    }

  return (
    <div className={`post ${!postPage && 'post_clickable'}`} onClick={handleClickPost}>
        <div className="post_avatar">
            {/* <Avatar alt="" src={post?.userImg} className='avatar'>{post?.username === '' ? null : post?.username.charAt(0)}</Avatar> */}
            <Avatar alt="" src={post?.userImg} className='avatar' />
        </div>
        <div className="post_content">
            <div className="post_header">
                <div className={`post_user ${postPage && 'post_user-col'}`}>
                    <h3 className="post_username">{post?.username}<VerifiedIcon className="post_badge"/></h3>
                    <div className="post_details">
                        <span className="post_usertag">
                            @{post?.usertag}
                        </span> 
                        {!postPage && <>
                        <span className="post_dot">·</span>
                        <span>
                            <Moment fromNow>{post?.timestamp?.toDate()}</Moment>
                        </span></>}
                    </div>
                </div>
                <div className='post_more'>
                    <MoreHorizIcon onClick={handleClickMore}/>
                </div>
            </div>

            <div className={`post_body ${postPage && 'post_body-left'}`}>
                <div className='post_text'>
                    <p>{post?.text}</p>
                </div>
                { post?.image && 
                <img src={post?.image} alt='' className={`post_img ${postPage && 'post_img-large'}`}/>}
                { postPage &&
                <span className="post_time">
                    <Moment format="LT , MMM D, YYYY">{post?.timestamp?.toDate()}</Moment>
                </span>}
                <div className={`post_footer ${postPage && 'post_footer-full'}`}>
                    <Toolbox tip='Comment' 
                        stati={comments.length} Icon={ModeCommentOutlinedIcon} 
                        handleOnClick={handleClickComment} />
                    { currentAccount?.userId === post?.userId 
                    ? <Toolbox tip='Delete' 
                        Icon={DeleteOutlineIcon} 
                        handleOnClick={handleClickDelete}/>
                    : <Toolbox tip='Retweet' 
                        stati={0} Icon={RepeatOutlinedIcon} 
                        handleOnClick={handleClickRetweet}/>
                    }
                    <Toolbox tip={isLiked ? 'UnLike' : 'Like'} 
                        stati={likes.length} Icon={isLiked ? FavoriteIcon : FavoriteBorderIcon} 
                        handleOnClick={handleClickLike}/>
                    <Toolbox tip='Share' 
                        stati={0} Icon={ShareOutlinedIcon} 
                        handleOnClick={handleClickShare}/>
                </div>
            </div>
        </div>
    </div>

  )
}

export default Post;