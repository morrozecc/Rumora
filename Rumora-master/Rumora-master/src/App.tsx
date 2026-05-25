import { JSX } from "react";
import LoginPage from "./components/pages/LoginPage/LoginPage";
import { Route, Routes } from "react-router";
import LoginForm from "./components/blocks/LoginForm/LoginForm";
import RegForm from "./components/blocks/RegForm/RegForm";
import HomePage from "./components/pages/HomePage/HomePage";
import UserPage from "./components/pages/UserPage/UserPage";
import SongPage from "./components/pages/SongPage/SongPage";
import SongEditPage from "./components/pages/SongEditPage/SongEditPage";
import EditProfilePage from "./components/pages/EditProfilePage/EditProfilePage";
import SongAddPage from "./components/pages/SongAddPage/SongAddPage";


export default function App(): JSX.Element {
    return <>
        <Routes>
            <Route index element={<HomePage />} />

            <Route element={<LoginPage />}>
                <Route path="login" element={<LoginForm/>} />
                <Route path="reg" element={<RegForm />} />
            </Route>

            <Route path="user" element={<UserPage />} />
            <Route path="user/edit" element={<EditProfilePage />} />

            <Route path="songs/add" element={<SongAddPage />} />

            <Route path="songs/:songId" element={<SongPage />} />
            <Route path="songs/:songId/edit" element={<SongEditPage />} />
        </Routes>
    </>;
}
