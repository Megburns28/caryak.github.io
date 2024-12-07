import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material';
import { createContext, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './header/Header';

interface AppContextProps {
    auth: string | null;
    setAuth: React.Dispatch<React.SetStateAction<string | null>>;
}

const AppContext = createContext<AppContextProps>({
    auth: null,
    setAuth: () => null,
});

const App = () => {
    const [auth, setAuth] = useState<string | null>(null);

    return (
        <ThemeProvider theme={createTheme({ palette: { mode: 'dark' } })}>
            <AppContext.Provider value={{ auth: auth, setAuth: setAuth }}>
                <Header />
                <Outlet />
            </AppContext.Provider>
        </ThemeProvider>
    );
};

export default App;
