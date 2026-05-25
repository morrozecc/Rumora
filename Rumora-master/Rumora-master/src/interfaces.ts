export interface IUserData {
    token?: string,
    username?: string,
    role?: 'Admin' | 'User' | 'Moder'
}

export interface SongData {
    songId: number;
    songName: string;
    authorName: string;
    yearOfCreation: string;
    songCover: string;
    audioFile: string;
    comments?: Comment[];
    textSong?: string;
}

export interface Comment {
  commentId?: any;
  authorName: string;
  text: string;
  createdAt: string;
  replyToCommentId?: any;
}