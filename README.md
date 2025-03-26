# Kiwitter - Twitter Benzeri Sosyal Medya Uygulaması

Bu proje, React ve Tailwind CSS kullanılarak geliştirilmiş Twitter benzeri bir sosyal medya uygulamasıdır. Kullanıcılar kayıt olabilir, giriş yapabilir, twit paylaşabilir, twitleri beğenebilir ve yanıtlayabilirler.

## Özellikler

- Kullanıcı kaydı ve girişi
- Twit oluşturma
- Twitleri beğenme
- Twitlere yanıt verme
- Profil sayfaları
- Son twitler ve en beğenilen twitler görünümleri
- Mobil uyumlu tasarım

## Kullanılan Teknolojiler

- React
- React Router
- Tailwind CSS
- Axios
- React Hook Form
- date-fns

## Kurulum

Projeyi yerel ortamınızda çalıştırmak için:

```bash
# Depoyu klonlayın
git clone https://github.com/username/kiwitter-fe.git
cd kiwitter-fe

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

Uygulama varsayılan olarak http://localhost:5176 adresinde çalışacaktır.

## API Bağlantısı

Bu frontend uygulaması, `https://kiwitter-node-77f5acb427c1.herokuapp.com` adresindeki bir Node.js backend API'sine bağlanmaktadır. API, twit oluşturma, listeleme, kullanıcı yönetimi ve etkileşim gibi tüm gerekli işlevleri sağlar.

## Proje Yapısı

```
kiwitter-fe/
├── src/
│   ├── assets/        # Resimler ve diğer statik dosyalar
│   ├── components/    # Yeniden kullanılabilir UI bileşenleri
│   ├── contexts/      # React context'leri
│   ├── pages/         # Uygulama sayfaları
│   ├── services/      # API servis katmanı
│   ├── App.jsx        # Ana uygulama bileşeni
│   ├── main.jsx       # Uygulama giriş noktası
│   └── ...
├── public/            # Statik dosyalar
├── package.json       # Bağımlılıklar ve script'ler
└── README.md          # Proje dökümantasyonu
```

## Lisans

MIT
