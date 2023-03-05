import { useEffect } from "react";
import { useLocation } from "react-router";
import { backHomeState } from '../atoms/locationAtom';
import { useRecoilState } from 'recoil';


const ScrollToTop = (props) => {
    const location = useLocation();
    const [backHome, setBackHome] = useRecoilState(backHomeState);    
    
    useEffect(() => {
        if(!backHome){
            window.scrollTo(0, 0);
        }
    }, [location]);

    return <>{props.children}</>
 };

export default ScrollToTop;