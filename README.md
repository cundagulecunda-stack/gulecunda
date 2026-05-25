# güle cunda - Vercel dashboard (prototype)

Bu proje Vercel üzerinde barınacak, Google hesabı ile oturum açıp Google Sheets'e günlük gelir/gider kaydı yapan basit bir prototiptir.

Kurulum

1. Google Cloud'da OAuth Client ID oluşturun (Web uygulaması). Redirect URI: `https://<YOUR_DOMAIN>/api/auth/callback/google` veya geliştirme için `http://localhost:3000/api/auth/callback/google`.
2. Aşağıdaki environment değişkenlerini ayarlayın (Vercel veya `.env.local`):

```
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NEXTAUTH_SECRET=... (rastgele güçlü bir değer)
NEXTAUTH_URL=http://localhost:3000
```

3. Bağımlılıkları yükleyin:

```bash
npm install
npm run dev
```

Notlar
- İlk sürüm: giriş, günlük gelir/gider ekleme, Google Sheets'e kaydetme.
- İlerleyen adımda raporlar, düzenleme (kart/nakit değişikliği), detaylı analiz eklenecek.
