# gülecunda — Otel Yönetim (scaffold)

Bu proje Vercel için hazırlanmış Next.js + Tailwind + next-auth (Google) scaffoldudur. Apple‑tarzı modern bir başlangıç arayüzü ve Google Sheets ile entegrasyon örneği içerir.

Hızlı başlama (yerelde kurulum değil, CLI üzerinden deploy için talimatlar):

1. `git` repo oluştur, commit ve push yap.

```bash
git init
git add .
git commit -m "init: gulecunda scaffold"
# create repo on GitHub (using gh cli):
gh repo create your-username/gulecunda --public --source=. --remote=origin
git push -u origin main
```

2. Vercel deploy (CLI):

```bash
vercel login
vercel --prod
```

3. Google OAuth ayarları
- Google Cloud Console'da OAuth 2.0 Client ID oluşturun.
- Authorized redirect URI: `https://your-deployment-url.vercel.app/api/auth/callback/google`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` ve `NEXTAUTH_URL` çevresel değişkenlerini Vercel dashboard veya `vercel env` ile ekleyin.

4. Uygulama içinde Google Sheets oluşturma için giriş yaptıktan sonra `/api/sheets/create` endpoint'ini çağırabilirsiniz.
# güle cunda — admin dashboard

Bu proje `gulecunda` için Next.js tabanlı dashboard iskeletidir.

Özet adımlar (ilk tur):
- Next.js + Tailwind CSS iskeleti
- Google ile giriş (NextAuth) stub ve gerekli scope'lar eklendi
- Basit `Header`, `Dock` ve ana sayfa oluşturuldu

Yerel çalıştırma:

```bash
cd gulecunda
npm install
npm run dev
```

Sonraki gereksinimler:
- Google OAuth Client ID/Secret (NextAuth için)
- GitHub Personal Access Token (repo oluşturmak için, istersen manuel de yapabilirsin)
- Vercel token veya Vercel CLI ile giriş (deploy için)

Ben sonraki adımda Git repo, Vercel deploy ve Google Sheets entegrasyonu için yardım edebilirim. Hangi bilgileri şimdi vermek istersiniz?
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
