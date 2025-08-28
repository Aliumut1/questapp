
import React, { createContext, useState, useMemo, useContext, useEffect } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material'; // Stilleri sıfırlamak ve arkaplanı ayarlamak için

// 1. Context'i oluşturuyoruz
const ThemeContext = createContext();

// 2. Provider Bileşenini oluşturuyoruz
export function CustomThemeProvider({ children }) {
    // Tarayıcının hafızasından kayıtlı temayı okuyoruz, yoksa 'light' varsayıyoruz
    const [mode, setMode] = useState(localStorage.getItem('themeMode') || 'light');

    // Tema modu değiştiğinde, seçimi tarayıcının hafızasına kaydediyoruz
    useEffect(() => {
        localStorage.setItem('themeMode', mode);
    }, [mode]);

    // Temayı değiştirecek olan fonksiyon
    const toggleTheme = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    // `mode` state'i her değiştiğinde, MUI temasını yeniden oluşturan `useMemo`
    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode, // 'light' veya 'dark' olabilir
                    // İsterseniz burada temalarınıza özel renkler de tanımlayabilirsiniz
                },
            }),
        [mode]
    );

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme }}>
            <MuiThemeProvider theme={theme}>
                {/* CssBaseline, temanın arkaplan ve metin rengini tüm sayfaya uygular */}
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
}

// 3. Context'i kolayca kullanmak için özel bir hook oluşturuyoruz
export const useTheme = () => useContext(ThemeContext);