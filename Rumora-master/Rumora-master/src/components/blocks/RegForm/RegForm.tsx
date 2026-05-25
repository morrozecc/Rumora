import styles from './RegForm.module.css';
import { DetailedHTMLProps, HTMLAttributes} from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router";
import Input from '@/components/shared/Input/Input';
import Button from '@/components/shared/Button/Button';
import { IUserData } from '@/interfaces';

export interface RegFormProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> { }

type RegData = {
    username: string
    password: string
    confPassword: string
}

export default function RegForm({ ...props }: RegFormProps) {

    let navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegData>();

    const onSubmit: SubmitHandler<RegData> = async (data, e) => {
        e?.preventDefault();
        try {
            const regRes = await fetch(`${process.env.REACT_APP_SERVER}/api/auth/register`, {
                method: 'POST',
                body: JSON.stringify({
                    username: data.username,
                    password: data.password
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!regRes.ok) { 
                const errorText = await regRes.text();
                throw new Error(`Ошибка регистрации: ${regRes.status} - ${errorText}`);
            }

            console.log('regData:', regRes);

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
            }
            
            navigate("/");

        } catch (error) {
            console.log(error)
        }
        
    };
    
    const password = watch("password");

    return (
        <form method='post' action='' className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            
            <Input type='text'
                placeholder='Введите имя пользователя'
                label='Имя пользователя'
                {...register("username", { required:'Заполните поле' })}
            />
            {errors.username && <span className={styles.err}> {errors.username.message} </span>}
            
            <Input type='password'
                haveButton
                placeholder='Введите пароль'
                label='Пароль'
                {...register("password", {
                    required: 'Заполните поле',
                    minLength: {value: 8, message: 'Длина пароля не менее 8 символов'}
                    })}
            />
            {errors.password && <span className={styles.err}> {errors.password.message} </span>}

            <Input type='password'
                placeholder='Подтвердите пароль'
                label='Подтверждение пароля'
                {...register("confPassword", {
                    required: true,
                    validate: {
                        mathes: (value: string) => value === password || 'Пароли не совпадают'
                    }
                })}
                
            />
            {errors.confPassword && <span className={styles.err}> {errors.confPassword.message} </span>}

            <Button background='grad' type='submit'> Зарегистрироваться </Button>

        </form>
    );
}