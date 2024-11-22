import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import HomePage from './pages/home-page/HomePage.tsx';
import LeaderboardPage from './pages/leaderboard-page/LeaderboardPage.tsx';
import ProfilePage from './pages/profile-page/ProfilePage.tsx';

const root = document.getElementById('root');

if (!root) {
    throw new Error('Root element not found');
}

createRoot(root).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<App />}>
                    <Route index element={<HomePage />} />
                    <Route path='leaderboard' element={<LeaderboardPage />} />
                    <Route path='profile' element={<ProfilePage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </StrictMode>,
);
