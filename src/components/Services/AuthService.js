
export const logout = () => {
    localStorage.removeItem("tokenKey");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userName");
    localStorage.removeItem("refreshToken"); // Refresh token'ı da siliyoruz
    // Eğer zaten login sayfasında değilsek, oraya yönlendir
    if (window.location.pathname !== "/auth") {
        window.location.href = "/auth";
    }
};


// Token yenileme fonksiyonu
const refreshToken = async () => {
    try {
        const refreshTokenValue = localStorage.getItem("refreshToken");
        if (!refreshTokenValue) {
            logout();
            return null;
        }

        const response = await fetch("/auth/refresh", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: refreshTokenValue }),
        });

        if (!response.ok) {
            logout(); // Yenileme başarısız olursa kullanıcıyı sistemden at
            return null;
        }

        const data = await response.json();
        localStorage.setItem("tokenKey", data.accessToken);
        return data.accessToken;

    } catch (error) {
        console.error("Refresh token error:", error);
        logout();
        return null;
    }
};

// API istekleri için özel fetch fonksiyonu
export const authFetch = async (url, options = {}) => {
    let token = localStorage.getItem("tokenKey");

    // Başlıkları (headers) ayarla
    const headers = {
        ...options.headers,
        'Authorization': token,
        'Content-Type': 'application/json',
    };

    // İlk isteği yap
    let response = await fetch(url, { ...options, headers });

    // Eğer yetki hatası (401) alırsak, token'ı yenileyip tekrar dene
    if (response.status === 401) {
        console.log("Access token süresi doldu. Yenileniyor...");
        const newAccessToken = await refreshToken();

        if (newAccessToken) {
            console.log("Token başarıyla yenilendi. İstek tekrarlanıyor...");
            const newHeaders = { ...headers, 'Authorization': newAccessToken };
            response = await fetch(url, { ...options, headers: newHeaders });
        } else {
            // Yenileme başarısız olduysa, hata fırlat
            throw new Error("Oturumunuzun süresi doldu. Lütfen tekrar giriş yapın.");
        }
    }

    return response;
};