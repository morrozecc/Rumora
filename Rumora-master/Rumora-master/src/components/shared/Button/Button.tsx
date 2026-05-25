import classNames from 'classnames';
import styles from './Button.module.css';
import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react';

export interface ButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    children: ReactNode,
    background: 'grad' | 'primary' | 'ghost',
    className?: string,
}

export default function Button({ children, background, className, ...props }: ButtonProps) {

    return (
        <button className={classNames(styles.button, className, {
            [styles.grad]: background === 'grad',
            [styles.primary]: background === 'primary',
            [styles.ghost]: background === 'ghost',
        })} {...props}>
            {children}
        </button>
    );
}