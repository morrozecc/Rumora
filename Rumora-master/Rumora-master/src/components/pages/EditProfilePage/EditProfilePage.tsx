import styles from './EditProfilePage.module.css';
import { DetailedHTMLProps, HTMLAttributes, useEffect } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router";
import NavButton from '@/components/shared/NavButton/NavButton';
import Input from '@/components/shared/Input/Input';
import Button from '@/components/shared/Button/Button';

export interface EditProfilePageProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> { }

type EditData = {
    username: string;
    password: string;
    confPassword: string;
}

export default function EditProfilePage({ ...props }: EditProfilePageProps) {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        setValue
    } = useForm<EditData>();

    useEffect(() => {
        const savedUsername = localStorage.getItem('userName');
        if (savedUsername) {
            setValue('username', savedUsername);
        }
    }, [setValue]);

    const onSubmit: SubmitHandler<EditData> = async (data) => {
        const token = localStorage.getItem('userToken');
        if (!token) {
            alert('Вы не авторизованы');
            return;
        }

        try {
 
            console.log(data)
            const payload: { username: string; password?: string } = {
                username: data.username
            };

            if (data.password) {
                payload.password = data.password;
            }

            const res = await fetch(`${process.env.REACT_APP_SERVER}/api/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Ошибка: ${res.status} ${errorText}`);
            }

            localStorage.setItem('userName', data.username);
            alert('Профиль успешно обновлён!');
            navigate(-1);

        } catch (error) {
            console.error(error);
            alert('Не удалось обновить профиль. Попробуйте позже.');
        }
    };

    const password = watch("password");

    return (
        <main className={styles.editProfilePage} {...props}>
            <NavButton className={styles.nav} purpose="back" onClick={() => navigate(-1)} />

            <div className={styles.edit}>
                <h1 className={styles.h1}>Редактирование профиля</h1>
                <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        type="text"
                        placeholder="Введите имя пользователя"
                        label="Имя пользователя"
                        {...register("username", { required: 'Заполните поле' })}
                    />
                    {errors.username && <span className={styles.err}>{errors.username.message}</span>}

                    <Input
                        type="password"
                        haveButton
                        placeholder="Новый пароль (необязательно)"
                        label="Пароль"
                        {...register("password", {
                            minLength: {
                                value: 8,
                                message: 'Длина пароля не менее 8 символов'
                            }
                        })}
                    />
                    {errors.password && <span className={styles.err}>{errors.password.message}</span>}

                    <Input
                        type="password"
                        placeholder="Подтвердите новый пароль"
                        label="Подтверждение пароля"
                        {...register("confPassword", {
                            validate: {
                                mathes: (value: string) => value === password || 'Пароли не совпадают'
                            }
                        })}
                    />
                    {errors.confPassword && <span className={styles.err}>{errors.confPassword.message}</span>}

                    <Button background="grad" type="submit">
                        Сохранить изменения
                    </Button>
                </form>
            </div>
        </main>
    );
}