import { DetailedHTMLProps, ImgHTMLAttributes } from "react";
import styles from './ImgTag.module.css';
import classNames from "classnames";

export interface ImgTagProps extends DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>{
    src: string,
    alt?: string,
    classNames?: string,
}

export default function ImgTag({src, alt = 'Error to load image', className, ...props} : ImgTagProps ) {

    return (
        <img className={classNames(styles.image, className)} src={src} alt={alt} {...props} />
    );
}