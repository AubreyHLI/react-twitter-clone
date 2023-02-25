import React, { useState, useEffect, useRef } from 'react';
import './Home.css';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import { collection, onSnapshot, orderBy, query, doc, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { useAuth } from '../utils/auth';
import Toolbox from '../components/Toolbox';
import TweetBox from '../components/TweetBox';
import Post from '../components/Post';
import Widgets from '../components/Widgets';
import useLocalStorage from '../utils/useLocalStorage';
import { useRecoilState } from 'recoil';
import { backHomeState } from '../atoms/locationAtom';


const Home = () => {
    const [homeScrollY, setHomeScrollY] = useLocalStorage('homeScrollY', 0);
    const [backHome, setBackHome] = useRecoilState(backHomeState);
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const userAuth = useAuth();
    const formRef = useRef();
    

    useEffect(() => {
        onSnapshot(query(collection(db, 'posts'), orderBy("timestamp", "desc")), snapshot => {
            setPosts(snapshot.docs);
            console.log('scrollY:', homeScrollY);
        })
        console.log('scrollY:', homeScrollY);
    }, [db]);


    useEffect(() => {
        if(backHome) {
            const timer = setTimeout(() => {
                window.scrollTo(0, homeScrollY - 58);
                setIsLoading(false);
                setBackHome(false);
            }, 30);
    
            return () => clearTimeout(timer);
        }
    }, [])


    const recordScrollY = () => {
        setHomeScrollY(window.scrollY);
    }


    const sendPost = async (uInput, selectedImg) => {
        const docRef = await addDoc(collection(db, "posts"), {
            userId: userAuth.currentAccount.userId,
            username: userAuth.currentAccount.username,
            userImg: userAuth.currentAccount.userImage,
            userEmail: userAuth.currentAccount.Email,
            usertag: userAuth.currentAccount.tag,
            text: uInput,
            timestamp: serverTimestamp(),
        });
        const imageRef = ref(storage, `posts/${docRef.id}/image`);
        if(selectedImg) {
            await uploadString(imageRef, selectedImg, 'data_url').then( async () => {
                const downloadURL = await getDownloadURL(imageRef);
                // after getting the url of image form firebase storage, update a fields of firebase databse
                await updateDoc(doc(db, "posts", docRef.id), {
                    image: downloadURL,
                })
            })
        }
    }

    
    
    return (
    <>  
        <div className='main-container'>
        {/* <button onClick={() => window.scrollTo(0, homeScrollY)}>scroll to Y</button> */}
            <div className='feed main'>
                {/* Header */}
                <div className='main-header'>
                    <h2>Home</h2>
                    <Toolbox tip='Top Tweets' Icon={AutoAwesomeOutlinedIcon} handleOnClick={() => console.log('Top Tweets')}/>                            
                </div>

                <div className={`loading-overlay ${!isLoading || !backHome ? 'vis-hidden' : null}`}></div>

                {/* TweetBox */}
                <div className='tweetBox-container'>
                    <TweetBox 
                        placeholder={`What's happening?`}
                        sendForm={sendPost} 
                        chooseAudience={true} 
                        btnText='Tweet'
                        ref={formRef}
                    />
                </div>

                {/* Posts */}
                <div className='posts-container'>
                    { posts.map(p => (
                        <Post key={p.id} id={p.id} post={p.data()} 
                            currentAccount={userAuth.currentAccount}
                            recordScrollY={recordScrollY}
                        />
                    ))} 
                </div>
                {/* </div> */}
            </div>
        </div>
        <div className='widget-container'>
            <Widgets />
        </div>
    </>    
    )
}

export default Home