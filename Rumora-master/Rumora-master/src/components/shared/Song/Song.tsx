import classNames from 'classnames';
import styles from './Song.module.css';
import { AnchorHTMLAttributes, DetailedHTMLProps } from 'react';
import ImgTag from '../ImgTag/ImgTag';

export interface SongProps extends DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> {
    src?: string,
    image?: string,
    title?: string,
    group?: string,
    hidden?: boolean;
    className?: string,
}

export default function Song({ src, image, title = 'Название трека', group='Группа', hidden, className, ...props }: SongProps) {

    return (
        <a style={{ display: hidden ? 'none' : 'grid' }} className={classNames(className, styles.song)} href={src} {...props}>
            <div className={styles.preview} >
                {image && <ImgTag src={`${process.env.REACT_APP_SERVER}/${image}`} />}
            </div>
            <div className={styles.title}>{title}</div>
            <div className={styles.group}>{group}</div>
        </a>
    );
}