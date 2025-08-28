// GEREKLİ KÜTÜPHANELERİ VE BİLEŞENLERİ IMPORT ETME (İÇERİ AKTARMA) BÖLÜMÜ

// react-router-dom kütüphanesinden Link bileşenini import ediyoruz.
// Bu bileşen, sayfanın tamamı yeniden yüklenmeden sayfalar arası geçişi sağlar.
import { Link } from "react-router-dom";

// React kütüphanesinin kendisini import ediyoruz. JSX yazabilmemiz için bu gereklidir.
import * as React from 'react';

// Material-UI kütüphanesinden ihtiyacımız olan bileşenleri import ediyoruz.
import AppBar from '@mui/material/AppBar';       // En dıştaki navigasyon çubuğu (bar).
import Box from '@mui/material/Box';           // CSS özelliklerini kullanmak için genel amaçlı bir kutu (div gibi).
import Toolbar from '@mui/material/Toolbar';       // AppBar'ın içindeki içeriği yatayda hizalayan alan.
import Typography from '@mui/material/Typography'; // Metinleri (yazıları) stilize etmek için kullanılır.
import IconButton from '@mui/material/IconButton'; // Tıklanabilir ikonlar için bir buton sarmalayıcı.
import MenuIcon from '@mui/icons-material/Menu';   // Hamburger menü ikonu.


// NAVBAR BİLEŞENİNİN TANIMLANDIĞI YER

// "NavBar" adında bir React fonksiyonel bileşeni oluşturuyoruz.
function NavBar() {
    // Bu, örnek bir kullanıcı ID'sidir. Gerçek bir uygulamada bu, giriş yapmış kullanıcının ID'si olur.
    let userId = 5;

    // Linkler için ortak stil nesnesi oluşturuyoruz.
    // Bu, aynı stili tekrar tekrar yazmamızı engeller ve kodu temiz tutar.
    const linkStyle = {
        textDecoration: 'none', // Linklerin altındaki çizgiyi kaldırır.
        color: 'inherit'        // Linkin renginin, içinde bulunduğu elementin rengiyle aynı olmasını sağlar (Bu durumda AppBar beyaz olduğu için beyaz olur).
    };


    // BİLEŞENİN EKRANA ÇİZECEĞİ HTML (JSX) YAPISI

    // "return" ifadesi, bu bileşenin ekranda nasıl görüneceğini belirtir.
    return (
        // <Box>, AppBar'ı sarmak ve genel layout'u yönetmek için kullanılır.
        <Box sx={{ flexGrow: 1 }}>
            
            {/* AppBar'ın kendisi. position="static" ile sayfa kaydırıldığında o da kayar. */}
            <AppBar position="static">
                
                {/* Toolbar, içindeki elemanları (ikon, başlık, butonlar) aynı hizada tutar. */}
                <Toolbar>

                    {/* --- SOL TARAF --- */}
                    
                    {/* Hamburger menü ikonu için tıklanabilir bir buton */}
                    <IconButton
                        size="large"          // Butonun boyutunu ayarlar.
                        edge="start"          // Butonu kenara (sola) yaslar.
                        color="inherit"       // Renginin AppBar ile aynı olmasını sağlar.
                        aria-label="menu"     // Erişilebilirlik için etikettir (ekran okuyucular bunu okur).
                        sx={{ mr: 2 }}        // 'sx' prop'u ile stil veririz. 'mr: 2' -> sağ tarafına biraz boşluk bırakır.
                    >
                        <MenuIcon /> {/* İkonun kendisi */}
                    </IconButton>

                    {/* "Home" linkini içeren metin alanı */}
                    <Typography variant="h6" component="div">
                       {/* Anasayfaya yönlendiren Link bileşeni. Yukarıda tanımladığımız stili kullanır. */}
                       <Link to="/" style={linkStyle}>
                           Home
                       </Link>
                    </Typography>
                    

                    {/* --- ORTADAKİ BOŞLUK --- */}

                    {/* Bu Box, yerleşimin kilit noktasıdır. */}
                    {/* sx={{ flexGrow: 1 }} stili, bu kutunun mevcut tüm boş alanı kaplamasını söyler. */}
                    {/* Bu sayede kendisinden sonra gelen her şeyi en sağa iter. */}
                    <Box sx={{ flexGrow: 1 }} /> 


                    {/* --- SAĞ TARAF --- */}
                    
                    {/* "User" linkini içeren metin alanı */}
                    <Typography variant="h6" component="div">
                        {/* Kullanıcı sayfasına yönlendiren Link bileşeni. */}
                        {/* to prop'u içinde ` (ters tırnak) ve ${userId} kullanarak dinamik bir yol oluştururuz. */}
                        <Link to={`/users/${userId}`} style={linkStyle}>
                            User
                        </Link>
                    </Typography>

                </Toolbar>
            </AppBar>
        </Box>
    );
}

// Bu bileşeni projenin başka yerlerinde (örneğin App.js'de) kullanabilmek için dışa aktarıyoruz.
export default NavBar;