import classNames from 'classnames';
import styles from './Input.module.css';
import { DetailedHTMLProps, InputHTMLAttributes, useState } from 'react';
import Hidden from './hidden.png';
import Visible from './visible.png';
import ImgTag from '../ImgTag/ImgTag';

export interface InputProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    placeholder: string;
    label?: string;
    type: 'password' | 'confPas' | 'text' | 'email';
    haveButton?: boolean
    className?: string;
}

export default function Input({ placeholder, type, haveButton = false, label, className, ...props }: InputProps) {

    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            {label && <label className={classNames(styles.label, className)}>{label}</label>}
            <div className={styles.wrapper}>
                <input type={showPassword ? 'text' : type } placeholder={placeholder} className={styles.input} {...props} />
                {haveButton &&
                    <button className={styles.button} onClick={(e) => {
                        e.preventDefault();
                        setShowPassword(!showPassword)
                    }}>
                        {<ImgTag src={showPassword ? Visible : Hidden} />}
                    </button>}
                </div>
            </>
    );
}