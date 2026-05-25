import ImgTag from "../ImgTag/ImgTag";
import MenuImg from './menu.svg';
import ExitImg from './exit.svg';
import UserImg from './user.png';
import BackImg from './back.png';
import DeleteImg from './delete.png';
import EditImg from './edit.png';
import Send from './send.png';
import UserEditImg from './userEdit.png';
import styles from './NavButton.module.css';
import classNames from "classnames";
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

export interface NavButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    className?: string,
    purpose: 'exit' | 'menu' | 'user' | 'back' | 'edit' | 'delete' | 'userEdit' | 'send',
    onClick(): void
}

export default function NavButton({ className, purpose, onClick, ...props }: NavButtonProps) {
    
    const iconSrc = (() => {
        switch (purpose) {
            case "exit": return ExitImg;
            case "menu": return MenuImg;
            case "user": return UserImg;
            case "back": return BackImg;
            case "edit": return EditImg;
            case "delete": return DeleteImg;
            case "userEdit": return UserEditImg;
            case "send": return Send;
        }
    })()
    
    return (
        <button
            className={classNames(styles.button, className)}
            aria-label={purpose}
            onClick={onClick}
            {...props}>
            <ImgTag src={iconSrc} alt={`${purpose} icon`}/>
        </button>
    );
}