import styles from './HomePage.module.css';
import { DetailedHTMLProps, HTMLAttributes, useEffect, useState } from 'react';

import { useNavigate } from 'react-router';
import NavButton from '@/components/shared/NavButton/NavButton';
import Song from '@/components/shared/Song/Song';
import { SongData } from '@/interfaces';

export interface HomePageProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {}

export default function HomePage({ ...props }: HomePageProps) {

    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [songQuery, setSongQuery] = useState<string>('');
    const [songArray, setSongArray] = useState<SongData[] | undefined>(undefined);

    useEffect(() => {

        const token = localStorage.getItem('userToken');
        if (!token) {
            navigate('/login');
            return;
        }
        
        async function loadSongs() {
            try {
                const songsRes = await fetch(`${process.env.REACT_APP_SERVER}/api/songs`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                });
                if (!songsRes.ok) {
                    const errorText = await songsRes.text();
                    throw new Error(`Ошибка загрузки треков на главной: ${songsRes.status}\n${errorText}` )
                }

                const songs = await songsRes.json();
                console.log(songs)

                setSongArray(songs);
            } catch (err) {
                console.log(err)
            }
        }

        loadSongs();
        
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        setIsLoggedIn(!!token);
    }, []);
    
    const searchMusic = function (query: string) {
        setSongQuery(query);
    }

    return (
        <main className={styles.homePage} {...props}>
            <NavButton className={styles.nav} purpose='user' onClick={() => {isLoggedIn ? navigate("/user") :  navigate("/login")}}/>

            <div className={styles.wrapper}>
                <input className={styles.search} type="text" placeholder='Поиск' onChange={(e) => {searchMusic(e.target.value)}}/>
                <div className={styles.musicContainer}>
                    <div className={styles.musicContainerInner}>
                        {songArray?.map(song => {
                            const query = songQuery.toLowerCase().trim();

                            const visible =
                            song.songName.toLowerCase().includes(query) ||
                            song.authorName.toLowerCase().includes(query) ||
                            query.includes(song.songName.toLowerCase()) ||
                            query.includes(song.authorName.toLowerCase());

                            return (
                            <Song
                                key={song.songId}
                                src={`songs/${song.songId}`}
                                image={song.songCover}
                                title={song.songName}
                                group={song.authorName}
                                hidden={!visible}
                            />
                            );
                        })}
                    </div>
                </div>
            </div>

        </main>
    );
}
