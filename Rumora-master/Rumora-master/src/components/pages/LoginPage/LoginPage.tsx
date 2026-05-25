import styles from './LoginPage.module.css';
import ImgTag from '@/components/shared/ImgTag/ImgTag';
import { DetailedHTMLProps, HTMLAttributes } from 'react';
import Logo from './logo.svg';
import { useLocation, Outlet, Link } from 'react-router';

export interface LoginPageProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {}


export default function LoginPage({ ...props }: LoginPageProps) {

    const location = useLocation();
    const formType: 'reg' | 'login' = location.pathname.includes('reg') ? 'reg' : 'login';


    const tip = formType === 'login' ?
        { span: "Нет аккаунта?", a: "Зарегистрируйтесь", link: "/reg" } :
        { span: "Есть аккаунт?", a: "Войти", link: "/login" };
    
    
    return (
        <main className={styles.loginPage} {...props}>
            <div className={styles.login}>
            <ImgTag src={Logo} />
            <h1 className={styles.h1}>Rumora</h1>
            
            <Outlet />

            <div className={styles.tip}>
                <span>
                    {tip.span}
                </span>
                <Link to={tip.link}>
                    {tip.a}
                </Link>
            </div>
        </div>
        </main>
    );
}
