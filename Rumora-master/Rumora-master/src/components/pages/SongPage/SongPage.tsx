import styles from './SongPage.module.css';
import ImgTag from '@/components/shared/ImgTag/ImgTag';
import { DetailedHTMLProps, HTMLAttributes, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import NavButton from '@/components/shared/NavButton/NavButton';
import { Comment, IUserData, SongData } from '@/interfaces';
import classNames from 'classnames';
import { Player } from '@/components/shared/Player/Player';

export interface UserPageProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {}

export default function SongPage({ ...props }: UserPageProps) {

    const navigate = useNavigate();
    const { songId } = useParams<{ songId: string }>();
    console.log(songId)

    const [userData, setUserData] = useState<IUserData | undefined>(undefined);
    const [songData, setSongData] = useState<SongData | undefined>(undefined);
    const [showDeleteSongConfirm, setShowDeleteSongConfirm] = useState(false);
    const [showDeleteCommentConfirm, setShowDeleteCommentConfirm] = useState(0);
    const [comment, setComment] = useState(''); 
    const [liked, setLiked] = useState(false); 

    const handleDeleteSong = async () => {
        if (!userData || !userData.token) return;
        const { token } = userData;
        
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER}/api/admin/songs/${songId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            });

            if (response.ok) {
                alert('Трек успешно удалён!');
                navigate('/');
            } else {
                alert('Ошибка при удалении трека');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при удалении трека');
        } finally {
            setShowDeleteSongConfirm(false);
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        if (!userData || !userData.token) return;
        const { token } = userData;
        
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER}/api/comments/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            });

            if (response.ok) {
                alert('Комментарий удален!');
                window.location.reload();
            } else {
                alert('Ошибка при удалении комментария');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при удалении комментария');
        } finally {
            setShowDeleteCommentConfirm(0);
        }
    };

    async function likeHandler(id: string | undefined) {
        if (!id || !userData?.token) return;

        const { token } = userData;
        const newLikedState = !liked;

        setLiked(newLikedState);

        try {
            const method = newLikedState ? 'POST' : 'DELETE';
            const res = await fetch(`${process.env.REACT_APP_SERVER}/api/favorites/${id}`, {
            method,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
            });

            if (!res.ok) {
                setLiked(!newLikedState);
                const errorMsg = newLikedState
                    ? 'Не удалось добавить трек в избранное('
                    : 'Не удалось удалить трек из избранного(';
                window.alert(errorMsg);
            }
        } catch (err) {
            setLiked(!newLikedState);
            window.alert('Ошибка сети. Попробуйте позже.');
        }
    }

    const sendComment = () => {
        if (!comment.trim()) return;
        if (!userData || !userData.token) return;

        const { token } = userData;

        fetch(`${process.env.REACT_APP_SERVER}/api/comments/${songId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ comment: comment.trim() })
        })
            .then(res => {
                if (res.ok) {
                    console.log('Комментарий отправлен');
                    setComment('');
                }
                else throw new Error(`HTTP error! status: ${res.status}`)
            })
            .catch(err => {
                console.error('Ошибка отправки комментария:', err);
            });
    };

    useEffect(() => {
        const token = localStorage.getItem('userToken') ?? undefined;
        const username = localStorage.getItem('userName') ?? undefined;
        const role = localStorage.getItem('userRole') as 'Admin' | 'User' | 'Moder' | undefined ?? undefined;
        setUserData({ username, role, token });
    }, []);

    useEffect(() => {
        
        if (!songId || !userData?.token) return;

        const { token } = userData;

        try {
            fetch(`${process.env.REACT_APP_SERVER}/api/songs/${songId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            })
                .then(res => res.json())
                .then(song => {
                    setSongData(song);
                    console.log(JSON.stringify(song), null, 2)
                        
                });
        } catch (err) {
            console.log('Ошибка загрузки информации о треке:\n', err)
        }
        
    }, [songId, userData]);

    useEffect(() => {
        if (!songId || !userData?.token) return;

        const { token } = userData;
        let isMounted = true;

        fetch(`${process.env.REACT_APP_SERVER}/api/favorites/check/${songId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        })
            .then(async (res) => {
                if (res.ok && isMounted) {
                    const isLiked = await res.json()
                    setLiked(isLiked);
                    
                } else {
                    throw new Error(`HTTP ${res.status}`);
                }
                
            })
            .catch((err) => {
                if (isMounted) {
                    console.error('Ошибка загрузки избранного:', err);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [songId, userData]);

    if (!songData) return (
        <>
            <main className={styles.songPage} {...props}>
                <div> Загрузка...</div>
            </main>
        </>
    ) 

    return (
        <main className={styles.songPage} {...props}>
            
            {showDeleteSongConfirm && (
                <div className={styles.modalOverlay} onClick={() => setShowDeleteSongConfirm(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <p>Удалить трек?</p>
                        <div className={styles.modalButtons}>
                            <button onClick={handleDeleteSong} className={styles.confirmButton}>
                            Да
                            </button>
                            <button onClick={() => setShowDeleteSongConfirm(false)} className={styles.cancelButton}>
                            Нет
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteCommentConfirm !== 0 && (
                <div className={styles.modalOverlay} onClick={() => setShowDeleteCommentConfirm(0)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <p>Удалить комментарий?</p>
                        <div className={styles.modalButtons}>
                            <button onClick={() => handleDeleteComment(showDeleteCommentConfirm)} className={styles.confirmButton}>
                            Да
                            </button>
                            <button onClick={() => setShowDeleteCommentConfirm(0)} className={styles.cancelButton}>
                            Нет
                            </button>
                        </div>
                    </div>
                </div>
            )}

            
            <NavButton
                className={styles.nav}
                purpose="back"
                onClick={() => navigate(-1)}
            />

            {(userData && (userData.role === 'Admin' || userData.role === 'Moder')) && (
                <div className={styles.action}>
                    <NavButton purpose="delete" onClick={() => setShowDeleteSongConfirm(true)}/>
                    <NavButton purpose="edit" onClick={() => navigate(`/songs/${songId}/edit`)} />
                    <NavButton purpose='user' onClick={() => {userData?.token ? navigate("/user") :  navigate("/login")}}/>
                </div>
            )}

            <div className={styles.wrapper}>
                <section className={styles.info}>
                    <ImgTag className={styles.preview} src={`${process.env.REACT_APP_SERVER}/${songData.songCover}`} alt={songData.songName} />
                    <h1 className={styles.name}>{songData.songName}</h1>
                    <div className={styles.more}>
                        <span className={styles.group}>{songData.authorName}</span>
                        <span className={styles.year}>{songData.yearOfCreation}</span>
                    </div>
                    <div className={classNames(styles.like, {
                        [styles.inviz] : !userData?.token
                    })}>
                        <svg
                            onClick={() => likeHandler(songId)}
                            className={liked ? styles.liked : ''}
                            viewBox="0 0 33 29"
                            width="33"
                            height="29"
                            >
                            <path
                                d="M17.5412 28.1478C16.9295 28.6071 16.0584 28.6215 15.4316 28.1798C9.86396 24.2573 0.5 16.0365 0.5 9.2986C0.5 -2.14222 16.5 -2.14221 16.5 7.66423C16.5 -2.14222 32.5 -2.14225 32.5 9.2986C32.5 15.434 23.1055 23.9686 17.5412 28.1478Z"
                            />
                        </svg>
                        <span>{`${liked ? 'Вы оценили!' : 'Понравился трек?'}`}</span>
                    </div>
                    <Player songId = {songData.songId} />
                </section>
                <section className={styles.comments}>
                    <h3 className={styles.commentTitle}>Комментарии</h3>
                    <div className={styles.list}>
                        <div className={styles.listInner}>
                            {songData.comments?.map((c: Comment, i: number) => (
                                <p onClick={userData?.role === 'Admin' ? () => setShowDeleteCommentConfirm(c.commentId) : () => {}} className={styles.comment} key={i}>
                                    <span className={styles.commentAuthor}>{c.authorName}</span>
                                    <span className={styles.commentText}>{c.text}</span>
                                </p>
                            ))}
                        </div>
                    </div>
                    <div className={styles.send}>
                        <input
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            placeholder="Написать комментарий..."
                        />
                        <NavButton purpose='send' onClick={sendComment}>Отправить</NavButton>
                    </div>
                </section>
                <section className={styles.lyrics}>
                    <h3 className={styles.lyricsTitle}>Текст песни</h3>
                    <div className={styles.lyricsText}>
                        <div className={styles.lyricsTextInner}>
                            {songData.textSong}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
