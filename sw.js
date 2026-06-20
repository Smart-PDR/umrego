const CACHE_NAME = 'umrego-cache-v2.9.0'; // Sürüm güncellendi ve eksik olan tüm resim dosyaları önbellek listesine eklendi

// Çevrimdışı çalışmak için gerekli TÜM kritik dosyalar
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  
  // Yerel Medya ve Görseller
  './umrego.jpg',
  './icons/icon-192.png',
  './audio/Telbiye.mp3',

  // Otel, Restoran ve Kutsal Mekan Görselleri (Eksikler eklendi)
  './images/otel_luluat.jpg',
  './images/otel_tebuk_mola.jpg',
  './images/rest_nil.jpg',
  './images/rest_mekke_khalil_cheff.webp',
  './images/rest_medine_yahyausta.webp',
  './images/nophoto.webp',
  './images/default.jpg',
  
  // Mikat Görselleri
  './images/zulhuleyfe_mikat.jpg',
  './images/cuhfe_mikat.jpg',
  './images/manazil_mikat.jpg',
  './images/yelemlem_mikat.jpg',
  './images/zatirk_mikat.jpg',
  
  // Suriye - Ürdün Gezi Görselleri
  './images/gezi_suri_emevicamii.jpg',
  './images/gezi_suri_hamasudolap.jpg',
  './images/gezi_suri_halepkale.jpg',
  './images/gezi_urdun_yediuyur.jpg',
  './images/gezi_urdun_mutesavas.png',
  './images/gezi_urdun_hicazdemiryolu.jpg',
  
  // Tebük ve Diğer Bölgeler Gezi Görselleri
  './images/gezi_tebuk_tevbemescidi.webp',
  './images/gezi_tebuk_istasyon.webp',
  './images/gezi_tebuk_osmanlikalesi.webp',
  './images/gezi_tebuk_madyan.webp',
  './images/gezi_tebuk_musakuyusu.webp',
  './images/gezi_digerbolge_hzsalihasdevesi.webp',
  
  // Medine Gezi Görselleri
  './images/gezi_medine_mescidinebevi.jpg',
  './images/gezi_medine_kubamescidi.jpg',
  './images/gezi_medine_uhuddagi.jpg',
  './images/gezi_medine_yedimescidhendek.jpg',
  
  // Mekke Gezi Görselleri
  './images/mescidiharam.jpg',
  './images/sevrdagi.jpg',
  './images/gezi_mekke_hiramagara.jpg',
  './images/gezi_mekke_cennetulmualla.webp',
  './images/gezi_mekke_arafatdagi.jpg',
  './images/gezi_mekke_muzdelife.webp',
  './images/gezi_mekke_mina.webp',
  './images/gezi_mekke_hudeybiye.webp',
  './images/gezi_mekke_cinmescidi.webp',
  './images/gezi_mekke_akabebiadyeri.webp',
  './images/gezi_mekke_tiflekuyusu.webp',
  './images/gezi_mekke_usfankalesi.webp',

  // Hakkında kısmındaki arka plan deseni
  'https://www.transparenttextures.com/patterns/arabesque.png',

  // CDN Kütüphaneleri (React, Tailwind, İkonlar)
  'https://cdn.tailwindcss.com',
  // index.html ile birebir aynı olacak şekilde "500" font kalınlığı dahil edildi
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap',
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  'https://unpkg.com/lucide@latest',

  // Harita (Leaflet) için dinamik yüklenen CDN kaynakları
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.css',
  'https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.js'
];

// 1. KURULUM (INSTALL) AŞAMASI
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Yeni Service Worker hemen devreye girsin
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Önbellek açıldı ve dosyalar yükleniyor...');
      
      // DÜZELTME: addAll yerine dosyaları tek tek güvenli şekilde ekliyoruz.
      // Böylece CDN'deki bir dosya veya silinmiş bir resim hata verse bile,
      // diğer tüm hayati dosyalar (html, css, js) başarıyla önbelleğe alınır ve site offline çalışır.
      return Promise.all(
        ASSETS_TO_CACHE.map((url) => {
          return cache.add(url).catch((err) => {
            console.warn(`[Service Worker] Dosya önbelleğe alınamadı (Bu dosya eksik veya engellenmiş olabilir): ${url}`, err);
          });
        })
      );
    })
  );
});

// 2. AKTİVASYON (ACTIVATE) AŞAMASI (Eski önbellekleri temizleme)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eski önbellek temizleniyor:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// 3. İSTEKLERİ YAKALAMA (FETCH) AŞAMASI
self.addEventListener('fetch', (event) => {
  // Sadece GET isteklerini (dosya çekme vb.) önbelleğe al, API vb. sorgularını elleme.
  if (event.request.method !== 'GET') return;

  // Döviz kurları vb. dış API isteklerinde sadece network kullan, başarısızsa cache kullanma
  if (event.request.url.includes('exchangerate-api.com')) {
    event.respondWith(fetch(event.request).catch(() => new Response(null, {status: 503})));
    return;
  }

  // SES VE VİDEO İÇİN ÖZEL "RANGE" (PARÇALI İSTEK) DESTEĞİ
  if (event.request.headers.has('range')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (!cachedResponse) {
          return fetch(event.request);
        }
        
        // Önbellekteki dosyayı ArrayBuffer olarak alıp parçalara ayır
        return cachedResponse.arrayBuffer().then((arrayBuffer) => {
          const bytes = event.request.headers.get('range').match(/^bytes\=(\d+)\-(\d+)?/);
          const pos = Number(bytes[1]);
          const end = bytes[2] ? Number(bytes[2]) : arrayBuffer.byteLength - 1;
          const slice = arrayBuffer.slice(pos, end + 1);
          
          return new Response(slice, {
            status: 206,
            statusText: 'Partial Content',
            headers: [
              ['Content-Type', cachedResponse.headers.get('Content-Type') || 'audio/mpeg'],
              ['Content-Range', `bytes ${pos}-${end}/${arrayBuffer.byteLength}`],
              ['Content-Length', slice.byteLength],
              ['Accept-Ranges', 'bytes']
            ]
          });
        });
      })
    );
    return;
  }

  // DİĞER STANDART DOSYALAR İÇİN NORMAL CACHE MANTIĞI
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // 1. Eğer dosya önbellekte varsa anında geri döndür (Offline çalışmanın kalbi)
      if (cachedResponse) {
        return cachedResponse;
      }

      // 2. Önbellekte yoksa internetten indirmeye çalış
      return fetch(event.request).then((networkResponse) => {
        // Geçerli bir yanıt değilse (örn. 404) doğrudan döndür
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'opaque') {
          return networkResponse;
        }

        // Başarılı bir yanıtsa, bunu klonla ve sonradan kullanılmak üzere Dinamik Önbelleğe at
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          // Google Maps resimleri (mt1.google.com vb.) gibi çok yer kaplayan dosyaları sınırlayabilirsiniz, 
          // ancak şimdilik sorunsuz çevrimdışı çalışma için dinamik cache ekliyoruz.
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch((error) => {
        // İNTERNET YOKSA VE CACHE'DE BULUNAMADIYSA:
        console.warn('İnternet yok ve dosya önbellekte bulunamadı:', event.request.url);
        
        // Eğer kullanıcı uygulamayı yeni açıyorsa veya sayfayı yeniliyorsa (HTML isteği)
        // Ana sayfayı (index.html) zorla göster, "siteye ulaşılamıyor" hatasını engelle
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html') || caches.match('./');
        }
      });
    })
  );
});
