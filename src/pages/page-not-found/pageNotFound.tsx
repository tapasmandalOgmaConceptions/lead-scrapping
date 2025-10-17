import React from "react";
import styles from './pageNotFound.module.scss';

const PageNotFound = () =>{

    return (
        <>
            <div className={styles.pageNotFoundBdyPrt}>
                <div className={styles.container}>
                    <div className={styles.pageNotFoundContentArea}>
                        <img src='images/404-img.png' alt='404-image' />
                        <h2>404 - Page Not Found</h2>
                        <p>The page you are looking for does not exist.</p>
                    </div>
                </div>
            </div>
        </>
        
    )
}
export default PageNotFound;