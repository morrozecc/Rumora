import styles from './LoginForm.module.css';
import { DetailedHTMLProps, HTMLAttributes } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router";
import Input from '@/components/shared/Input/Input';
import Button from '@/components/shared/Button/Button';
import { IUserData } from '@/interfaces';

export interface LoginFormProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> { }

type Login = {
    username: string
    password: string
}

export default function LoginForm({ ...props }: LoginFormProps) {

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Login>();

    const onSubmit: SubmitHandler<Login> = async (data, e) => {
        e?.preventDefault();
        try {
            const loginRes = await fetch(`${process.env.REACT_APP_SERVER}/api/auth/login`, {
                method: 'POST',
                body: JSON.stringify({
                    username: data.username,
                    password: data.password
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!loginRes.ok) { 
                const errorText = await loginRes.text();
                throw new Error(`Ошибка входа: ${loginRes.status} - ${errorText}`);
            }
            
            const userData: IUserData = await loginRes.json();
            console.log('loginData:', userData);
            if (userData && userData.token && userData.role && userData.username) {
                localStorage.setItem('userToken', userData.token);
                localStorage.setItem('userRole', userData.role);
                localStorage.setItem('userName', userData.username);
                console.log(
                    localStorage.getItem('userToken'),
                    localStorage.getItem('userName'),
                    localStorage.getItem('userRole')
                )
            }
            

            navigate("/");

        } catch (error) {
            console.log(error)
        }
        
    };


    return (
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                
                <Input type='text'
                    placeholder='Введите имя пользователя'
                    label='Имя пользователя'
                    {...register("username", { required: true })}
                />
                {errors.username && <span className={styles.err}> Заполните поле </span>}
                
                <Input type='password'
                    haveButton
                    placeholder='Введите пароль'
                    label='Пароль'
                    {...register("password", {
                        required: true,
                        minLength: { value: 8, message: 'Длина пароля не менее 8 символов' }
                    })}
                />
                {errors.password && <span className={styles.err}> Заполните поле </span>}
                
                <Button background='grad' type='submit'> Войти </Button>

            </form>
    );
}