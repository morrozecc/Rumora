import { DetailedHTMLProps, HTMLAttributes } from 'react';
import ImgTag from '../ImgTag/ImgTag';
import styles from './Loading.module.css';
import LoadingImage from './loading.png';

export interface LoadingProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>{}

export default function Loading({ ...props}: LoadingProps) {
    
    return (
        <div className={styles.loading} {...props}>
            <div className={styles.imgWrapper}>
                <ImgTag src={LoadingImage} alt='Loading'/>
            </div>
        </div>
    );
}