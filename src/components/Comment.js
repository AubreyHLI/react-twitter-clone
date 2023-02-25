import React, { useState, useEffect } from 'react';
import './Comment.css';
import { Avatar } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Moment from 'react-moment';
import Toolbox from './Toolbox';
import { db, storage } from '../firebase';
import { ref, deleteObject } from "firebase/storage";
import { collection, deleteDoc, doc, onSnapshot, setDoc } from "@firebase/firestore";


const Comment = ({id, comment, currentAccount, IdOfPost}) => {
    const [likes, setLikes] = useState([]);
    const [isLiked, setIsLiked] = useState(false);


	// set likes
    useEffect(() => {
        onSnapshot( collection(db, "posts", IdOfPost, "comments", id, "likes"), snapshot => {
            setLikes(snapshot.docs)
        })
    }, [db, id]);


    // set isLiked
    useEffect(() => {
        const i = likes.findIndex(l => l.id === currentAccount?.userId);
        setIsLiked( i > -1);
    }, [currentAccount, likes]);


	const handleDeleteComment = e => {
        e.stopPropagation();
        if(comment?.image) {
        deleteObject(ref(storage, `posts/${IdOfPost}/comments/${id}/image`))
            .then(() => {
                console.log('image delated successfully:', id);
            }).catch((error) => {
                alert(error.message);
            });
        } 
        deleteDoc(doc(db, "posts", IdOfPost, "comments", id));
        console.log('delete comment');
    }


    const handleLikeComment = async () => {
        if (isLiked) {  //if is already liked, click to unlike the post
          await deleteDoc(doc(db, "posts", IdOfPost, "comments", id, "likes", currentAccount?.userId));
        } else {
          await setDoc(doc(db, "posts", IdOfPost, "comments", id, "likes", currentAccount?.userId), {
            username: currentAccount?.username
          });
        }
    };


    return (
      <div className='commentInfo'>
          <div className="post_avatar">
              	<Avatar alt="" src={comment?.userImg} className='avatar' />
          </div>
          <div className="post_content">
				<div className="post_header">
					<div className="post_user">
						<h3 className="post_username">{comment?.username}<VerifiedIcon className="post_badge"/></h3>
						<div className="post_details">
							<span className="post_usertag">
								@{comment?.usertag}
							</span> 
							<span className="post_dot">·</span>
							<span>
								<Moment fromNow>{comment?.timestamp?.toDate()}</Moment>
							</span>
						</div>
					</div>
				</div>
				<div className="comment_body">
					<div className="post_body">
						<div className='post_text'>
							<p>{comment?.comment}</p>
						</div>
						{ comment?.image && 
						<img src={comment?.image} alt='' className={`post_img`}/>}
					</div>
					<div className='comment_like'>
						<Toolbox tip={isLiked ? 'UnLike' : 'Like'} 
							Icon={isLiked ? FavoriteIcon : FavoriteBorderIcon} 
							handleOnClick={handleLikeComment}/>
					</div>
				</div>
				<div className='comment_stati'>
					{ likes.length > 0 &&
					<p>{likes.length} like{likes.length > 1 &&'s'}</p>}
					{ currentAccount?.userId === comment?.userId &&
					<p className='comment_delete' onClick={handleDeleteComment}>Delete</p>}
				</div>
          </div>
      </div>
    )
}

export default Comment