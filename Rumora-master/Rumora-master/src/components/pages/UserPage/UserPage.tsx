import styles from './UserPage.module.css';
import { DetailedHTMLProps, HTMLAttributes, useEffect, useState } from 'react';
import Button from '@/components/shared/Button/Button';
import NavButton from '@/components/shared/NavButton/NavButton';
import Song from '@/components/shared/Song/Song';
import { IUserData, SongData } from '@/interfaces';
import { useNavigate } from 'react-router';

export interface UserPageProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {}

export default function UserPage({ ...props }: UserPageProps) {

    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [userData, setUserData] = useState<IUserData | undefined>(undefined);
    const [favorites, setFavorites] = useState<SongData[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('userToken') ?? undefined;
        const username = localStorage.getItem('userName') ?? undefined;
        const role = localStorage.getItem('userRole') as 'Admin' | 'User' | 'Moder' | undefined ?? undefined;
        setUserData( { username, role, token})
        setIsLoggedIn(!!token);
    }, []);

    useEffect(() => {
        if (!userData?.token) return;

        fetch(`${process.env.REACT_APP_SERVER}/api/favorites`, {
        headers: {
            'Authorization': `Bearer ${userData.token}`,
            'Content-Type': 'application/json',
        },
        })
        .then(async (res) => {
            if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Ошибка ${res.status}: ${errorText}`);
            }
            return res.json();
        })
        .then((data: SongData[]) => {
            setFavorites(data);
        })
        .catch((err) => {
            console.error('Ошибка загрузки избранного:', err);
        });
    }, [userData?.token]);

    const exitHandler = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');

        navigate('/login');
    }

    if (!userData) {
        return <div>Перенаправление...</div>;
    }

    return (
        <main className={styles.userPage} {...props}>
            <NavButton className={styles.nav} purpose='back' onClick={() => navigate("/")} />
            <div className={styles.action}>
                {(userData && (userData.role === 'Admin' || userData.role === 'Moder')) && <Button background='ghost' onClick={() => navigate('/songs/add')}>Добавить трек</Button>}
                <Button background='ghost' onClick={exitHandler}>Выход</Button>
            </div>

            <div className={styles.userInfo}>
                <div className={styles.userName}>{userData ? userData.username : '?'}</div>
                {isLoggedIn ?  <NavButton className={styles.userEdit} purpose='userEdit' onClick={() => navigate('/user/edit')}/> : null}
                <div className={styles.userId}>{ `Ваша роль: ${userData ? userData.role : '?'}`}</div>
            </div>
            
            <div className={styles.wrapper}>
                <h1 className={styles.h1}>Избранная музыка</h1>
                <div className={styles.musicContainer}>
                    <div className={styles.musicContainerInner}>
                        {favorites.length > 0 ? (
                            favorites.map((song) => (
                            <Song
                                key={song.songId}
                                title={song.songName}
                                    group={song.authorName}
                                    image={song.songCover}
                                    src={`songs/${song.songId}`}
                            />
                            ))
                        ) : (
                            <div className={styles.empty}>Лайкайте треки - и они появятся в вашем Избранном!</div>
                        )}
                    </div>
                </div>
            </div>

        </main>
    );
}
