const { useState, useEffect, useRef } = React;

// --- SABİTLER VE AYARLAR ---
const DEVELOPER_PHOTO_URL = "icons/icon-192.png"; 
const AUDIO_TELBIYE = "audio/Telbiye.mp3";

// SÜRÜM BİLGİSİ
const APP_VERSION = "v2.9.4"; // Otel/Restoran şehir filtresi ve güvenlik önlemleri eklendi.

// HEADER AYARLARI
const SITE_TITLE = "UmreGO"; 

// GERİ BİLDİRİM LİNKİ
const FEEDBACK_FORM_URL = "https://forms.gle/XiPcqdDAsDMxijiJ9";

// --- YARDIMCI FONKSİYONLAR ---
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
};

// --- VERİLERİN TAMAMI KORUNMUŞTUR ---
const USEFUL_LINKS_DATA = [
    {
        category: "Resmi İşlemler",
        items: [
            { title: "Suudi Arabistan E-Vize", desc: "Resmi vize başvuru platformu (Visa KSA)", url: "https://visa.visitsaudi.com/", icon: "file-check-2", color: "emerald" },
        ]
    },
    {
        category: "Sosyal Topluluklar",
        items: [
            { title: "Karayolu Umre Grubu", desc: "Facebook yardımlaşma ve bilgi paylaşımı", url: "https://www.facebook.com/share/g/1aggRvSc9D/", icon: "facebook", color: "blue" },
            { title: "Bireysel Umre Gezi Rehberi", desc: "Facebook yardımlaşma ve bilgi paylaşımı", url: "https://www.facebook.com/share/g/1FfzbtSBrw/", icon: "facebook", color: "blue" },
            { title: "UmreGO İnstagram", desc: "Güncelleme ve bilgi paylaşımı", url: "https://instagram.com/umrego.men", icon: "instagram", color: "purple" }
        ]
    },
    {
        category: "Video Rehberler",
        items: [
            { title: "Mekke Canlı Yayın", desc: "Kabe-i Muazzama 7/24 Canlı", url: "https://youtu.be/VIg8bJxRyNw", icon: "youtube", color: "red" },
            { title: "Mekke ve Medineden Esintiler", desc: "Kutsal yerleri ziyaret edip bilgilendirici içerikler paylaşan kanal", url: "https://www.youtube.com/@mekkevemedinedenesintiler", icon: "youtube", color: "red" },
            { title: "Karayolu ile Umre", desc: "Süreci açıklayan bilgilendirici bir video", url: "https://youtu.be/mFUymF-rONM", icon: "video", color: "rose" }
        ]
    },
        {
        category: "Uygulamalar",
        items: [
            { title: "Nusuk", desc: "Ravza randevu uygulaması", url: "https://play.google.com/store/apps/details?id=com.moh.nusukapp&hl=tr", icon: "smartphone", color: "purple" },
            { title: "YeniMetot ElifBa", desc: "Kur'an öğretimini kolaylaşlatıran, 7'den 70'e her yaşa hitap eden uygulama.", url: "https://play.google.com/store/apps/details?id=com.yenimetotelifba.elifba&hl=tr", icon: "smartphone", color: "blue" },
            { title: "Haremi Şerif 3D Kroki", desc: "Haremi Şerif'in 3 boyutlu detaylı krokisinin bulunduğu site.", url: "https://map-viewer.situm.com/hajj?wl=true&lng=tr&buildingid=18546&floorid=61621&poiid=850407", icon: "map", color: "red" }
        ]
    }
];

const HOTELS_RESTAURANTS_DATA = {
    hotels: [
        {
            id: "h1",
            name: "Luluat Alnader Hotel",
            country: "Mekke",
            desc: "Şişe bölgesinde olup servisli bir oteldir. Otelden 2 servis değişerek Mahbes durağına gidiliyor. Ekonomik bir otel olup Türk yemekleri vardır. Fiyatlar değişken olduğundan iletişim kurarak bilgi alabilirsiniz.",
            phone: "+905059483781",
            whatsapp: "https://wa.me/905059483781",
            lat: 21.4326,
            lng: 39.8556,
            image: "/images/otel_luluat.jpg",
            stars: 4.0
        },
                {
            id: "h2",
            name: "Tebük Konaklama",
            country: "Tebük",
            desc: "Evden bağımsız, ayrı girişli oda • Oda içerisinde WC ve banyo • En fazla 6 kişilik konaklama kapasitesi • Uygun fiyatlı konaklama imkânı • Misafirlere ikram ve gerekli konularda destek • Amman’a yaklaşık 6 saat mesafe • Halat Ammar Sınır Kapısı’na yaklaşık 1 saat mesafe • Mola vermek için ideal, uygun fiyatlı bir mekân. WhatsApp üzerinden detaylı bilgi alabilirsiniz.",
            phone: "+905056989819",
            whatsapp: "https://wa.me/905056989819",
            lat: 28.4372,
            lng: 36.5159,
            image: "/images/otel_tebuk_mola.jpg",
            stars: 3.0
        }
    ],
    restaurants: [
        {
            id: "r1",
            name: "Nil Restaurant",
            country: "Suriye",
            desc: "M5 yolu üzerinde, mola vermek için uygun, konaklama hizmeti de mevcut. Hz. Ömer bin Abdülaziz Türbesi yakınında. Umre yolcularına özel %20 indirim uygulanacağı yazıyor Facebook grubunda.",
            phone: "+905315894004",
            whatsapp: "https://wa.me/905315894004",
            lat: 35.6292,
            lng: 36.6729,
            image: "/images/rest_nil.jpg",
            rating: 4.0
        },
        {
            id: "r2",
            name: "Khalil Chef Restaurant",
            country: "Mekke",
            desc: "Mekke'de bir Türk lokantası, Aziziye bölgesinde. Genel olarak Google yorumları iyi.",
            phone: "+966565642386",
            whatsapp: "https://wa.me/+966565642386",
            lat: 21.4201,
            lng: 39.8588,
            image: "/images/rest_mekke_khalil_cheff.webp",
            rating: 4.0
        },
                {
            id: "r3",
            name: "Turkish Almazaq",
            country: "Mekke",
            desc: "Cin mescidi yakınında bir Türk lokantası.",
            phone: "+966556362671",
            whatsapp: "https://wa.me/966556362671",
            lat: 21.4319,
            lng: 39.8291,
            image: "/images/nophoto.webp",
            rating: 3.5
        },
        {
            id: "r4",
            name: "Turkish Taste Almazaq Restaurant",
            country: "Mekke",
            desc: "Mekke'de bir Türk lokantası.",
            phone: "+966556362671",
            whatsapp: "https://wa.me/966556362671",
            lat: 21.4281,
            lng: 39.856,
            image: "/images/nophoto.webp",
            rating: 3.6
        },
        {
            id: "r5",
            name: "Kebapçım Mekke",
            country: "Mekke",
            desc: "King Faisal hastanesi civarında bir Türk lokantası.",
            phone: "+966508812238",
            whatsapp: "https://wa.me/966508812238",
            lat: 21.4331,
            lng: 39.8532,
            image: "/images/nophoto.webp",
            rating: 4.4
        },
        {
            id: "r6",
            name: "Kirli'nin Yeri",
            country: "Mekke",
            desc: "Mekke'de bir Türk lokantası.",
            phone: "+966503611656",
            whatsapp: "https://wa.me/966503611656",
            lat: 21.4304,
            lng: 39.8612,
            image: "/images/nophoto.webp",
            rating: 4.2
        },
        {
            id: "r7",
            name: "Simit Evi",
            country: "Mekke",
            desc: "Türk kahvaltısı da olan bir mekân.",
            phone: "+966566907012",
            whatsapp: "https://wa.me/966566907012",
            lat: 21.3802,
            lng: 39.7875,
            image: "/images/nophoto.webp",
            rating: 4.3
        },
        {
            id: "r8",
            name: "Gurkan Şef Steakhouse",
            country: "Mekke",
            desc: "Mekke'de lüks bir Türk restaurantı.",
            phone: "+966559288684",
            whatsapp: "https://wa.me/966559288684",
            lat: 21.3528,
            lng: 39.8952,
            image: "/images/nophoto.webp",
            rating: 4.4
        },
        {
            id: "r9",
            name: "Turkish Al Mazaq Restorant Al Awali",
            country: "Mekke",
            desc: "Mekke'de bir Türk lokantası.",
            phone: "+966556362671",
            whatsapp: "https://wa.me/966556362671",
            lat: 21.3593,
            lng: 39.8743,
            image: "/images/nophoto.webp",
            rating: 3.7
        },
        {
            id: "r10",
            name: "Tat Restorant",
            country: "Mekke",
            desc: "Mekke'de bir Türk lokantası.",
            phone: "+966125747478",
            whatsapp: "https://wa.me/966125747478",
            lat: 21.4398,
            lng: 39.8352,
            image: "/images/nophoto.webp",
            rating: 3.9
        },
        {
            id: "r11",
            name: "Hayal Al Divan İstanbul Restaurant",
            country: "Medine",
            desc: "Medine'de bir Türk restaurantı.",
            phone: "+966536001615",
            whatsapp: "https://wa.me/966536001615",
            lat: 24.4469,
            lng: 39.6192,
            image: "/images/nophoto.webp",
            rating: 4.6
        },
        {
            id: "r12",
            name: "İskenderun Restaurant",
            country: "Medine",
            desc: "Medine'de bir Türk lokantası.",
            phone: "+966544146243",
            whatsapp: "https://wa.me/966544146243",
            lat: 24.4855,
            lng: 39.5999,
            image: "/images/nophoto.webp",
            rating: 3.9
        },
        {
            id: "r13",
            name: "İstanbul Köşk Restoran",
            country: "Medine",
            desc: "Medine'de bir Türk restaurantı.",
            phone: "+966536222566",
            whatsapp: "https://wa.me/966536222566",
            lat: 24.492,
            lng: 39.592,
            image: "/images/nophoto.webp",
            rating: 3.8
        },
        {
            id: "r14",
            name: "Fairuz Turkish Restaurant - Yahya Usta",
            country: "Medine",
            desc: "Medine'de bir Türk restaurantı.",
            phone: "+966552924991",
            whatsapp: "https://wa.me/966552924991",
            lat: 24.494303791838213,
            lng: 39.58558698220959,
            image: "/images/rest_medine_yahyausta.webp",
            rating: 4.2
        },
        {
            id: "r15",
            name: "Saray İskender",
            country: "Medine",
            desc: "Medine'de bir Türk restaurantı.",
            phone: "+966544212021",
            whatsapp: "https://wa.me/966544212021",
            lat: 24.4737,
            lng: 39.5814,
            image: "/images/nophoto.webp",
            rating: 4.1
        },
        {
            id: "r16",
            name: "Turkish Grill Pies",
            country: "Medine",
            desc: "Medine'de bir Türk restaurantı.",
            phone: "+966547147523",
            whatsapp: "https://wa.me/966547147523",
            lat: 24.4343,
            lng: 39.5922,
            image: "/images/nophoto.webp",
            rating: 4.4
        },
        {
            id: "r17",
            name: "Al Sharq Grills & Pastries",
            country: "Medine",
            desc: "Medine'de bir Türk restaurantı.",
            phone: "+966559838161",
            whatsapp: "https://wa.me/966559838161",
            lat: 24.4342,
            lng: 39.5917,
            image: "/images/nophoto.webp",
            rating: 4.3
        },
        {
            id: "r18",
            name: "Chef Burak Gurme Restaurant",
            country: "Medine",
            desc: "Medine'de bir Türk restaurantı.",
            phone: "+966531515403",
            whatsapp: "https://wa.me/966531515403",
            lat: 24.4265,
            lng: 39.5971,
            image: "/images/nophoto.webp",
            rating: 4.8
        },
        {
            id: "r19",
            name: "Kuzey Kebap Restoranı",
            country: "Medine",
            desc: "Medine'de bir Türk restaurantı.",
            phone: "+966537440083",
            whatsapp: "https://wa.me/966537440083",
            lat: 24.4922,
            lng: 39.5923,
            image: "/images/nophoto.webp",
            rating: 4.5
        },
        {
            id: "r20",
            name: "Türkiye Pide Kebap",
            country: "Medine",
            desc: "Medine'de bir Türk restaurantı.",
            phone: "-",
            whatsapp: "https://wa.me/-",
            lat: 24.4861,
            lng: 39.6045,
            image: "/images/nophoto.webp",
            rating: 0.0
        },
        {
            id: "r21",
            name: "Ordu Boztepe Türk Restorantı",
            country: "Medine",
            desc: "Medine'de bir Türk restaurantı.",
            phone: "+966552579131",
            whatsapp: "https://wa.me/966552579131",
            lat: 24.4833,
            lng: 39.6829,
            image: "/images/nophoto.webp",
            rating: 4.9
        },
        {
            id: "r22",
            name: "Ulus Restaurant",
            country: "Medine",
            desc: "Medine'de bir Türk restaurantı.",
            phone: "+966506048710",
            whatsapp: "https://wa.me/966506048710",
            lat: 24.4851,
            lng: 39.5776,
            image: "/images/nophoto.webp",
            rating: 4.7
        },
        {
            id: "r23",
            name: "Riman Restaurant",
            country: "Medine",
            desc: "Memnun kalınmış Hatay lezzetleri.",
            phone: "+966564600801",
            whatsapp: "https://wa.me/966564600801",
            lat: 24.471727547529895,
            lng: 39.55466207116365,
            image: "/images/nophoto.webp",
            rating: 4.3
        },
        {
            id: "r24",
            name: "Huda Türk Restaurant",
            country: "Medine",
            desc: "Sulu yemek, ızgara ve pide çeşitleri.",
            phone: "+966554389143",
            whatsapp: "https://wa.me/966554389143",
            lat: 24.47047014767619,
            lng: 39.602277071163655,
            image: "/images/nophoto.webp",
            rating: 4.0
        },
        {
            id: "r25",
            name: "Hotel Medina Milli Görüş",
            country: "Medine",
            desc: "Kahvaltı ve akşam yemeği ücret karşılığı alınabiliyor. Kantininde de Türk çayı ve tost bulunuyor.",
            phone: "+966552214362",
            whatsapp: "https://wa.me/966552214362",
            lat: 24.465509348253303,
            lng: 39.604123580945725,
            image: "/images/nophoto.webp",
            rating: 4.5
        },
        {
            id: "r26",
            name: "Albaik",
            country: "Medine",
            desc: "Arabistanın en meşhur fast food zinciri. Birçok şubesi var.",
            phone: "+9668002442245",
            whatsapp: "https://wa.me/9668002442245",
            lat: 24.47140097936943,
            lng: 39.61035710000001,
            image: "/images/nophoto.webp",
            rating: 4.1
        },
        {
            id: "r27",
            name: "Albaik (başka Şube)",
            country: "Medine",
            desc: "Arabistanın en meşhur fast food zinciri. Birçok şubesi var.",
            phone: "+9668002442245",
            whatsapp: "https://wa.me/9668002442245",
            lat: 24.463901241395927,
            lng: 39.61614500004014,
            image: "/images/nophoto.webp",
            rating: 4.4
        },
        {
            id: "r28",
            name: "Saraya Istanbul Turkish Food",
            country: "Medine",
            desc: "Medine'de bir Türk restaurantı.",
            phone: "-",
            whatsapp: "https://wa.me/-",
            lat: 24.474342435183885,
            lng: 39.610767735581824,
            image: "/images/nophoto.webp",
            rating: 3.2
        },
        {
            id: "r29",
            name: "Amarant Restaurant",
            country: "Medine",
            desc: "Özbek lezzetleri.",
            phone: "+966571497777",
            whatsapp: "https://wa.me/966571497777",
            lat: 24.464417245146116,
            lng: 39.60384738650904,
            image: "/images/nophoto.webp",
            rating: 4.1
        },
        {
            id: "r30",
            name: "Al Romansiah",
            country: "Medine",
            desc: "Arap lezzetleri. Birçok şubesi var.",
            phone: "+966920000144",
            whatsapp: "https://wa.me/966920000144",
            lat: 24.470041412877716,
            lng: 39.64163527116365,
            image: "/images/nophoto.webp",
            rating: 4.2
        },
        {
            id: "r31",
            name: "Maestro Pizza",
            country: "Medine",
            desc: "Beğeni almış bir pizzacı. Birçok şubesi var.",
            phone: "+966920017777",
            whatsapp: "https://wa.me/966920017777",
            lat: 24.48891052710349,
            lng: 39.57995794232732,
            image: "/images/nophoto.webp",
            rating: 4.0
        },
        {
            id: "r32",
            name: "Mahmood Kebap",
            country: "Medine",
            desc: "Özbek lezzetleri.",
            phone: "+966531800707",
            whatsapp: "https://wa.me/966531800707",
            lat: 24.46375501718126,
            lng: 39.61090941349095,
            image: "/images/nophoto.webp",
            rating: 4.8
        },
        {
            id: "r33",
            name: "Albaik",
            country: "Mekke",
            desc: "Arabistanın en meşhur fast food zinciri. Birçok yerde şubesi var.",
            phone: "+9668002442245",
            whatsapp: "https://wa.me/9668002442245",
            lat: 21.42132337576958,
            lng: 39.8219553,
            image: "/images/nophoto.webp",
            rating: 3.8
        },
        {
            id: "r34",
            name: "Albaik (şube)",
            country: "Mekke",
            desc: "Arabistanın en meşhur fast food zinciri. Birçok yerde şubesi var.",
            phone: "+9668002442245",
            whatsapp: "https://wa.me/9668002442245",
            lat: 21.41952300000005,
            lng: 39.82375418220911,
            image: "/images/nophoto.webp",
            rating: 4.1
        },
        {
            id: "r35",
            name: "Albaik Aziziye",
            country: "Mekke",
            desc: "Arabistanın en meşhur fast food zinciri. Birçok yerde şubesi var.",
            phone: "+966122866777",
            whatsapp: "https://wa.me/966122866777",
            lat: 21.416929096997045,
            lng: 39.861188582209074,
            image: "/images/nophoto.webp",
            rating: 4.3
        },
        {
            id: "r36",
            name: "Al Romansiah",
            country: "Mekke",
            desc: "Arabistan lezzetleri.",
            phone: "+966920000144",
            whatsapp: "https://wa.me/966920000144",
            lat: 21.419404699999998,
            lng: 39.822512900000014,
            image: "/images/nophoto.webp",
            rating: 4.3
        },
        {
            id: "r37",
            name: "Al Romansiah",
            country: "Mekke",
            desc: "Arabistan lezzetleri.",
            phone: "+966920000144",
            whatsapp: "https://wa.me/966920000144",
            lat: 21.400909005458658,
            lng: 39.880766635581836,
            image: "/images/nophoto.webp",
            rating: 4.2
        },
        {
            id: "r38",
            name: "Mutabbak Cafe",
            country: "Mekke",
            desc: "Çay, kahve içecek vb. var. Türkiye gözlemesine benzer yiyecekleri var.",
            phone: "-",
            whatsapp: "https://wa.me/-",
            lat: 21.419988927291538,
            lng: 39.82378044110453,
            image: "/images/nophoto.webp",
            rating: 4.5
        },
        {
            id: "r39",
            name: "Kabsa Hashi Restaurant",
            country: "Mekke",
            desc: "Deve eti, sembuse, kebze gibi Arap lezzetleri.",
            phone: "+966536582511",
            whatsapp: "https://wa.me/966536582511",
            lat: 21.415649470190647,
            lng: 39.86231637116366,
            image: "/images/nophoto.webp",
            rating: 4.0
        },
        {
            id: "r40",
            name: "Maestro Pizza",
            country: "Mekke",
            desc: "Birçok şubesi olan meşhur pizzacı.",
            phone: "+966920017777",
            whatsapp: "https://wa.me/966920017777",
            lat: 21.41526449405094,
            lng: 39.862883471163656,
            image: "/images/nophoto.webp",
            rating: 3.9
        },
        {
            id: "r41",
            name: "Ankara Barbekü Restoran",
            country: "Tebük",
            desc: "Tebük'te bir Türk restoranı.",
            phone: "+966500801171",
            whatsapp: "https://wa.me/966500801171",
            lat: 28.392854042638696,
            lng: 36.595927242327306,
            image: "/images/nophoto.webp",
            rating: 4.7
        },
        {
            id: "r42",
            name: "Saray İskender",
            country: "Tebük",
            desc: "Tebük'te bir Türk restoranı.",
            phone: "+966542716040",
            whatsapp: "https://wa.me/966542716040",
            lat: 28.43427628637946,
            lng: 36.520839699999996,
            image: "/images/nophoto.webp",
            rating: 3.7
        },
        {
            id: "r43",
            name: "Turkish Restaurant",
            country: "Tebük",
            desc: "Tebük'te bir Türk restoranı.",
            phone: "+966559387184",
            whatsapp: "https://wa.me/966559387184",
            lat: 28.507382157963633,
            lng: 36.4667417846546,
            image: "/images/nophoto.webp",
            rating: 3.5
        },
        {
            id: "r44",
            name: "Turkish Legends Restaurant",
            country: "Tebük",
            desc: "Tebük'te bir Türk restoranı.",
            phone: "+966508704327",
            whatsapp: "https://wa.me/966508704327",
            lat: 28.397123270384537,
            lng: 36.589935215345385,
            image: "/images/nophoto.webp",
            rating: 4.0
        },
        {
            id: "r45",
            name: "Seç Turkish Restaurant",
            country: "Tebük",
            desc: "Tebük'te bir Türk restoranı.",
            phone: "+966144210595",
            whatsapp: "https://wa.me/966144210595",
            lat: 28.393189295531776,
            lng: 36.57353380185443,
            image: "/images/nophoto.webp",
            rating: 4.1
        },
        {
            id: "r46",
            name: "Alkhaleej Restaurant",
            country: "Tebük",
            desc: "Tebük'te bir Türk restoranı.",
            phone: "+966535237300",
            whatsapp: "https://wa.me/966535237300",
            lat: 28.402218443166895,
            lng: 36.5522149269819,
            image: "/images/nophoto.webp",
            rating: 4.1
        },
        {
            id: "r47",
            name: "Time Out Restaurant",
            country: "Tebük",
            desc: "Tebük'te bir Türk restoranı.",
            phone: "+966531448777",
            whatsapp: "https://wa.me/966531448777",
            lat: 28.410052612062753,
            lng: 36.55892851349096,
            image: "/images/nophoto.webp",
            rating: 5.0
        },
        {
            id: "r48",
            name: "Al Madain Zincir Restoranı",
            country: "Tebük",
            desc: "Tebük'te bir Türk restoranı.",
            phone: "-",
            whatsapp: "https://wa.me/-",
            lat: 28.433053233312943,
            lng: 36.514003673018095,
            image: "/images/nophoto.webp",
            rating: 4.4
        },
        {
            id: "r49",
            name: "Top Grill Restaurant & Lounge",
            country: "Tebük",
            desc: "Tebük'te mangal ağırlıklı bir restoran.",
            phone: "+966533227383",
            whatsapp: "https://wa.me/966533227383",
            lat: 28.425588935627307,
            lng: 36.57222711534539,
            image: "/images/nophoto.webp",
            rating: 4.5
        },
        {
            id: "r50",
            name: "Türk Paşa Restoranları",
            country: "Ürdün",
            desc: "Ürdün'de bir Türk restoranı.",
            phone: "+962775249025",
            whatsapp: "https://wa.me/962775249025",
            lat: 31.714056763414845,
            lng: 35.78810506441818,
            image: "/images/nophoto.webp",
            rating: 3.8
        },
        {
            id: "r51",
            name: "Maxim Turkish Restaurant",
            country: "Ürdün",
            desc: "Ürdün'de bir Türk restoranı.",
            phone: "+96264460023",
            whatsapp: "https://wa.me/96264460023",
            lat: 31.7074557187004,
            lng: 35.9513467846546,
            image: "/images/nophoto.webp",
            rating: 4.2
        },
        {
            id: "r52",
            name: "Antakya Türk Restoranı",
            country: "Ürdün",
            desc: "Ürdün'de bir Türk restoranı.",
            phone: "+962791009286",
            whatsapp: "https://wa.me/962791009286",
            lat: 31.699274192427243,
            lng: 35.95368805581826,
            image: "/images/nophoto.webp",
            rating: 4.4
        },
        {
            id: "r53",
            name: "Türk Restoranı",
            country: "Ürdün",
            desc: "Ürdün'de bir Türk restoranı.",
            phone: "+96264460105",
            whatsapp: "https://wa.me/96264460105",
            lat: 31.71172594471114,
            lng: 35.949945871163656,
            image: "/images/nophoto.webp",
            rating: 4.2
        },
        {
            id: "r54",
            name: "Türk Restoranı Ve Izgara",
            country: "Ürdün",
            desc: "Ürdün'de bir Türk restoranı.",
            phone: "+962775635031",
            whatsapp: "https://wa.me/962775635031",
            lat: 31.714577224076585,
            lng: 35.797656828836345,
            image: "/images/nophoto.webp",
            rating: 4.6
        },
        {
            id: "r55",
            name: "Al-usul Türk Izgara Restoranı",
            country: "Ürdün",
            desc: "Ürdün'de bir Türk restoranı.",
            phone: "+962775518102",
            whatsapp: "https://wa.me/962775518102",
            lat: 31.72469094024385,
            lng: 35.803126544181744,
            image: "/images/nophoto.webp",
            rating: 4.5
        },
        {
            id: "r56",
            name: "Zambak Turkish Cuisine",
            country: "Ürdün",
            desc: "Ürdün'de bir Türk restoranı.",
            phone: "+962798989661",
            whatsapp: "https://wa.me/962798989661",
            lat: 31.87693075225963,
            lng: 35.88364012698192,
            image: "/images/nophoto.webp",
            rating: 4.3
        },
        {
            id: "r57",
            name: "Tavada Tavuk",
            country: "Ürdün",
            desc: "Ürdün'de bir Türk restoranı.",
            phone: "+962797771373",
            whatsapp: "https://wa.me/962797771373",
            lat: 31.916184574071597,
            lng: 35.9100718153454,
            image: "/images/nophoto.webp",
            rating: 4.5
        },
        {
            id: "r58",
            name: "Usta Ünsal",
            country: "Ürdün",
            desc: "Ürdün'de bir Türk restoranı.",
            phone: "+962789595670",
            whatsapp: "https://wa.me/962789595670",
            lat: 31.95737456539158,
            lng: 35.86585201534536,
            image: "/images/nophoto.webp",
            rating: 4.7
        },
        {
            id: "r59",
            name: "Turkish Restaurant",
            country: "Ürdün",
            desc: "Ürdün'de bir Türk restoranı.",
            phone: "+962795886989",
            whatsapp: "https://wa.me/962795886989",
            lat: 31.969107058995043,
            lng: 35.91927007116365,
            image: "/images/nophoto.webp",
            rating: 4.0
        },
        {
            id: "r60",
            name: "Sofia Turkish Restaurant",
            country: "Ürdün",
            desc: "Ürdün'de bir Türk restoranı.",
            phone: "+96265511000",
            whatsapp: "https://wa.me/96265511000",
            lat: 31.973897554058514,
            lng: 35.86765934418174,
            image: "/images/nophoto.webp",
            rating: 4.4
        },
        {
            id: "r61",
            name: "Kofteon.jo",
            country: "Ürdün",
            desc: "Ürdün'de bir Türk restoranı.",
            phone: "+962777003435",
            whatsapp: "https://wa.me/962777003435",
            lat: 31.983822850790787,
            lng: 35.88100304232729,
            image: "/images/nophoto.webp",
            rating: 5.0
        },
        {
            id: "r62",
            name: "Tavada Tavuk Mecca Mall",
            country: "Ürdün",
            desc: "Ürdün'de bir Türk restoranı.",
            phone: "+962799269538",
            whatsapp: "https://wa.me/962799269538",
            lat: 31.9777398558528,
            lng: 35.84163924232731,
            image: "/images/nophoto.webp",
            rating: 4.8
        },
        {
            id: "r63",
            name: "Lezzet İstanbul",
            country: "Ürdün",
            desc: "Ürdün'de bir Türk restoranı.",
            phone: "+962796516633",
            whatsapp: "https://wa.me/962796516633",
            lat: 32.02331124064008,
            lng: 35.874819115345396,
            image: "/images/nophoto.webp",
            rating: 4.3
        },
        {
            id: "r64",
            name: "Restaurant Turkish Grill House",
            country: "Ürdün",
            desc: "Ürdün'de bir Türk restoranı.",
            phone: "+96264895256",
            whatsapp: "https://wa.me/96264895256",
            lat: 31.97815915479922,
            lng: 35.98105102698191,
            image: "/images/nophoto.webp",
            rating: 4.2
        },
        {
            id: "r65",
            name: "Barbecue Turkish Shawrma",
            country: "Ürdün",
            desc: "Ürdün'de bir Türk restoranı.",
            phone: "+962796013480",
            whatsapp: "https://wa.me/962796013480",
            lat: 32.028378218163546,
            lng: 36.03948652883635,
            image: "/images/nophoto.webp",
            rating: 4.2
        },
        {
            id: "r66",
            name: "Turkish Restaurant",
            country: "Ürdün",
            desc: "Ürdün'de bir Türk restoranı.",
            phone: "+962797095094",
            whatsapp: "https://wa.me/962797095094",
            lat: 32.34256472545441,
            lng: 36.188180986509046,
            image: "/images/nophoto.webp",
            rating: 4.4
        },
        {
            id: "r67",
            name: "İskander House",
            country: "Medine",
            desc: "Medine'de bir Türk restoranı.",
            phone: "+966538044074",
            whatsapp: "https://wa.me/966538044074",
            lat: 24.473350844318514,
            lng: 39.5813648919744,
            image: "/images/nophoto.webp",
            rating: 5.0
        }
    ]
};

const GUIDE_DATA = [
    {
        "id": "g1",
        "title": "1. Hazırlık ve Belgeler",
        "icon": "file-check",
        "color": "emerald",
        "content": [
                        {
                "t": "Yurt Dışı Çıkış Harcı",
                "d": "Türkiye’den çıkarken 1250 TL yurt dışı çıkış harcının ödenmiş olması gerekiyor. Dijital Vergi Dairesi olan 'dijital.gib.gov.tr' üzerinden ödeyebilirsiniz, böylece sınır kapısında zaman kaybetmezsiniz."
            },
            {
                "t": "Araç Ruhsat Durumu",
                "d": "Araç ruhsat sahibi araçta bulunmalıdır. Bulunmuyorsa ruhsat sahibinden noter onaylı vekaletname almak şarttır."
            },
            {
                "t": "Uluslararası Sigorta",
                "d": "Türkiye'deki kaskonuza 'yurtdışı klozu' (Yeşil Kart) ekletmeniz yararlı olacaktır. Bu, Ürdün ve S. Arabistan'da geçerlidir ancak Suriye'de geçmez."
            },
            {
                "t": "Pasaport ve Vize",
                "d": "Yeşil pasaportun sınır geçişlerinde vize muafiyeti yoktur. S. Arabistan e-vizesi yola çıkmadan alınmalıdır, zira transit geçişlerde kanıt olarak sunulabilir. S. Arabistan'da kapıda vize uygulaması da vardır."
            },
            {
                "t": "Teknik Donanım",
                "d": "Lastik onarım kiti, kompresör, yedek parça bulundurmak faydanıza olacaktır. Bagajınızı X-Ray için valizlerde düzenli istifleyin. Valiz kullanmanız bagajı doldur-boşalt yapacağınız zaman işinizi kolaylaştıracaktır."
            },
            {
                "t": "Navigasyon",
                "d": "Suriye'de internet kısıtlıdır. Yolda internet olmadan navigasyon kullanmak için “Maps.me” veya “Here.maps” gibi offline (çevrim dışı) çalışan uygulamalar kullanılabileceği gibi henüz Türkiye’deyken Google Maps’i açıp sağ üst köşede adınızın baş harfine tıklayarak açılan seçeneklerden “Çevrimdışı Haritalar” menüsünden güzergah haritasını parça parça indirerek yolculukta internet olmadan da Google Haritaları kullanabilirsiniz. Unutmayın; Mekke’ye kadar olan tüm güzergahı parça parça indirmeniz gerekmektedir."
            }
        ]
    },
    {
        "id": "g2",
        "title": "2. Türkiye - Suriye Geçişi",
        "icon": "flag",
        "color": "amber",
        "content": [
            {
                "t": "Sınır Kapısı",
                "d": "Bab El-Hawa (Cilvegözü) üzerinden geçiş yapılır."
            },
            {
                "t": "Vize & Maliyetler (Giriş)",
                "d": "Araç Karnesi: 20$, Vize Harcı: 25$ (Transit geçiş - kişi başı), Çıkış Pulu: 150 TL. Sigorta Ücreti: Küçük araçlar için 25$, büyük araçlar için 50$."
            },
            {
                "t": "Önemli Uyarı",
                "d": "Transit geçiş yapacağınızı belirtmezseniz normal vize ücreti olan 50$ ödemek durumunda kalırsınız."
            },
            {
                "t": "İzlenecek Rota",
                "d": "İdlip - Hama - Humus - Şam - Dera rotası (M5) izlenir. Bu yol sizi Ürdün'e kadar götürür. "
            },
            {
                "t": "Güvenlik Uyarısı",
                "d": "Suriye savaştan henüz yeni çıktığı için yollarda derin çukurlar olabiliyor ve elektrik aydınlatmaları henüz yeterli düzeyde olmadığından özellikle Suriye’den geçişlerin gündüz yapılması şiddetle tavsiye ediliyor."
            },
            {
                "t": "Yakıt",
                "d": "Fiyatı uygun olsa da zorunda kalmadıkça Suriye'den yakıt alınması tavsiye edilmiyor. Özellikle de dizel."
            }
        ]
    },
    {
        "id": "g3",
        "title": "3. Suriye - Ürdün Geçişi",
        "icon": "arrow-down-up",
        "color": "blue",
        "content": [
            {
                "t": "Sınır Kapısı",
                "d": "Nassib - Jaber kapısı kullanılır. Yabancılar için 3. kanal tercih edilmelidir. Aracın altı kontrol edildikten sonra sıra beklenir."
            },
            {
                "t": "Güvenlik Kontrolü",
                "d": "Sıranız geldikten sonra araç içinin boşaltılması istenir. Araçtaki TÜM eşyalar indirilip araç X-Ray'den geçirilir. Araç içi boş taratılır. X-Ray taraması bittikten sonra aracınıza eşyalarınızı yükleyebilirsiniz. Bavul kullanımı bu işlemi sizin açınızdan kolaylaştırır."
            },
            {
                "t": "Maliyetler",
                "d": "Zorunlu Sigorta: ~55 JOD (80$), Araç Giriş Vergisi: 20 JOD (Custom yazan binada nakit olarak ödeniyor). Burada ödemeler sadece Ürdün Dinarı (JOD) ile yapılıyor. Sigorta işlemi için kredi kartı kabul ediliyor ancak diğer işlemler için nakit talep ediliyor. Sigorta işlemi için kredi kartı kabul ediliyor ancak diğer işlemler için nakit talep ediliyor. Sigorta poliçesini dönüş için saklayın, böylece dönüşte ödeme yapmanıza gerek kalmaz."
            },
            {
                "t": "Vize",
                "d": "Türk vatandaşlarına transit geçişte vize ücreti alınmıyor ama mutlaka transit geçeceğinizi belirtmeniz gerekiyor. Genelde 24 saat süre verilir geçiş için."
            },
            {
                "t": "Önemli Uyarı",
                "d": "Hız sınırı çoğunlukla 110'dur, yakıt Türkiye'ye göre biraz pahalıdır, Ürdün sınırını geçip S. Arabistan topraklarına girdikten sonra akaryakıt istasyonları seyrekleştiğinden yakıt ikmali yapılması tavsiye ediliyor."
            }
        ]
    },
    {
        "id": "g4",
        "title": "4. Ürdün - Suudi Arabistan",
        "icon": "log-in",
        "color": "green",
        "content": [
            {
                "t": "Sınır Alternatifleri",
                "d": "1. Durra Sınır Kapısı (Akabe'de dinlenme imkânı), 2. Halat Ammar Sınır Kapısı (Tebük Yolu, Petra Antik Şehri güzergahı), 3. Al Omar Sınır Kapısı (Ürdün'de oyalanmadan çıkış yapmak isteyenler için en hızlı yol)."
            },
            {
                "t": "Giriş İşlemleri",
                "d": "İşlemler hızlı ve profesyoneldir. X-Ray taraması yapılır."
            },
            {
                "t": "Kapıda Vize & Ücret",
                "d": "Turist vizesi alınması tavsiye ediliyor (107$)."
            },
            {
                "t": "Zorunlu Sigorta",
                "d": "Araç sigortası zorunludur (~80$) ve 1 month geçerlidir. Kredi kartı (VISA/MasterCard) geçerlidir."
            },
            {
                "t": "Yakıt İkmali",
                "d": "Tebük şehrinde deponuzu tam doldurun, sonraki istasyonlar oldukça seyrektir."
            },
            {
                "t": "Önemli Uyarı",
                "d": "S. Arabistan'da neredeyse her 5 km'de bir radar kamerası mevcut, ortalam hız 120 ama şehir girişlerinde 90, Medine ile Mekke arası hız sınırı 140'a kadar yükselebiliyor."
            },
        ]
    },
        {
        "id": "g5",
        "title": "Dönüş Yolculuğu",
        "icon": "log-out",
        "color": "red",
        "content": [
            {
                "t": "S. Arabistan'dan Çıkış",
                "d": "İşlemler çok kısa sürüyor, herhangi bir ücret ödenmiyor."
            },
            {
                "t": "Ürdün'e Giriş (Dönüş)",
                "d": "Araç sigortası soruluyor, daha önce yaptırdığınız sigortanın evrakını gösterebilirsiniz. Ürdün'e giriş için 20 JOD araç giriş vergisi nakit olarak ödeniyor, başka ücret yok."
            },
            {
                "t": "Suriye'ye Giriş (Dönüş)",
                "d": "50$ araç için ödeme, 25$ kişi başı transit geçiş ücreti ödeniyor. Araç X-Ray'den geçiriliyor. Hurma ve zemzem problem olmuyor."
            },
            {
                "t": "Türkiye'ye Giriş",
                "d": "Herhangi bir ücret yok, vatanımıza hoş geldiniz."
            },
        ]
    }
];

const MIQAT_DATA = [
    { id: "mq1", title: "Zülhuleyfe (Ebâ Ali)", desc: "Medine yönünden gelenlerin mikat mahallidir. (Mekke'ye ~450km).", lat: 24.4136, lng: 39.5447, image: "/images/zulhuleyfe_mikat.jpg" },
    { id: "mq2", title: "Cuhfe (Râbiğ)", desc: "Şam, Mısır ve Türkiye yönünden gelenlerin mikatıdır. (Mekke'ye ~187km).", lat: 22.6957, lng: 39.1444, image: "/images/cuhfe_mikat.jpg" },
    { id: "mq3", title: "Karnü'l-Menâzil", desc: "Necid ve Kuveyt yönü mikatıdır. (Mekke'ye ~94km).", lat: 21.6344, lng: 40.4239, image: "/images/manazil_mikat.jpg" },
    { id: "mq4", title: "Yelemlem", desc: "Yemen yönü mikatıdır. (Mekke'ye ~54km).", lat: 20.5178, lng: 39.8703, image: "/images/yelemlem_mikat.jpg" },
    { id: "mq5", title: "Zât-i Irk", desc: "Irak yönü mikatıdır. (Mekke'ye ~94km).", lat: 21.9333, lng: 40.4333, image: "/images/zatirk_mikat.jpg" }
];

const DICTIONARY_DATA = [
    { 
        id: "cat_sinir",
        cat: "Sınır & Gümrük", 
        icon: "passport",
        items: [
            { tr: "Transit geçiş yapacağım.", ar: "Ena 'abir transit.", pron: "Ene abir transit", en: "I am transit passenger." },
            { tr: "Pasaportlar burada.", ar: "Hazihi hiye cevazat.", pron: "Hazihi hiye cevazat", en: "Here are passports." },
            { tr: "Araç ruhsatı.", ar: "Rukhsat al-sayyara.", pron: "Ruhsat-el seyyara", en: "Car registration." },
            { tr: "Vize evraklarım.", ar: "Avrak al-teşira.", pron: "Evrak el-teşira", en: "Visa documents." },
            { tr: "Bagajı açayım mı?", ar: "Eftah al-şanta?", pron: "Eftah el şanta?", en: "Open the trunk?" },
            { tr: "Sadece kişisel eşya.", ar: "Eğrad şahsiyye fakat.", pron: "Eğrad şahsiyye fakat", en: "Personal items only." },
            { tr: "Sigorta ofisi nerede?", ar: "Ayna mekteb al-ta'min?", pron: "Eyne mekteb et-tamin?", en: "Where is insurance office?" },
            { tr: "Ne kadar ödeyeceğim?", ar: "Kam al-meblağ?", pron: "Kem el meblağ?", en: "How much to pay?" },
            { tr: "Türküm / Türkiyeliyiz.", ar: "Ene Turki.", pron: "Ene Turki", en: "I am Turkish." }
        ]
    },
    { 
        id: "cat_yol",
        cat: "Yol & Yakıt", 
        icon: "fuel",
        items: [
            { tr: "Depoyu fulle lütfen.", ar: "Fawwil law samaht (Full).", pron: "Fawwil law semaht", en: "Full tank please." },
            { tr: "Dizel (Mazot) var mı?", ar: "Fi dizel?", pron: "Fi dizel?", en: "Do you have diesel?" },
            { tr: "Benzin (91 / 95)", ar: "Benzin (Wahid w tisa'in)", pron: "Benzin", en: "Petrol" },
            { tr: "Lastik tamircisi nerede?", ar: "Ayna bançari?", pron: "Eyne bançari?", en: "Where is tire shop?" },
            { tr: "Lastiğim patladı.", ar: "Al-kafarat banshar.", pron: "El keferat banşar", en: "Flat tire." },
            { tr: "En yakın otel nerede?", ar: "Ayna akrab funduq?", pron: "Eyne akrab funduk?", en: "Nearest hotel?" },
            { tr: "Yol tarifi verir misin?", ar: "Mumkin wasf al-tariq?", pron: "Mumkin wasf el-tarik?", en: "Directions please?" },
            { tr: "Lavabo nerede?", ar: "Ayna al-hammam?", pron: "Eyne el hammam?", en: "Where is toilet?" },
            { tr: "Mescid nerede?", ar: "Ayna al-mescid?", pron: "Eyne el mescid?", en: "Where is mosque?" }
        ]
    },
    { 
        id: "cat_otel",
        cat: "Otel & Konaklama", 
        icon: "bed-double",
        items: [
            { tr: "Boş odanız var mı?", ar: "Fi gurfa fadıya?", pron: "Fi gurfa fadiya?", en: "Empty room?" },
            { tr: "Bir gecelik fiyat nedir?", ar: "Kam si'r al-layla?", pron: "Kem si'r el leyle?", en: "Price for one night?" },
            { tr: "4 kişiyiz.", ar: "Nahnu arba'a ashkas.", pron: "Nahnu arba eşhas", en: "We are 4 people." },
            { tr: "Odayı görebilir miyim?", ar: "Mumkin aşuf al-gurfa?", pron: "Mumkin eşuf el gurfa?", en: "Can I see room?" },
            { tr: "İnternet şifresi nedir?", ar: "Kam remz al-wifi?", pron: "Kem remz el vayfay?", en: "Wifi password?" },
            { tr: "Havlu istiyorum.", ar: "Ebi manşafa.", pron: "Ebi manşafa", en: "Need towel." },
            { tr: "Klima çalışmıyor.", ar: "Al-mukayyif atlan.", pron: "El mukayyif atlan", en: "AC not working." },
            { tr: "Çıkış yapacağız.", ar: "Sawwi khuruj.", pron: "Savvi huruc", en: "Check out." }
        ]
    },
    { 
        id: "cat_alisveris",
        cat: "Alışveriş & Pazar", 
        icon: "shopping-bag",
        items: [
            { tr: "Bunun fiyatı ne kadar?", ar: "Bikam haza?", pron: "Bi kem haza?", en: "How much is this?" },
            { tr: "Çok pahalı!", ar: "Ghali jiddan!", pron: "Gali cidden!", en: "Too expensive!" },
            { tr: "İndirim yap.", ar: "Sawwi khasm.", pron: "Savvi hasm", en: "Make discount." },
            { tr: "Son fiyat ne olur?", ar: "Kam ahir?", pron: "Kem ahir?", en: "Last price?" },
            { tr: "Hurma almak istiyorum.", ar: "Ebi tamr.", pron: "Ebi tamr", en: "I want dates." },
            { tr: "Zemzem suyu var mı?", ar: "Fi ma' zamzam?", pron: "Fi ma zemzem?", en: "Have Zamzam water?" },
            { tr: "Kredi kartı geçerli mi?", ar: "Fi şebeke (bitaqa)?", pron: "Fi şebeke?", en: "Credit card accepted?" },
            { tr: "Poşet verir misin?", ar: "Atini kis.", pron: "Atini kis", en: "Give me bag." }
        ]
    },
    { 
        id: "cat_yemek",
        cat: "Yeme & İçme", 
        icon: "utensils",
        items: [
            { tr: "Menü lütfen.", ar: "Al-menu law samaht.", pron: "El menu law semaht", en: "Menu please." },
            { tr: "Su istiyorum (Soğuk).", ar: "Ebi ma barid.", pron: "Ebi ma barid", en: "Water (Cold)." },
            { tr: "Tavuk / Et / Pilav", ar: "Dajaj / Lahm / Ruz", pron: "Decec / Lahm / Ruz", en: "Chicken/Meat/Rice" },
            { tr: "Acısız olsun.", ar: "Bidun har (shatta).", pron: "Bidun har", en: "No spicy." },
            { tr: "Çay (Şekersiz)", ar: "Shay (Bidun sukkar)", pron: "Şay (Bidun sukker)", en: "Tea (No sugar)" },
            { tr: "Hesap lütfen.", ar: "Al-hisab law samaht.", pron: "El hisab law semaht", en: "Check please." },
            { tr: "Paket yap.", ar: "Sawwi safari.", pron: "Savvi seferi", en: "Take away." }
        ]
    },
    { 
        id: "cat_ibadet",
        cat: "Mescid & İbadet", 
        icon: "moon",
        items: [
            { tr: "Abdest alacağım.", ar: "Ebi atawadda.", pron: "Ebi etevadda", en: "Make wudu." },
            { tr: "Abdesthane nerede?", ar: "Ayna al-mawada?", pron: "Eyne el mavada?", en: "Wudu area?" },
            { tr: "Burası kadınlar için mi?", ar: "Haza li nisa?", pron: "Haza li nisa?", en: "For women?" },
            { tr: "Kabe ne tarafta?", ar: "Ayna al-Kaaba?", pron: "Eyne el Kabe?", en: "Where is Kaaba?" },
            { tr: "Tekerlekli sandalye lazım.", ar: "Ebi arabiyya.", pron: "Ebi arabiyye", en: "Need wheelchair." },
            { tr: "Giriş yasak mı?", ar: "Memnu al-duhul?", pron: "Memnu el duhul?", en: "Entry forbidden?" }
        ]
    },
    { 
        id: "cat_acil",
        cat: "Acil & Sağlık", 
        icon: "ambulance",
        items: [
            { tr: "Yardım edin!", ar: "Sa'iduni!", pron: "Saiduni!", en: "Help me!" },
            { tr: "Hastayım.", ar: "Ene marid.", pron: "Ene marid", en: "I am sick." },
            { tr: "Hastaneye gitmem lazım.", ar: "Lazim ruh mustashfa.", pron: "Lazim ruh musteşfa", en: "Need hospital." },
            { tr: "Ağrım var.", ar: "Indi elem.", pron: "İndi elem", en: "I have pain." },
            { tr: "Eczane nerede?", ar: "Ayna saydaliyya?", pron: "Eyne saydaliye?", en: "Pharmacy?" },
            { tr: "Polis çağırın.", ar: "Nadi al-shurta.", pron: "Nadi el şurta", en: "Call police." },
            { tr: "Kayboldum.", ar: "Ene dayi.", pron: "Ene dayi", en: "I am lost." },
            { tr: "Telefonumu kaybettim.", ar: "Dayya'tu jawwali.", pron: "Dayyatu cevvali", en: "Lost my phone." }
        ]
    },
    { 
        id: "cat_genel",
        cat: "Tanışma & Genel", 
        icon: "message-circle",
        items: [
            { tr: "Selamun Aleyküm", ar: "Es-selamu Aleykum", pron: "Selamun Aleykum", en: "Peace be upon you" },
            { tr: "Teşekkürler", ar: "Shukran", pron: "Şukran", en: "Thanks" },
            { tr: "Evet / Hayır", ar: "Na'am / La", pron: "Naam / La", en: "Yes / No" },
            { tr: "Sorun yok / Tamam", ar: "Mafi mushkila / Tamam", pron: "Mafi muşkila", en: "No problem / Ok" },
            { tr: "Lütfen", ar: "Min fadlik / Law samaht", pron: "Min fadlik", en: "Please" },
            { tr: "Adın ne?", ar: "Eş ismuk?", pron: "Eş ismuk?", en: "Your name?" },
            { tr: "Anlamıyorum.", ar: "Ma afham.", pron: "Ma efhem", en: "I don't understand." },
            { tr: "Arapça bilmiyorum.", ar: "Ma a'rif arabi.", pron: "Ma arif arabi", en: "No Arabic." }
        ]
    }
];

const PLACES_DATA = [
    {
        "category": "Suriye",
        "items": [
            {
                "id": "s1",
                "title": "Şam Emevi Camii",
                "desc": "İslâm dinî mimarisinin bugüne kadar ayakta kalabilen ilk muhteşem örneği.",
                "lat": 33.5116,
                "lng": 36.3065,
                "image": "/images/gezi_suri_emevicamii.jpg",
                "youtube": "https://youtu.be/VIg8bJxRyNw" // Örnek Link
            },
            {
                "id": "s2",
                "title": "Hama Su Dolapları",
                "desc": "Yunus Emre'nin adına şiirler yazdığı (Dertli Dolap) Asi Nehri üzerindeki tarihi su dolapları (Norias).",
                "lat": 35.1354,
                "lng": 36.7505,
                "image": "/images/gezi_suri_hamasudolap.jpg"
            },
            {
                "id": "s3",
                "title": "Halep Kalesi",
                "desc": "Dünyanın en eski ve en büyük kalelerinden biri.",
                "lat": 36.1993,
                "lng": 37.1628,
                "image": "/images/gezi_suri_halepkale.jpg"
            }
        ]
    },
    {
        "category": "Ürdün",
        "items": [
            {
                "id": "j1",
                "title": "Ashab-ı Kehf",
                "desc": "Yedi Uyurlar Mağarası (Amman).",
                "lat": 31.9288,
                "lng": 35.9525,
                "image": "/images/gezi_urdun_yediuyur.jpg"
            },
            {
                "id": "j2",
                "title": "Mute Savaşı Alanı",
                "desc": "İslam ordusunun Bizans ile ilk karşılaştığı yer ve şehitlikler.",
                "lat": 31.0556,
                "lng": 35.7001,
                "image": "/images/gezi_urdun_mutesavas.png"
            },
            {
                "id": "j3",
                "title": "Hicaz Demiryolu (Amman)",
                "desc": "Tarihi Osmanlı tren istasyonu ve müzesi.",
                "lat": 31.9705,
                "lng": 35.9419,
                "image": "/images/gezi_urdun_hicazdemiryolu.jpg"
            }
        ]
    },
    {
        "category": "Tebük",
        "items": [
            {
                "id": "t1",
                "title": "Tevbe Mescidi",
                "desc": "Peygamber efendimizin 10 gün konakladığı rivayet edilen alan ve mescid.",
                "lat": 28.3840,
                "lng": 36.5575,
                "image": "/images/gezi_tebuk_tevbemescidi.webp",
                "youtube": "https://youtu.be/5aT4FYscLCg" // Link
            },
            {
                "id": "t2",
                "title": "Tebük Tren İstasyonu - Hicaz Demiryolu",
                "desc": "Bu istasyon, Hicaz Demiryolu hattı üzerinde bulunan önemli duraklardan biridir ve Şam’dan Medine’ye giden hat üzerinde yer alır.",
                "lat": 28.3874,
                "lng": 36.5617,
                "image": "/images/gezi_tebuk_istasyon.webp",
                "youtube": "https://youtu.be/j_1AkEkpPNI" // Link
            },
            {
                "id": "t3",
                "title": "Tebük (Osmanlı) Kalesi",
                "desc": "Osmanlı Sultanı Kanuni Sultan Süleyman döneminde Hicri 967/Miladi 1559 yılında inşa edilmiştir.",
                "lat": 28.3824,
                "lng": 36.5565,
                "image": "/images/gezi_tebuk_osmanlikalesi.webp",
                "youtube": "https://youtu.be/P8oicw7-0y4" // Link
            }
        ]
    },
    {
        "category": "Diğer Bölgeler",
        "items": [
            {
                "id": "db1",
                "title": "Medyen (Madyan)",
                "desc": "Şuayb Aleyhisselamın yaşadığı bölge.",
                "lat": 28.4878,
                "lng": 35.0032,
                "image": "/images/gezi_tebuk_madyan.webp",
                "youtube": "https://youtu.be/Jq6MQIxpz0M" // Link   
            },
            {
                "id": "db2",
                "title": "El-Suaidani Kuyusu (Musa Kuyusu)",
                "desc": "İslamî kaynaklara göre, El-Suaidani Kuyusu, Hz. Musa ve ailesinin Madyan’da yaşadığı dönemde su ihtiyacını karşıladığı ve bölgedeki Hz. Musa ile Şuayb Aleyhisselam’ın yaşadığı alanlarla bağlantılı önemli bir yerdir.",
                "lat": 28.4854,
                "lng": 35.0188,
                "image": "/images/gezi_tebuk_musakuyusu.webp",
                "youtube": "https://youtu.be/BQps8OobfK4" // Link
            },
            {
                "id": "db3",
                "title": "Medain-i Salih (Hz. Salih Deve Mucizesi)",
                "desc": "Medain-i Salih, Hz. Salih’in kavmine mucize olarak gönderilen deve ile ilişkilendirilen tarihî bir yerdir.",
                "lat": 26.8089,
                "lng": 37.8697,
                "image": "/images/gezi_digerbolge_hzsalihasdevesi.webp",
                "youtube": "https://youtu.be/kLV_J1CGHIs" // Link
            }
        ]
    },
    {
        "category": "Medine",
        "items": [
            {
                "id": "md1",
                "title": "Mescid-i Nebevi",
                "desc": "Hz. Peygamber'in kabr-i şerifi ve Ravza-i Mutahhara.",
                "lat": 24.4672,
                "lng": 39.6109,
                "image": "/images/gezi_medine_mescidinebevi.jpg",
                "youtube": "https://youtu.be/V0MBqmFwdaw" // Link
            },
            {
                "id": "md2",
                "title": "Ravza-i Mutahhara",
                "desc": "Hz. Peygamber’in kabri ile minberi arasındaki bölüm; hadislerde cennet bahçelerinden biri olarak zikredilir.",
                "lat": 24.467350,
                "lng": 39.611200,
                "image": "/images/nophoto.webp",
                "youtube": "https://youtu.be/8tGXJ4cCU6E" // Link
            },
            {
                "id": "md3",
                "title": "Cennetü’l-Bakî",
                "desc": "Birçok sahabe ve Ehl-i Beyt mensubunun medfun bulunduğu tarihi mezarlık.",
                "lat": 24.468000,
                "lng": 39.612000,
                "image": "/images/nophoto.webp",
                "youtube": "https://youtu.be/eDJyW8dG7aU" // Link
            },
            {
                "id": "md4",
                "title": "Kuba Mescidi",
                "desc": "Efendimizin de inşaatında çalıştığı, İslam tarihinde inşa edilen ilk mescit.",
                "lat": 24.4393,
                "lng": 39.6173,
                "image": "/images/gezi_medine_kubamescidi.jpg",
                "youtube": "https://youtu.be/RW-WN1Ps4BQ" // Link
            },
            {
                "id": "md5",
                "title": "Mescid-i Kıbleteyn",
                "desc": "Kıblenin Kudüs’ten Kâbe’ye çevrildiği sırada namaz kılınan mescit.",
                "lat": 24.484600,
                "lng": 39.579200,
                "image": "/images/nophoto.webp",
                "youtube": "https://youtu.be/F4OXRMm7Ask" // Link
            },
            {
                "id": "md6",
                "title": "Uhud Dağı ve Şehitliği",
                "desc": "Hz. Hamza ve Uhud şehitlerinin medfun olduğu yer.",
                "lat": 24.5034,
                "lng": 39.6117,
                "image": "/images/gezi_medine_uhuddagi.jpg",
                "youtube": "https://youtu.be/exCZb2lwHOY" // Link
            },
            {
                "id": "md7",
                "title": "Yedi Mescidler (Hendek)",
                "desc": "Hendek Savaşı'nın yapıldığı bölge.",
                "lat": 24.4782,
                "lng": 39.5934,
                "image": "/images/gezi_medine_yedimescidhendek.jpg",
                "youtube": "https://youtu.be/kz-QLn9dx2U" // Link
            }
        ]
    },
    {
        "category": "Mekke",
        "items": [
            {
                "id": "m1",
                "title": "Mescid-i Haram",
                "desc": "Kabe-i Muazzama'nın bulunduğu en kutsal mescit.",
                "lat": 21.422487,
                "lng": 39.826206,
                "image": "/images/mescidiharam.jpg",
                "youtube": "https://youtu.be/VIg8bJxRyNw" // Örnek Link
            },
            {
                "id": "m2",
                "title": "Sevr Mağarası (Cebel-i Sevr)",
                "desc": "Hicret esnasında Hz. Muhammed ve Hz. Ebubekir’in üç gün gizlendiği mağara.",
                "lat": 21.3779,
                "lng": 39.8579,
                "image": "/images/sevrdagi.jpg",
                "youtube": "https://youtu.be/XWg8NCwg-dE" // Link
            },
            {
                "id": "m3",
                "title": "Hira Mağarası (Cebel-i Nur)",
                "desc": "Hz. Muhammed’e ilk vahyin geldiği mağara; Nur Dağı üzerinde yer alır.",
                "lat": 21.4568,
                "lng": 39.8593,
                "image": "/images/gezi_mekke_hiramagara.jpg",
                "youtube": "https://youtu.be/4aiIXBsIJv8" // Link
            },
            {
                "id": "m4",
                "title": "Cennetü’l-Muallâ",
                "desc": "Hz. Hatice validemiz başta olmak üzere birçok sahabenin medfun bulunduğu tarihi mezarlık.",
                "lat": 21.4350,
                "lng": 39.8279,
                "image": "/images/gezi_mekke_cennetulmualla.webp",
                "youtube": "https://youtu.be/pLXOHMvXgdQ" // Link
            },
            {
                "id": "m5",
                "title": "Arafat ve Cebel-i Rahme",
                "desc": "Vakfe'nin yapıldığı, Hz. Adem ile Hz. Havva'nın buluştuğu tepe.",
                "lat": 21.3549,
                "lng": 39.9841,
                "image": "/images/gezi_mekke_arafatdagi.jpg",
                "youtube": "https://youtu.be/lHh8EO1I4s4" // Link
            },
            {
                "id": "m6",
                "title": "Müzdelife",
                "desc": "Arafat vakfesinden sonra gece vakfesinin yapıldığı ve şeytan taşlamak için taş toplanan bölge.",
                "lat": 21.383000,
                "lng": 39.902000,
                "image": "/images/gezi_mekke_muzdelife.webp",
                "youtube": "https://youtu.be/zZ-jF8_ZysU" // Link
            },
            {
                "id": "m7",
                "title": "Mina",
                "desc": "Hac menasikinin icra edildiği bölge; şeytan taşlama ibadeti burada yapılır.",
                "lat": 21.413300,
                "lng": 39.893000,
                "image": "/images/gezi_mekke_mina.webp",
                "youtube": "https://youtu.be/i4Akr4lsXBQ" // Link
            },
            {
                "id": "m8",
                "title": "Hudeybiye (Şumeysiye)",
                "desc": "Hudeybiye Antlaşması’nın imzalandığı bölge; İslam tarihinde dönüm noktası kabul edilir.",
                "lat": 21.4386,
                "lng": 39.6282,
                "image": "/images/gezi_mekke_hudeybiye.webp",
                "youtube": "https://youtu.be/6RbzHin55MI" // Link
            },
            {
                "id": "m9",
                "title": "Mescid-i Cin",
                "desc": "Cin suresinin nüzulüyle ilişkilendirilen, tarihi mescit.",
                "lat": 21.4334,
                "lng": 39.8288,
                "image": "/images/gezi_mekke_cinmescidi.webp",
                "youtube": "https://youtu.be/9cpd9g7L-AY" // Link
            },
            {
                "id": "m10",
                "title": "Akabe Biat Yeri",
                "desc": "Medineli Müslümanların Hz. Muhammed’e (s.a.v.) biat ettiği yer olarak bilinir.",
                "lat": 21.4148,
                "lng": 39.8950,
                "image": "/images/gezi_mekke_akabebiadyeri.webp",
                "youtube": "https://youtu.be/LIfMqjHNiQI" // Link
            },
            {
                "id": "m11",
                "title": "Tifle (Tefle) Kuyusu",
                "desc": "Usfan’daki Tıfle Kuyusu, Peygamber Efendimizin (s.a.v.) ağzına aldığı acı suyu Allah’ın izniyle tatlılaştırdığı mucizevi bir kuyu olarak bilinir.",
                "lat": 21.9238,
                "lng": 39.3504,
                "image": "/images/gezi_mekke_tiflekuyusu.webp",
                "youtube": "https://youtu.be/O-_J2vfEQVM" // Link
            },
            {
                "id": "m12",
                "title": "Usfan (Asfan) Osmanlı Kalesi",
                "desc": "Usfan Osmanlı Kalesi, Mekke–Medine yolu üzerinde eski hac ve ticaret yollarını korumak için inşa edilmiş tarihî bir yapıdır.",
                "lat": 21.9163,
                "lng": 39.3398,
                "image": "/images/gezi_mekke_usfankalesi.webp",
                "youtube": "https://youtu.be/Wm0P7nfaK3Q" // Link
            }
        ]
    }
];

// DUYURULAR
const ANNOUNCEMENTS = [
    "🕋 Niyetle başla, sabırla sür, rahmetle var.",
    "📢 Suriye geçişinin gündüz yapılması önerilmektedir!",
    "🪪 Ruhsat sahibi araçta yoksa noter onaylı vekaletname şarttır.",
    "💵 Suriye sınırında sadece nakit (USD veya TL) geçerlidir.",
    "🛂 Umre vizesinin son verilme (başvuru) tarihi: 20 Mart 2026",
    "📅 Hac sezonu başlayacağı için bu tarihten sonra Umre vizesi verilmeyecektir.",
    "💵 USD ödemeler için dövizi önceden temin ediniz; kur farkına maruz kalmayınız.",
    "🕋 'Mekke ve Medine’den Esintiler' YouTube kanalında kutsal topraklar hakkında bilgi edinebilirsiniz.",
    "🧑‍🔧 'Acil Numaralar' bölümüne Türk oto tamir ustaları iletişim bilgileri eklendi.",
    "🤲 Allah umrenizi kabul eylesin ve kolaylaştırsın."
];

const ROUTE_SIMULATION_DATA = [
    {
        "id": 1,
        "city": "Hatay / Cilvegözü",
        "action": "Başlangıç",
        "desc": "Türkiye'den çıkış işlemleri. Ruhsat kontrolü ve harç pulu.",
        "type": "start",
        "color": "red",
        "time": "08:00",
        "km_info": "0 km",
        "tips": ["Ruhsat sahibinin araçta olduğundan emin olun.", "Harç pulunuzu dijital aldıysanız barkodu hazırlayın."]
    },
    {
        "id": 2,
        "city": "Bab-al Hawa (Suriye)",
        "action": "Sınır Kapısı",
        "desc": "Suriye'ye giriş. Araç karnesi ve vize ödemeleri (Nakit).",
        "type": "border",
        "warning": "Gündüz sürüşü tercih edin",
        "color": "amber",
        "time": "09:30",
        "km_info": "+10 km",
        "tips": ["Nakit dolar (küçük banknot) bulundurun.", "İşlemler yoğunluğa bağlı olarak biraz zaman alabilir."]
    },
    {
        "id": 3,
        "city": "İdlib - Hama - Humus",
        "action": "Transit",
        "desc": "M5 Otoyolu üzerinden güneye iniş. Tarihi İpek Yolu güzergahı.",
        "type": "road",
        "color": "slate",
        "time": "13:00",
        "km_info": "+250 km",
        "tips": ["Mola vermeden devam etmeniz önerilir.", "Yol üzerindeki kontrol noktalarında pasaportunuz hazır olsun."]
    },
    {
        "id": 4,
        "city": "Şam (Dera)",
        "action": "Geçiş",
        "desc": "Şam çevre yolundan Dera yönüne devam.",
        "type": "road",
        "color": "slate",
        "time": "16:00",
        "km_info": "+200 km",
        "tips": ["Navigasyon çevrimdışı haritalarını kontrol edin."]
    },
    {
        "id": 5,
        "city": "Nassib / Jaber",
        "action": "Gümrük",
        "desc": "Suriye çıkış, Ürdün giriş. Detaylı X-Ray ve bagaj kontrolü.",
        "type": "border",
        "color": "blue",
        "time": "18:00",
        "km_info": "+100 km",
        "tips": ["Tüm valizleri indirmeye hazırlıklı olun.", "Ürdün sigortası için nakit JOD gerekebilir."]
    },
    {
        "id": 6,
        "city": "Amman - Ma'an",
        "action": "Mola",
        "desc": "Ürdün içi transit. İhtiyaç ve yemek molası.",
        "type": "city",
        "color": "slate",
        "time": "21:00",
        "km_info": "+150 km",
        "tips": ["Ürdün'de yakıt nispeten pahalıdır.", "Mola yerlerinde Ürdün Dinarı (JOD) veya Kredi Kartı geçerlidir."]
    },
    {
        "id": 7,
        "city": "Halat Ammar",
        "action": "Suudi Girişi",
        "desc": "Suudi Arabistan'a hoşgeldiniz. Parmak izi ve göz taraması.",
        "type": "border",
        "color": "green",
        "time": "00:00",
        "km_info": "+300 km",
        "tips": ["Vize çıktılarınızı ve pasaportları düzenli tutun.", "Araç sigortasını sınırda yaptırmayı unutmayın."]
    },
    {
        "id": 8,
        "city": "Tebük",
        "action": "Yakıt & İkmal",
        "desc": "Depoyu mutlaka fulleyin. Uzun çöl geçişi başlıyor.",
        "type": "fuel",
        "warning": "Sonraki 400km benzinlik yok",
        "color": "red",
        "time": "02:00",
        "km_info": "+100 km",
        "tips": ["Su ve atıştırmalık stoklayın.", "Hız sınırlarına dikkat edin (Kameralar aktif)."]
    },
    {
        "id": 9,
        "city": "Medine-i Münevvere",
        "action": "Vuslat",
        "desc": "Peygamber Efendimiz'e (s.a.v) kavuşma anı.",
        "type": "holy",
        "color": "emerald",
        "time": "08:00",
        "km_info": "+650 km",
        "tips": ["Şehre girmeden önce Salavat-ı Şerife getirin.", "Konaklayacaksanız otele yerleşip Mescid-i Nebevi'ye geçin."]
    },
    {
        "id": 10,
        "city": "Zülhuleyfe (Mikat)",
        "action": "İhram & Niyet",
        "desc": "Medine'den çıkışta Mikat sınırı. İhrama girme ve niyet noktası.",
        "type": "miqat",
        "color": "indigo",
        "time": "14:00",
        "km_info": "+12 km",
        "tips": ["2 Rekat İhram namazı kılın.", "Niyet edip Telbiye getirmeye başlayın."]
    },
    {
        "id": 11,
        "city": "Mekke-i Mükerreme",
        "action": "Kutsal Belde",
        "desc": "Yer yüzündeki en şerefli mabet: Mescid-i Haram.",
        "type": "holy",
        "km": 0,
        "time": "Varış",
        "km_info": "+450 km",
        "tips": ["İhram yasaklarına dikkat edin.", "Kabe'yi ilk gördüğünüzde dua etmeyi unutmayın."]
    }
];

const CHECKLISTS_DATA = {
    "Resmi Evraklar": [
        { id: "d1", label: "Pasaport", desc: "En az 6 ay geçerlilik süresi olmalı. Sınırlarda aslı istenir.", icon: "book" },
        { id: "d2", label: "Suudi Arabistan E-Vizesi", desc: "Çıktısı (kağıt) ve dijital hali (PDF) mutlaka yanınızda olmalı.", icon: "file-text" },
        { id: "d3", label: "Araç Ruhsatı (Aslı)", desc: "Araç sahibi değilseniz noter onaylı vekaletname şarttır.", icon: "car" },
        { id: "d4", label: "Ehliyet (Yeni Tip)", desc: "Uluslararası geçerliliği olan çipli ehliyet gereklidir.", icon: "credit-card" },
        { id: "d5", label: "Uluslararası Sigorta (Yeşil Kart)", desc: "Turing veya sigortacıdan 'Yurtdışı Teminatı' ekletilmeli.", icon: "shield-check" },
        { id: "d6", label: "Evlilik Cüzdanı", desc: "Bazı otellerde veya sınırda nadiren de olsa sorulabilir.", icon: "users" }
    ],
    "İbadet & Giyim": [
        { id: "c1", label: "İhram", desc: "2 parça olmalı, dikişsiz olmalı.", icon: "shirt" },
        { id: "c2", label: "İhram Kemeri / Bel Çantası", desc: "Pasaport ve parayı tavafta düşürmemek için önerilir.", icon: "briefcase" },
        { id: "c3", label: "Ortopedik Terlik/Sandalet", desc: "Çok yürüneceği için ayak vurmayan, kaliteli terlik.", icon: "footprints" },
        { id: "c4", label: "Spor Ayakkabı", desc: "Gezilerinizde ayaklarınızın rahat etmesi için.", icon: "footprints" },
        { id: "c5", label: "Tavaf Patiği", desc: "Mermerlerde ayakların kaymaması ve kirlenmemesi için.", icon: "socks" },
        { id: "c6", label: "İnce Seccade", desc: "Yolda veya Mescid bahçesinde namaz kılmak için.", icon: "rug" },
        { id: "c7", label: "Güneş Gözlüğü & Şapka", desc: "Gündüz tavaflarında güneşten korunmak için.", icon: "sun" },
        { id: "c8", label: "Yedek Kıyafetler", desc: "Terletmeyen pamuklu/keten açık renk kıyafetler.", icon: "shirt" }
    ],
    "Sağlık & Bakım": [
        { id: "h1", label: "Kokusuz Sabun & Şampuan", desc: "İhramlıyken kokulu ürün kullanmak yasaktır.", icon: "bath" },
        { id: "h2", label: "Pişik Kremi / Pudra", desc: "Uzun yürüyüşlerde bacak arası pişikleri için hayati önem taşır.", icon: "activity" },
        { id: "h3", label: "Ağrı Kesici & Kas Gevşetici", desc: "Yorgunluk ve kas ağrıları için.", icon: "pill" },
        { id: "h4", label: "Güneş Kremi", desc: "Yüksek faktörlü koruyucu krem.", icon: "sun" },
        { id: "h5", label: "Maske", desc: "Özellikle kapalı alanlarda kullanım için.", icon: "scan-heart" },
        { id: "h6", label: "Pastil", desc: "Boğaz ağrıları ve ağız kuruluğu için.", icon: "circle" },
        { id: "h7", label: "Tırnak Makası & Küçük Makas", desc: "İhramdan çıkarken saç tıraşı ve tırnak kesimi için.", icon: "scissors" }
    ],
    "Araç & Elektronik": [
        { id: "e1", label: "Powerbank", desc: "Uzun yolculukta ve Harem'de şarj bitmemesi için.", icon: "battery-charging" },
        { id: "e2", label: "Araç Şarj Aleti & Kablo", desc: "Navigasyon kullanımı şarjı hızlı tüketir.", icon: "zap" },
        { id: "e3", label: "Lastik Tamir Kiti / Stepne", desc: "Çöl yollarında lastik patlamasına hazırlıklı olun.", icon: "tool" },
        { id: "e4", label: "Motor Yağı & Su", desc: "Bir miktar yedek motor yağı, su ve silecek suyu bulundurun.", icon: "droplet" },
        { id: "e5", label: "El Feneri", desc: "Gece sürüşünde olası bir lastik değişimi vb. için.", icon: "flashlight" }
    ],
    "Yiyecek & Diğer": [
        { id: "f1", label: "Su & Atıştırmalık", desc: "Yolculuk sırasında enerji düşüklüğüne karşı. Kahve vb.", icon: "coffee" },
        { id: "f2", label: "Termos", desc: "Zemzem veya soğuk su taşımak için.", icon: "cup-soda" },
        { id: "f3", label: "Kuruyemiş", desc: "Pratik, sağlıklı ve tok tutması için.", icon: "cookie" },
        { id: "f4", label: "Mini Sırt Çantası", desc: "Tavaf sırasında ayakkabı, seccade vb. koymak için.", icon: "backpack" }
    ]
};

const EMERGENCY_NUMBERS = [
    // --- T.C. Resmi Makamlar ---
    { title: "T.C. Cidde Başkonsolosluğu", number: "+966126601607", icon: "building-2", desc: "Pasaport, kimlik vb. işlemler" },
    { title: "T.C. Cidde Başkonsolosluğu ACİL", number: "+966532079651", icon: "shield-alert", desc: "Mesai dışı hayati acil durumlar" },
    { title: "Dışişleri Çağrı Merkezi", number: "+903122922929", icon: "globe", desc: "Ankara 7/24 Destek Hattı" },

    // --- Sağlık ve Güvenlik ---
    { title: "Genel Acil (Mekke Bölgesi)", number: "911", icon: "bell-ring", desc: "Polis/Ambulans/İtfaiye Birleşik" },
    { title: "Ambulans (İs'af)", number: "997", icon: "ambulance", desc: "Tıbbi Acil Müdahale" },
    { title: "Suudi Polis (Şurta)", number: "999", icon: "shield", desc: "Güvenlik ve Asayiş" },
    { title: "İtfaiye (Sivil Savunma)", number: "998", icon: "flame", desc: "Yangın ve Afet Durumu" },

    // --- Trafik ve Yol ---
    { title: "Trafik Polisi (Murur)", number: "993", icon: "car", desc: "Yaralanmalı/Büyük Kaza" },
    { title: "Najm (Sigorta/Tutanak)", number: "920000560", icon: "file-text", desc: "Hasarlı/Yaralanmasız Kaza" },
    { title: "Otoyol Polisi", number: "996", icon: "road", desc: "Şehirlerarası Yol Güvenliği" },

    // --- Diğer ---
    { title: "Hac ve Umre Bakanlığı", number: "1966", icon: "info", desc: "Ziyaretçi Destek Hattı" }
];

// YENİ EKLENEN: Türk Oto Tamircileri Verisi
const AUTO_MECHANICS_DATA = [
    { id: "m1", city: "Tebük", name: "İbrahim Göze", phone: "+966508667395", type: "Genel Tamir" },
    { id: "m2", city: "Cidde", name: "Nevzat Usta (Usfan)", phone: "+966506633146", type: "Genel Tamir - Mekke yoluna yakın" },
    { id: "m3", city: "Cidde", name: "Cuma Usta", phone: "+966509255600", type: "Genel Tamir" },
    { id: "m4", city: "Cidde", name: "Sadık Usta", phone: "+966557087760", type: "Genel Tamir" },
    { id: "m5", city: "Cidde", name: "Ayhan Usta", phone: "+966504678876", type: "Kaporta" },
    { id: "m6", city: "Cidde", name: "Klimacı Ali Usta", phone: "+966551681938", altPhone: "+905340500909", type: "Oto Klima" },
    { id: "m7", city: "Medine", name: "İbrahim Göçer", phone: "+966552230284", type: "Genel Tamir" },
    { id: "m8", city: "Medine", name: "Araba Elektrik Tamir", phone: "+966575212043", type: "Oto Elektrik" },
    { id: "m9", city: "Medine", name: "Ali Eser", phone: "+966501428091", type: "Genel Tamir" },
    { id: "m10", city: "Medine", name: "Bilâl Ebû Ali", phone: "+966507375700", type: "Genel Tamir" },
    { id: "m11", city: "Mekke", name: "Mehmet Aydın", phone: "+966505571887", type: "Kaporta Tamir" },
];

const getWaLink = (phone) => `https://wa.me/${phone.replace(/[^0-9]/g, '')}`;

// --- BİLEŞENLER ---

const LucideIcon = ({ name, className }) => {
    return (
        <span 
            className="lucide-icon-wrapper"
            style={{ display: 'contents' }}
            dangerouslySetInnerHTML={{ __html: `<i data-lucide="${name}" class="${className || ''}"></i>` }} 
        />
    );
};

// --- GÜNCELLENMİŞ "ULTRA PREMIUM" DUYURU ALANI ---
const AnnouncementBar = () => {
    const [idx, setIdx] = useState(0);
    useEffect(() => {
        // Okuma süresini artırmak için 5 saniyeye çıkarıldı
        const timer = setInterval(() => setIdx(prev => (prev + 1) % ANNOUNCEMENTS.length), 5000);
        return () => clearInterval(timer);
    }, []);
    return (
        <div className="col-span-full relative group mb-2">
            <div className="absolute inset-0 bg-gradient-to-r from-gold-400 via-amber-500 to-gold-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-500"></div>
            <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-gold-500/30 dark:border-gold-500/20 rounded-2xl px-4 py-0 flex items-center gap-4 shadow-lg overflow-hidden h-[66px]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none transition-all group-hover:bg-gold-500/20"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none transition-all group-hover:bg-amber-500/20"></div>
                
                <div className="w-10 h-10 shrink-0 bg-gradient-to-br from-gold-400 to-amber-600 rounded-xl flex items-center justify-center shadow-md shadow-gold-500/30 relative z-10">
                    <LucideIcon name="bell-ring" className="w-5 h-5 text-white animate-pulse" />
                </div>
                
                <div className="flex-1 min-w-0 relative z-10 flex items-center justify-center h-full">
                    <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug line-clamp-2 text-center animate-fade-in w-full" key={idx}>
                        {ANNOUNCEMENTS[idx]}
                    </p>
                </div>
            </div>
        </div>
    );
};

const MenuCard = ({ icon, label, subLabel, colorClass, onClick }) => (
    <button onClick={onClick} className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md hover:border-gold-200 dark:hover:border-gold-500/30 transition-all flex items-center gap-3 group active:scale-95 text-left w-full h-full">
        <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${colorClass} bg-opacity-15 dark:bg-opacity-20 transition-transform group-hover:scale-110`}>
            <LucideIcon name={icon} className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
            <h3 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 leading-tight line-clamp-2">{label}</h3>
            <p className="text-[10px] text-slate-400 mt-0.5 truncate">{subLabel}</p>
        </div>
    </button>
);

const InstallBanner = ({ show, onInstall, onClose }) => {
    if (!show) return null;
    return (
        <div className="fixed bottom-24 left-4 right-4 z-50 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl p-4 shadow-2xl flex items-center justify-between border border-gold-500/30 animate-fade-in-up">
            <div className="flex items-center gap-3">
                <div className="bg-gold-500 p-2 rounded-xl"><LucideIcon name="download" className="w-5 h-5 text-slate-900" /></div>
                <div>
                    <h4 className="font-bold text-sm">Uygulamayı Yükle</h4>
                    <p className="text-[10px] text-slate-300">İnternetsiz kullanım için</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={onInstall} className="px-4 py-2 bg-gold-500 text-slate-900 text-xs font-bold rounded-lg hover:bg-gold-400">Yükle</button>
                <button onClick={onClose} className="p-2 text-slate-400 hover:text-white"><LucideIcon name="x" className="w-4 h-4" /></button>
            </div>
        </div>
    );
};

// --- OTEL & RESTORAN HARİTASI ---
const HotelsRestaurantsMap = ({ userLoc }) => {
    const mapRef = useRef(null);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const markersRef = useRef([]);

    // Otel, restoran ve harita için özel Kabe noktasını birleştiriyoruz
    const combinedPlaces = [
        ...HOTELS_RESTAURANTS_DATA.hotels.map(h => ({...h, type: 'hotel', title: h.name})),
        ...HOTELS_RESTAURANTS_DATA.restaurants.map(r => ({...r, type: 'restaurant', title: r.name})),
        { id: 'kaaba', title: 'Kabe-i Muazzama', type: 'kaaba', lat: 21.422487, lng: 39.826206, desc: 'Kâbe, ümmeti aynı safta buluşturan mukaddes mabet.', image: '/images/mescidiharam.jpg' }
    ];

    useEffect(() => {
        if(window.lucide) window.lucide.createIcons();
    });

    useEffect(() => {
        let isMounted = true;
        const loadLeaflet = async () => {
            if (!window.L) {
                const css = document.createElement('link');
                css.rel = 'stylesheet';
                css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                document.head.appendChild(css);

                const loadScript = (src) => new Promise(resolve => {
                    const script = document.createElement('script');
                    script.src = src;
                    script.onload = resolve;
                    document.head.appendChild(script);
                });

                await loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js');
            }
            if (isMounted) initMap();
        };

        loadLeaflet();

        return () => {
            isMounted = false;
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    const updateMarkerIcons = () => {
        if (!mapRef.current) return;
        const zoom = mapRef.current.getZoom();
        const isZoomedIn = zoom >= 9; // İyice yaklaşma eşiği (Tıpkı gezilecek yerlerdeki gibi)

        markersRef.current.forEach(item => {
            let emoji = '📍';
            if (item.place.type === 'hotel') emoji = '🏨';
            else if (item.place.type === 'restaurant') emoji = '🍽️';
            else if (item.place.type === 'kaaba') emoji = '🕋';

            const html = isZoomedIn 
                ? `<div class="relative z-50 cursor-pointer group">
                    <div class="text-3xl transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform origin-center" style="filter: drop-shadow(0px 6px 8px rgba(0,0,0,0.4));">${emoji}</div>
                    <div class="absolute left-3 top-1/2 -translate-y-1/2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm px-2 py-1 rounded-md shadow-md border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap ml-1 pointer-events-none">
                        ${item.place.title}
                    </div>
                   </div>`
                : `<div class="text-3xl transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform origin-center z-40 cursor-pointer" style="filter: drop-shadow(0px 6px 8px rgba(0,0,0,0.4));">${emoji}</div>`;

            item.marker.setIcon(window.L.divIcon({
                className: 'custom-hr-marker bg-transparent border-0',
                html: html,
                iconSize: [0, 0],
                iconAnchor: [0, 0]
            }));
        });
    };

    const initMap = () => {
        if (mapRef.current) return;
        
        const mapContainer = document.getElementById('hr-map-canvas');
        if(!mapContainer) return;

        // Varsayılan olarak Mekke-Medine arası bir odak
        const map = window.L.map(mapContainer, { zoomControl: false }).setView([24.4672, 39.6109], 5); 
        mapRef.current = map;

        window.L.tileLayer('https://mt1.google.com/vt/lyrs=m&hl=tr&x={x}&y={y}&z={z}', {
            attribution: '&copy; Google Maps',
            maxZoom: 19
        }).addTo(map);

        window.L.control.zoom({ position: 'topright' }).addTo(map);

        if (userLoc) {
            const userIcon = window.L.divIcon({
                className: 'user-loc-marker',
                html: `<div class="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center animate-ping absolute inset-0"></div>
                       <div class="w-8 h-8 rounded-full bg-blue-500 border-2 border-white shadow-xl flex items-center justify-center text-white relative z-10 text-sm">🚶</div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 16]
            });
            window.L.marker([userLoc.lat, userLoc.lng], { icon: userIcon, zIndexOffset: 1000 }).addTo(map);
        }

        combinedPlaces.forEach(place => {
            const marker = window.L.marker([place.lat, place.lng]).addTo(map);
            
            marker.on('click', () => {
                setSelectedPlace(place);
                
                const targetZoom = map.getZoom() < 12 ? 12 : map.getZoom();
                const pt = map.project([place.lat, place.lng], targetZoom);
                pt.y += map.getSize().y * 0.25; 
                map.flyTo(map.unproject(pt, targetZoom), targetZoom, { duration: 0.6 });
            });

            markersRef.current.push({ marker, place });
        });

        updateMarkerIcons();
        map.on('zoomend', updateMarkerIcons);
    };

    const openMapDir = (lat, lng) => window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
    const openWhatsapp = (url) => { if(url) window.open(url, '_blank'); };

    return (
        <div className="relative w-full h-[70vh] rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
            <div id="hr-map-canvas" className="w-full h-full z-0" style={{ minHeight: '100%' }}></div>
            
            <div className={`absolute bottom-0 left-0 right-0 z-[1500] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-white/20 dark:border-slate-700/50 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform ${selectedPlace ? 'translate-y-0' : 'translate-y-[120%]'}`}>
                {selectedPlace && (
                    <div className="flex flex-col max-h-[60vh]">
                        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/50 backdrop-blur-md rounded-full cursor-pointer z-20 shadow-sm" onClick={() => setSelectedPlace(null)}></div>
                        <button onClick={() => setSelectedPlace(null)} className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors z-20">
                            <LucideIcon name="x" className="w-4 h-4" />
                        </button>

                        <div className="h-40 shrink-0 relative overflow-hidden rounded-t-[2rem]">
                            {selectedPlace.image && selectedPlace.image.startsWith('[') ? (
                                <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                    <LucideIcon name="image" className="w-10 h-10" />
                                </div>
                            ) : (
                                <img src={selectedPlace.image || '/images/default.jpg'} alt={selectedPlace.title} className="w-full h-full object-cover" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
                            <div className="absolute bottom-4 left-5 right-5">
                                <span className="px-2 py-0.5 rounded text-[10px] bg-gold-500 text-white font-bold uppercase tracking-wider mb-1 inline-block shadow-sm">
                                    {selectedPlace.type === 'hotel' ? 'Otel' : selectedPlace.type === 'restaurant' ? 'Restoran' : 'Kutsal Mekan'}
                                </span>
                                <h3 className="text-xl font-bold text-white leading-tight shadow-sm">{selectedPlace.title}</h3>
                            </div>
                        </div>

                        <div className="p-5 overflow-y-auto">
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
                                {selectedPlace.desc}
                            </p>

                            {userLoc && (
                                <div className="flex items-center gap-2 mb-5 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                                    <LucideIcon name="navigation" className="w-4 h-4 text-blue-500" />
                                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Şu anki konumunuza uzaklık:</span>
                                    <span className="text-sm font-mono font-bold text-slate-800 dark:text-slate-200 ml-auto">
                                        {calculateDistance(userLoc.lat, userLoc.lng, selectedPlace.lat, selectedPlace.lng)} km
                                    </span>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button onClick={() => openMapDir(selectedPlace.lat, selectedPlace.lng)} className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-500/20 active:scale-95">
                                    <LucideIcon name="map" className="w-4 h-4" /> Yol Tarifi Al
                                </button>
                                
                                {selectedPlace.whatsapp && (
                                    <button onClick={() => openWhatsapp(selectedPlace.whatsapp)} className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-green-500/20 active:scale-95">
                                        <LucideIcon name="message-circle" className="w-4 h-4" /> İletişim
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- GÜNCELLENMİŞ OTEL & RESTORAN BİLEŞENİ (ŞEHİR FİLTRESİ EKLENDİ) ---
const HotelsRestaurantsModule = () => {
    const [viewMode, setViewMode] = useState('list');
    const [activeTab, setActiveTab] = useState('hotels');
    const [activeCity, setActiveCity] = useState('Hepsi'); // YENİ EKLENEN FİLTRE
    const [userLoc, setUserLoc] = useState(null);

    useEffect(() => { 
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                p => setUserLoc({ lat: p.coords.latitude, lng: p.coords.longitude }),
                () => console.log("Konum alınamadı.")
            );
        }
    }, []);

    // Sekme değiştiğinde şehri "Hepsi"ne sıfırla
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setActiveCity('Hepsi');
    };

    // Mevcut veri listesi
    const currentData = HOTELS_RESTAURANTS_DATA[activeTab];

    // Bu listedeki benzersiz şehirleri (country alanını) bul
    const uniqueCities = ['Hepsi', ...new Set(currentData.map(item => item.country))];

    // Aktif şehre göre filtrelenmiş veriler
    const filteredData = activeCity === 'Hepsi' 
        ? currentData 
        : currentData.filter(item => item.country === activeCity);

    return (
        <div className="p-4 pb-24 animate-fade-in space-y-4">
            <div className="bg-orange-900 text-white p-6 rounded-3xl relative overflow-hidden shadow-xl mb-2">
                <div className="relative z-10">
                    <h2 className="text-2xl font-serif font-bold mb-1">Otel & Restoran</h2>
                    <p className="text-orange-100 text-sm opacity-80">Konaklama ve yeme-içme tavsiyeleri.</p>
                </div>
                <div className="absolute -right-6 -bottom-6 w-32 h-32 text-orange-500 opacity-20 rotate-12">
                    <LucideIcon name="bed-double" className="w-full h-full" />
                </div>
            </div>

            <div className="flex bg-slate-200 dark:bg-slate-700 rounded-xl p-1 mb-2">
                <button 
                    onClick={() => setViewMode('list')} 
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${viewMode === 'list' ? 'bg-white dark:bg-slate-600 shadow text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                    <LucideIcon name="list" className="w-4 h-4" /> Liste Görünümü
                </button>
                <button 
                    onClick={() => setViewMode('map')} 
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${viewMode === 'map' ? 'bg-white dark:bg-slate-600 shadow text-gold-600' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                    <LucideIcon name="map-pin" className="w-4 h-4" /> Harita Görünümü
                </button>
            </div>

            {viewMode === 'list' ? (
                <div className="space-y-4 animate-fade-in-up">
                    {/* Üst Kategori Sekmeleri (Oteller / Restoranlar) */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1 mt-2">
                        <button onClick={() => handleTabChange('hotels')} className={`whitespace-nowrap px-4 py-2.5 rounded-full text-sm font-bold border transition-colors ${activeTab === 'hotels' ? 'bg-gold-500 border-gold-500 text-slate-900 shadow-md' : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'}`}>
                            Oteller
                        </button>
                        <button onClick={() => handleTabChange('restaurants')} className={`whitespace-nowrap px-4 py-2.5 rounded-full text-sm font-bold border transition-colors ${activeTab === 'restaurants' ? 'bg-gold-500 border-gold-500 text-slate-900 shadow-md' : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'}`}>
                            Restoranlar
                        </button>
                    </div>

                    {/* YENİ: Alt Şehir Filtreleri */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
                        {uniqueCities.map((city, idx) => (
                            <button 
                                key={idx} 
                                onClick={() => setActiveCity(city)} 
                                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${activeCity === city ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-800 shadow-sm' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
                            >
                                {city}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-4">
                        {filteredData.length === 0 ? (
                            <div className="text-center p-8 text-slate-500 dark:text-slate-400">
                                Bu şehirde kayıtlı mekan bulunmamaktadır.
                            </div>
                        ) : (
                            filteredData.map(item => (
                                <div key={item.id} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 group hover:shadow-md transition-all duration-300">
                                    <div className="p-4 flex flex-col gap-4">
                                        <div className="flex gap-4">
                                            {/* Image */}
                                            <div className="w-28 h-28 shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 relative shadow-inner">
                                                {item.image && item.image.startsWith('[') ? (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                        <LucideIcon name="image" className="w-8 h-8 opacity-50" />
                                                    </div>
                                                ) : (
                                                    <img src={item.image || '/images/default.jpg'} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 flex flex-col py-1">
                                                <h4 className="font-bold text-base sm:text-lg text-slate-800 dark:text-slate-100 leading-tight mb-1">{item.name}</h4>

                                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                                    <span className="flex items-center gap-1 text-[10px] bg-slate-100 dark:bg-slate-700/80 px-2 py-1 rounded-md font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                        <LucideIcon name="map-pin" className="w-3 h-3" /> {item.country}
                                                    </span>
                                                    {(item.stars || item.rating) && (
                                                        <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded-md text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800/50">
                                                            <LucideIcon name="star" className="w-3 h-3 fill-current" />
                                                            <span className="text-[10px] font-bold">{item.stars || item.rating}/5</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed flex-1">
                                                    {item.desc}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-3 border-t border-slate-50 dark:border-slate-700/50">
                                            <button onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`)} className="flex-1 py-2.5 bg-blue-50 hover:bg-blue-500 hover:text-white text-blue-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-300 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white group/btn">
                                                <LucideIcon name="map" className="w-4 h-4 group-hover/btn:scale-110 transition-transform" /> Yol Tarifi
                                            </button>
                                            {item.whatsapp && (
                                                <button onClick={() => window.open(item.whatsapp)} className="flex-1 py-2.5 bg-green-50 hover:bg-green-500 hover:text-white text-green-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-300 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-600 dark:hover:text-white group/btn">
                                                    <LucideIcon name="message-circle" className="w-4 h-4 group-hover/btn:scale-110 transition-transform" /> İletişim
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            ) : (
                <div className="animate-fade-in-up">
                    <HotelsRestaurantsMap userLoc={userLoc} />
                </div>
            )}
        </div>
    );
};

const UsefulLinksModule = () => (
    <div className="p-4 pb-24 animate-fade-in space-y-6">
         <div className="bg-teal-900 text-white p-6 rounded-3xl relative overflow-hidden shadow-xl mb-2">
            <div className="relative z-10">
                <h2 className="text-2xl font-serif font-bold mb-1">Faydalı Linkler</h2>
                <p className="text-teal-100 text-sm opacity-80">Resmi siteler, uygulamalar ve gruplar.</p>
            </div>
            <div className="absolute -right-6 -bottom-6 w-32 h-32 text-teal-500 opacity-20 rotate-12">
                <LucideIcon name="link" className="w-full h-full" />
            </div>
        </div>
        <div className="space-y-6">
            {USEFUL_LINKS_DATA.map((cat, i) => (
                <div key={i}>
                    <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-3 ml-1">{cat.category}</h3>
                    <div className="space-y-3">
                        {cat.items.map((link, j) => (
                            <a key={j} href={link.url} target="_blank" rel="noreferrer" className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-gold-200 dark:hover:border-gold-500/30 transition-all group">
                                <div className={`w-12 h-12 rounded-xl bg-${link.color}-50 dark:bg-${link.color}-900/20 text-${link.color}-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                                    <LucideIcon name={link.icon} className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{link.title}</h4>
                                    <p className="text-xs text-slate-500 mt-0.5">{link.desc}</p>
                                </div>
                                <LucideIcon name="chevron-right" className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-gold-500" />
                            </a>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const RouteSimulation = () => {
    const [selectedNode, setSelectedNode] = useState(null);
    const [isCalculating, setIsCalculating] = useState(true);
    const [showInfoPanel, setShowInfoPanel] = useState(true); 
    const mapRef = useRef(null);
    const routingControlRef = useRef(null);

    // Gerçek Koordinatlar (Enlem, Boylam)
    const REAL_COORDS = [
        [36.2288, 36.6833], // 1. Hatay / Cilvegözü
        [36.1966, 36.7033], // 2. Bab-al Hawa (Suriye Giriş)
        [35.1318, 36.7528], // 3. İdlib - Hama - Humus (Hama baz alındı)
        [32.6246, 36.1054], // 4. Şam (Dera yönü)
        [32.5204, 36.2023], // 5. Nassib / Jaber
        [30.1949, 35.7342], // 6. Amman - Ma'an
        [29.1350, 36.0825], // 7. Halat Ammar
        [28.3835, 36.5662], // 8. Tebük
        [24.4672, 39.6112], // 9. Medine
        [24.4136, 39.5447], // 10. Zülhuleyfe (Mikat)
        [21.4225, 39.8262]  // 11. Mekke
    ];

    useEffect(() => {
        if(window.lucide) window.lucide.createIcons();
    });

    useEffect(() => {
        let isMounted = true;
        const loadLeaflet = async () => {
            if (!window.L) {
                const css = document.createElement('link');
                css.rel = 'stylesheet';
                css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                document.head.appendChild(css);

                const routingCss = document.createElement('link');
                routingCss.rel = 'stylesheet';
                routingCss.href = 'https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.css';
                document.head.appendChild(routingCss);

                const loadScript = (src) => new Promise(resolve => {
                    const script = document.createElement('script');
                    script.src = src;
                    script.onload = resolve;
                    document.head.appendChild(script);
                });

                await loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js');
                await loadScript('https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.js');
            }
            if(isMounted) initMap();
        };

        loadLeaflet();

        return () => {
            isMounted = false;
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    const initMap = () => {
        if (mapRef.current) return;
        
        const mapContainer = document.getElementById('real-map-container');
        if(!mapContainer) return;

        const map = window.L.map(mapContainer, { zoomControl: false }).setView([29.0, 37.0], 5);
        mapRef.current = map;

        window.L.tileLayer('https://mt1.google.com/vt/lyrs=m&hl=tr&x={x}&y={y}&z={z}', {
            attribution: '&copy; Google Maps',
            maxZoom: 19
        }).addTo(map);

        window.L.control.zoom({ position: 'topright' }).addTo(map);

        const waypoints = REAL_COORDS.map(c => window.L.latLng(c[0], c[1]));

        routingControlRef.current = window.L.Routing.control({
            waypoints: waypoints,
            routeWhileDragging: false,
            addWaypoints: false,
            show: false,
            fitSelectedRoutes: true,
            lineOptions: {
                styles: [{color: '#ef4444', opacity: 0.8, weight: 4, dashArray: '10, 10'}] 
            },
            createMarker: () => null
        }).addTo(map);

        routingControlRef.current.on('routesfound', () => {
            setIsCalculating(false);
        });

        ROUTE_SIMULATION_DATA.forEach((step, i) => {
            const coord = REAL_COORDS[i];
            let baseColor = "bg-slate-700";
            let ringColor = "ring-slate-500/30";

            if(step.type === 'start') { baseColor = "bg-red-500"; ringColor = "ring-red-500/30"; }
            if(step.type === 'border') { baseColor = "bg-amber-500"; ringColor = "ring-amber-500/30"; }
            if(step.type === 'holy') { baseColor = "bg-emerald-500"; ringColor = "ring-emerald-500/30"; }
            if(step.type === 'miqat') { baseColor = "bg-indigo-500"; ringColor = "ring-indigo-500/30"; }
            if(step.type === 'fuel') { baseColor = "bg-rose-500"; ringColor = "ring-rose-500/30"; }

            const icon = window.L.divIcon({
                className: 'custom-div-icon bg-transparent border-0',
                html: `<div class="w-8 h-8 rounded-full border-2 border-white shadow-xl ${baseColor} flex items-center justify-center text-white font-bold text-xs ring-4 ${ringColor} hover:scale-110 transition-transform">${i+1}</div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 16]
            });

            const marker = window.L.marker(coord, { icon }).addTo(map);
            marker.on('click', () => {
                setSelectedNode(i);
                const pt = map.project(coord, 8);
                pt.y += map.getSize().y * 0.25; 
                const newCenter = map.unproject(pt, 8);
                map.flyTo(newCenter, 8, { duration: 0.8 });
            });
        });
    };

    const handleNodeChange = (idx) => {
        setSelectedNode(idx);
        if(mapRef.current) {
            const map = mapRef.current;
            const coord = REAL_COORDS[idx];
            const pt = map.project(coord, 8);
            pt.y += map.getSize().y * 0.25; 
            const newCenter = map.unproject(pt, 8);
            map.flyTo(newCenter, 8, { duration: 0.8 });
        }
    };

    return (
        <div className="relative animate-fade-in w-full h-[85vh] sm:h-[90vh] bg-[#eef2f6] dark:bg-slate-900 overflow-hidden flex flex-col rounded-b-3xl sm:rounded-3xl">
            
            <div className={`absolute top-4 left-4 right-4 z-[2000] transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${showInfoPanel ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-8 opacity-0 scale-95 pointer-events-none'}`}>
                <div className={`bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl p-4 sm:p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-white/50 dark:border-slate-700/50 flex flex-col gap-3 relative overflow-hidden group ${showInfoPanel ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                    
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-gold-500/20 rounded-full blur-3xl pointer-events-none transition-all group-hover:bg-gold-500/30"></div>

                    <button onClick={(e) => { e.stopPropagation(); setShowInfoPanel(false); }} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-md rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-white transition-all hover:scale-105 active:scale-95 shadow-sm z-50">
                        <LucideIcon name="x" className="w-4 h-4" />
                    </button>

                    <div className="pr-10 relative z-10">
                        <h2 className="text-lg sm:text-xl font-serif font-bold text-slate-800 dark:text-gold-400 flex items-center gap-2">
                            <LucideIcon name="map" className="w-5 h-5 text-gold-500" />
                            Rota Simülasyonu
                        </h2>
                        <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                            Detaylar için numaralara tıklayın. Haritayı tam ekran görmek için paneli kapatabilirsiniz.
                        </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-amber-900/30 dark:to-amber-900/10 p-3 rounded-2xl border border-amber-200/50 dark:border-amber-700/30 flex items-start gap-3 mt-1 shadow-inner relative z-10">
                        <div className="bg-amber-100 dark:bg-amber-800/80 p-1.5 rounded-lg shrink-0 mt-0.5 shadow-sm">
                            <LucideIcon name="info" className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <p className="text-[10px] sm:text-[11px] leading-relaxed text-amber-900 dark:text-amber-200 font-medium">
                            <span className="font-bold">Bilgi:</span> Bu harita rota hakkında fikir vermek amacıyla oluşturulmuş bir simülasyondur. Özellikle Ürdün'den sonra alternatif rotalar mevcuttur. Yolculuk esnasında kesin ve güvenli yönlendirmeler için <span className="font-bold underline decoration-amber-400/50">Google Maps</span> gibi anlık harita uygulamalarından faydalanmanız daha doğru olacaktır.
                        </p>
                    </div>
                </div>
            </div>

            <div className={`absolute top-4 left-4 z-[2001] transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${!showInfoPanel ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-8 opacity-0 scale-90 pointer-events-none'}`}>
                <button onClick={(e) => { e.stopPropagation(); setShowInfoPanel(true); }} className={`bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl px-4 py-2.5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-white/50 dark:border-slate-700/50 text-slate-800 dark:text-gold-400 flex items-center gap-2.5 hover:scale-105 active:scale-95 transition-all group ${!showInfoPanel ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                    <div className="bg-gold-50 dark:bg-gold-900/30 p-1.5 rounded-lg group-hover:bg-gold-100 dark:group-hover:bg-gold-900/50 transition-colors">
                        <LucideIcon name="map" className="w-4 h-4 text-gold-600 dark:text-gold-400" />
                    </div>
                    <span className="text-xs font-bold font-serif tracking-wide">Açıklamayı Göster</span>
                </button>
            </div>

            {isCalculating && (
                <div className="absolute inset-0 z-[3000] bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-auto">
                    <div className="w-12 h-12 border-4 border-gold-200 border-t-gold-500 rounded-full animate-spin mb-4"></div>
                    <p className="font-bold text-slate-700 dark:text-slate-200 animate-pulse">Gerçek Araç Rotası Hesaplanıyor...</p>
                </div>
            )}

            <div id="real-map-container" className="w-full h-full z-0"></div>

            <div className={`absolute bottom-0 left-0 right-0 z-[1500] bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-t-[2.5rem] shadow-[0_-20px_60px_rgba(0,0,0,0.2)] dark:shadow-[0_-20px_60px_rgba(0,0,0,0.8)] border-t border-white/40 dark:border-slate-700/50 transition-transform duration-500 ease-in-out transform ${selectedNode !== null ? 'translate-y-0' : 'translate-y-full'}`}>
                {selectedNode !== null && (
                    <div className="p-6 relative max-h-[65vh] overflow-y-auto">
                        <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent dark:from-white/5 pointer-events-none rounded-t-[2.5rem]"></div>

                        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-14 h-1.5 bg-slate-200 dark:bg-slate-700/80 rounded-full cursor-pointer" onClick={() => setSelectedNode(null)}></div>
                        <button onClick={() => setSelectedNode(null)} className="absolute top-5 right-5 p-2 bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-md rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors z-10">
                            <LucideIcon name="x" className="w-4 h-4" />
                        </button>

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4 mt-3">
                                <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                                    ROUTE_SIMULATION_DATA[selectedNode].type === 'border' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 
                                    ROUTE_SIMULATION_DATA[selectedNode].type === 'holy' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                    ROUTE_SIMULATION_DATA[selectedNode].type === 'miqat' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' :
                                    'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                                }`}>
                                    {ROUTE_SIMULATION_DATA[selectedNode].action}
                                </span>
                                <span className="font-mono text-xs font-bold text-slate-400 flex items-center gap-1">
                                    <LucideIcon name="clock" className="w-3 h-3" /> {ROUTE_SIMULATION_DATA[selectedNode].time}
                                </span>
                            </div>

                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{ROUTE_SIMULATION_DATA[selectedNode].city}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">{ROUTE_SIMULATION_DATA[selectedNode].desc}</p>

                            <div className="space-y-3 mb-6">
                                {ROUTE_SIMULATION_DATA[selectedNode].warning && (
                                    <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl font-medium border border-red-100 dark:border-red-900/30">
                                        <LucideIcon name="alert-triangle" className="w-4 h-4 shrink-0 mt-0.5" />
                                        <span>{ROUTE_SIMULATION_DATA[selectedNode].warning}</span>
                                    </div>
                                )}

                                {ROUTE_SIMULATION_DATA[selectedNode].tips && (
                                    <div className="bg-gold-50 dark:bg-gold-900/10 p-4 rounded-xl border border-gold-100 dark:border-gold-900/30">
                                        <p className="text-[10px] font-bold text-gold-600 dark:text-gold-500 uppercase mb-2 flex items-center gap-1">
                                            <LucideIcon name="lightbulb" className="w-3 h-3" /> Seyahat İpucu
                                        </p>
                                        <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-2 list-disc pl-4 marker:text-gold-500">
                                            {ROUTE_SIMULATION_DATA[selectedNode].tips.map((tip, i) => <li key={i}>{tip}</li>)}
                                        </ul>
                                    </div>
                                )}
                                
                                <div className="flex justify-between items-center bg-slate-50/80 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                                    <span className="text-xs font-bold text-slate-500">Katedilen Mesafe</span>
                                    <span className="text-sm font-mono font-bold text-slate-800 dark:text-white flex items-center gap-1">
                                        <LucideIcon name="route" className="w-4 h-4 text-gold-500" /> {ROUTE_SIMULATION_DATA[selectedNode].km_info}
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t border-slate-100/50 dark:border-slate-800/50">
                                <button 
                                    onClick={() => handleNodeChange(Math.max(0, selectedNode - 1))}
                                    disabled={selectedNode === 0}
                                    className="px-4 py-2 text-xs font-bold flex items-center gap-2 text-slate-500 disabled:opacity-30"
                                >
                                    <LucideIcon name="arrow-left" className="w-4 h-4" /> Önceki
                                </button>
                                <button 
                                    onClick={() => handleNodeChange(Math.min(ROUTE_SIMULATION_DATA.length - 1, selectedNode + 1))}
                                    disabled={selectedNode === ROUTE_SIMULATION_DATA.length - 1}
                                    className="px-5 py-2.5 text-xs font-bold flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-white rounded-xl disabled:opacity-30 shadow-lg shadow-gold-500/30 transition-all"
                                >
                                    Sonraki Adım <LucideIcon name="arrow-right" className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const SettingsModal = ({ isOpen, onClose, settings, updateSettings, installPrompt, onInstall }) => {
    if (!isOpen) return null;

    const handleToggle = async (key) => {
        if (settings[key]) {
            updateSettings(key, false);
            return;
        }

        if (key === 'location') {
            if (!navigator.geolocation) {
                alert("Tarayıcınız konum servisini desteklemiyor.");
                return;
            }

            if (navigator.permissions && navigator.permissions.query) {
                try {
                    const status = await navigator.permissions.query({ name: 'geolocation' });
                    if (status.state === 'denied') {
                        alert("⚠️ Konum izni daha önce reddedilmiş!\n\nBu özelliği açmak için tarayıcınızın adres çubuğundaki kilit simgesine 🔒 tıklayın ve 'Konum' iznini manuel olarak aktif edin.");
                        return; 
                    }
                } catch (e) {
                    console.log("Permission query API desteklenmiyor, direkt isteme geçiliyor.");
                }
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    updateSettings(key, true);
                },
                (error) => {
                    if (error.code === 1) { 
                        alert("Konum iznini reddettiniz. Ayarlardan açmadan bu özellik çalışmaz.");
                    } else {
                        alert("Konum alınamadı (GPS kapalı olabilir), ancak özellik açıldı.");
                        updateSettings(key, true);
                    }
                }
            );
        }
        else if (key === 'notifications') {
            if (!("Notification" in window)) {
                alert("Bu tarayıcı bildirimleri desteklemiyor.");
                return;
            }

            if (Notification.permission === "granted") {
                updateSettings(key, true);
                new Notification("UmreGO", { body: "Bildirimler zaten aktif durumda." });
            } else if (Notification.permission === "denied") {
                alert("⚠️ Bildirim izni engellenmiş!\n\nLütfen tarayıcı ayarlarından (Kilit simgesi 🔒) 'Bildirimler' seçeneğine izin verin.");
            } else {
                const permission = await Notification.requestPermission();
                if (permission === "granted") {
                    updateSettings(key, true);
                    new Notification("Teşekkürler!", { body: "Mikat sınırına yaklaştığınızda sizi uyaracağız." });
                } else {
                    alert("Bildirim izni vermediniz.");
                }
            }
        }
        else {
            updateSettings(key, !settings[key]);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-serif font-bold text-slate-800 dark:text-gold-400">Ayarlar</h2>
                    <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full"><LucideIcon name="x" className="w-5 h-5" /></button>
                </div>
                <div className="space-y-4 overflow-y-auto pr-2">
                    <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                        <label className="text-sm font-bold flex items-center gap-2 mb-2"><LucideIcon name="type" className="w-4 h-4 text-gold-500" /> Yazı Boyutu</label>
                        <div className="flex bg-slate-200 dark:bg-slate-700 p-1 rounded-lg">
                            {['small', 'medium', 'large'].map(s => (
                                <button key={s} onClick={() => updateSettings('fontSize', s)} className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${settings.fontSize === s ? 'bg-white text-gold-600 shadow' : 'text-slate-400'}`}>
                                    {s === 'small' ? 'Küçük' : s === 'medium' ? 'Orta' : 'Büyük'}
                                </button>
                            ))}
                        </div>
                    </div>
                    {[
                        { k: 'theme', l: 'Gece Modu', i: 'moon', desc: 'Göz yormayan karanlık tema' },
                        { k: 'notifications', l: 'Bildirimler', i: 'bell', desc: 'Mikat alarmı ve namaz vakitleri için' },
                        { k: 'location', l: 'Konum İzni', i: 'map-pin', desc: 'Kabe ve Mikat mesafe hesaplaması için' }
                    ].map(t => (
                        <div key={t.k} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg"><LucideIcon name={t.i} className="w-5 h-5 text-slate-600 dark:text-slate-300" /></div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-sm text-slate-700 dark:text-slate-200">{t.l}</span>
                                    <span className="text-[10px] text-slate-400">{t.desc}</span>
                                </div>
                            </div>
                            <button onClick={() => t.k === 'theme' ? updateSettings('theme', settings.theme === 'dark' ? 'light' : 'dark') : handleToggle(t.k)} className={`w-10 h-6 rounded-full p-1 transition-colors ${((t.k === 'theme' && settings.theme === 'dark') || (t.k !== 'theme' && settings[t.k])) ? 'bg-gold-500' : 'bg-slate-300'}`}><div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${((t.k === 'theme' && settings.theme === 'dark') || (t.k !== 'theme' && settings[t.k])) ? 'translate-x-4' : ''}`}></div></button>
                        </div>
                    ))}
                    
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800 flex items-start gap-3">
                         <div className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5"><LucideIcon name="shield-check" className="w-5 h-5" /></div>
                         <div>
                             <h4 className="font-bold text-sm text-emerald-800 dark:text-emerald-300">Güvenlik & Gizlilik</h4>
                             <p className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-1 leading-relaxed">
                                 Bu uygulama tamamen güvenlidir. Kişisel verileriniz, konum bilginiz veya işaretlediğiniz listeler yalnızca kendi telefonunuzda (tarayıcı hafızasında) saklanır. Hiçbir sunucuya veri transferi yapılmaz.
                             </p>
                         </div>
                    </div>

                    <div className="bg-slate-900 dark:bg-slate-800 p-4 rounded-xl border border-gold-500/30 text-white">
                        <div className="flex items-center gap-3 mb-3"><LucideIcon name="smartphone" className="w-5 h-5 text-gold-500" /><div><h4 className="font-bold text-sm">Uygulamayı Yükle</h4><p className="text-[10px] text-slate-300">İnternetin çekmeyeceği yerlerde de kullanabilmek için yükleyebilirsiniz.</p></div></div>
                        <button onClick={onInstall} disabled={!installPrompt} className={`w-full py-2 rounded-lg font-bold text-xs ${installPrompt ? 'bg-gold-500 text-black' : 'bg-slate-700 text-slate-500'}`}>{installPrompt ? 'Yükle' : 'Zaten Yüklü'}</button>
                    </div>

                    <div className="text-center">
                        <span className="text-[10px] text-slate-400 font-mono tracking-widest">{APP_VERSION}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const UpdateModal = ({ show, onClose, version }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-gold-500/20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-400 to-gold-600"></div>
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gold-50 dark:bg-gold-900/20 rounded-full flex items-center justify-center mb-4 animate-pulse-gold">
                        <LucideIcon name="sparkles" className="w-8 h-8 text-gold-500" />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-slate-800 dark:text-white mb-2">Yenilikler Var!</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                        <b>Otel & Restoran:</b> Artık mekanları şehirlere göre filtreleyebilir ve çok daha kolay bulabilirsiniz.
                    </p>
                    <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg mb-6">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Yeni Sürüm</span>
                        <div className="text-lg font-mono font-bold text-gold-600 dark:text-gold-400">{version}</div>
                    </div>
                    <button onClick={onClose} className="w-full py-3 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-gold-500/30 active:scale-95">
                        Harika, Devam Et
                    </button>
                </div>
            </div>
        </div>
    );
};

const Header = ({ title, goBack, onOpenSettings, showSettingsBtn }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        audioRef.current = new Audio(AUDIO_TELBIYE);
        audioRef.current.onended = () => setIsPlaying(false);
        return () => { if(audioRef.current) { audioRef.current.pause(); } };
    }, []);

    useEffect(() => {
        if(window.lucide) window.lucide.createIcons();
    }, [isPlaying]);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) { audioRef.current.pause(); } 
        else { audioRef.current.play().catch(e => alert("Ses dosyası çalınamıyor.")); }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="sticky top-0 z-50 glass-header px-3 py-1 flex items-center justify-between shadow-sm min-h-[40px] relative">
            <div className="flex items-center gap-3 relative z-10">
                {goBack && <button onClick={goBack} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"><LucideIcon name="arrow-left" className="w-5 h-5" /></button>}
                {title === 'LOGO_STYLE' ? (
                    <div className="flex flex-col"><span className="text-[10px] font-bold text-gold-600 dark:text-gold-500 tracking-[0.2em] uppercase">Karayolu İle</span><span className="text-lg font-serif font-bold dark:text-white">Umre Rehberi</span></div>
                ) : <h1 className="text-lg font-serif font-bold dark:text-gold-400">{title}</h1>}
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none">
                <span className="font-serif font-extrabold text-gold-600 dark:text-gold-400 opacity-100 text-lg tracking-widest drop-shadow-md">{SITE_TITLE}</span>
            </div>
            <div className="flex items-center gap-2 relative z-10">
                <button onClick={togglePlay} className={`p-2 rounded-full transition-all ${isPlaying ? 'bg-gold-500 text-white shadow-lg shadow-gold-500/30 animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                    <LucideIcon name={isPlaying ? "pause" : "music"} className="w-5 h-5" />
                </button>
                {showSettingsBtn && (
                    <button onClick={onOpenSettings} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <LucideIcon name="settings" className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                    </button>
                )}
            </div>
        </div>
    );
};

const InputField = ({ label, icon, value, field, onChange, currencySymbol }) => (
    <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3 group focus-within:border-gold-500 transition-colors">
        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 group-focus-within:text-gold-500 group-focus-within:bg-gold-50 dark:group-focus-within:bg-gold-900/20 transition-colors">
            <LucideIcon name={icon} className="w-5 h-5" />
        </div>
        <div className="flex-1">
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1 group-focus-within:text-gold-600 transition-colors">{label}</label>
            <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-400">{currencySymbol}</span>
                <input 
                    type="number" 
                    value={value} 
                    onChange={(e) => onChange(field, e.target.value)}
                    className="w-full bg-transparent font-bold text-lg text-slate-800 dark:text-slate-100 focus:outline-none placeholder-slate-300"
                    placeholder="0"
                    autoComplete="off"
                />
            </div>
        </div>
    </div>
);

const CostCalculator = () => {
    const [passengers, setPassengers] = useState(4);
    const [isDriverExempt, setIsDriverExempt] = useState(false);
    const [currency, setCurrency] = useState('USD'); 
    const [exchangeRate, setExchangeRate] = useState(48.50); 
    
    const [costs, setCosts] = useState({
        fuel: 400,      
        hotel: 600,     
        food: 400,      
        other: 100      
    });

    useEffect(() => {
        const getRate = async () => {
            try {
                const cached = localStorage.getItem('rates_v2');
                if(cached) {
                    const data = JSON.parse(cached);
                    if(data.TRY) setExchangeRate(data.TRY); 
                    const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
                    const liveData = await res.json();
                    setExchangeRate(liveData.rates.TRY);
                } else {
                      const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
                      const liveData = await res.json();
                      setExchangeRate(liveData.rates.TRY);
                }
            } catch (e) {
                console.log("Kur alınamadı, varsayılan kullanılıyor.");
            }
        };
        getRate();
    }, []);

    const FIXED_EXPENSES = [
        // GİDİŞ
        { id: 'tr_exit', label: 'Yurt Dışı Çıkış Harcı (1250 TL)', type: 'person', amount: 35, country: 'TR' },
        { id: 'carnet', label: 'Suriye Araç Karnesi', type: 'car', amount: 20, country: 'SY' },
        { id: 'sy_ins', label: 'Suriye Araç Sigortası (Küçük)', type: 'car', amount: 25, country: 'SY' },
        { id: 'sy_stamp', label: 'Suriye Çıkış Pulu (150 TL)', type: 'person', amount: 5, country: 'SY' },
        { id: 'sy_visa_go', label: 'Suriye Transit Vize (Gidiş)', type: 'person', amount: 25, country: 'SY' },
        
        { id: 'jo_entry', label: 'Ürdün Giriş Vergisi (20 JOD)', type: 'car', amount: 28, country: 'JO' },
        { id: 'jo_ins', label: 'Ürdün Zorunlu Sigorta (55 JOD)', type: 'car', amount: 80, country: 'JO' },
        
        { id: 'sa_visa', label: 'Suudi Turist Vizesi', type: 'person', amount: 107, country: 'SA' },
        { id: 'sa_ins', label: 'Suudi Araç Sigortası', type: 'car', amount: 80, country: 'SA' },
        
        // DÖNÜŞ
        { id: 'jo_entry_ret', label: 'Ürdün Giriş (Dönüş - 20 JOD)', type: 'car', amount: 28, country: 'JO' },
        { id: 'sy_car_ret', label: 'Suriye Araç (Dönüş)', type: 'car', amount: 50, country: 'SY' },
        { id: 'sy_visa_ret', label: 'Suriye Vize (Dönüş)', type: 'person', amount: 25, country: 'SY' }
    ];

    const multiplier = currency === 'TRY' ? exchangeRate : 1;
    const symbol = currency === 'TRY' ? '₺' : '$';

    const totalCarFixedUSD = FIXED_EXPENSES.filter(e => e.type === 'car').reduce((sum, item) => sum + item.amount, 0);
    
    const totalPersonFixedSingleUSD = FIXED_EXPENSES.filter(e => e.type === 'person').reduce((sum, item) => sum + item.amount, 0);
    const totalPersonFixedAllUSD = totalPersonFixedSingleUSD * passengers;

    const totalVariableUSD = Number(costs.fuel) + Number(costs.hotel) + Number(costs.food) + Number(costs.other);

    const sharedPoolUSD = totalCarFixedUSD + Number(costs.fuel);
    
    const personalVariablePerPersonUSD = (Number(costs.hotel) + Number(costs.food) + Number(costs.other)) / passengers;
    const personalTotalPerPersonUSD = totalPersonFixedSingleUSD + personalVariablePerPersonUSD;

    const payingCount = isDriverExempt ? Math.max(1, passengers - 1) : passengers;
    const sharedCostPerPayerUSD = sharedPoolUSD / payingCount;

    const costForPassenger = Math.ceil((sharedCostPerPayerUSD + personalTotalPerPersonUSD) * multiplier);
    const costForDriver = Math.ceil(((isDriverExempt ? 0 : sharedCostPerPayerUSD) + personalTotalPerPersonUSD) * multiplier);
    const totalTripCost = Math.ceil((sharedPoolUSD + totalPersonFixedAllUSD + (personalVariablePerPersonUSD * passengers)) * multiplier);

    const handleCostChange = (field, val) => setCosts({ ...costs, [field]: val });

    const fmt = (num) => new Intl.NumberFormat('tr-TR').format(Math.ceil(num * multiplier));

    return (
        <div className="p-4 pb-24 animate-fade-in space-y-6">
            
            <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden ring-1 ring-white/10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                
                <div className="flex justify-between items-start mb-6 relative z-10">
                    <div>
                        <p className="text-xs font-bold text-gold-500 uppercase tracking-widest mb-1">Toplam Tahmini Bütçe</p>
                        <h2 className="text-2xl font-serif font-bold">Maliyet Analizi</h2>
                    </div>
                    <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                        {['USD', 'TRY'].map(c => (
                            <button 
                                key={c} 
                                onClick={() => setCurrency(c)}
                                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${currency === c ? 'bg-gold-500 text-slate-900 shadow' : 'text-slate-400 hover:text-white'}`}
                            >
                                {c === 'USD' ? '$ USD' : '₺ TRY'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-4 relative z-10">
                    <div className="flex-1 bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-2xl">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Yolcu Başına</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-lg text-gold-500 font-bold">{symbol}</span>
                            <span className="text-3xl font-mono font-bold">{fmt(sharedCostPerPayerUSD + personalTotalPerPersonUSD)}</span>
                        </div>
                    </div>
                    {isDriverExempt && (
                        <div className="flex-1 bg-indigo-500/10 backdrop-blur-sm border border-indigo-500/30 p-4 rounded-2xl">
                            <span className="text-[10px] text-indigo-300 uppercase font-bold block mb-1">Sürücü (Muaf)</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-sm text-indigo-400 font-bold">{symbol}</span>
                                <span className="text-2xl font-mono font-bold">{fmt((isDriverExempt ? 0 : sharedCostPerPayerUSD) + personalTotalPerPersonUSD)}</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-xs text-slate-400">
                    <span>Toplam Ekip Maliyeti: <b className="text-white">{symbol} {fmt(totalTripCost / multiplier)}</b></span>
                    <span>Kur: 1$ ≈ {exchangeRate.toFixed(2)}₺</span>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-slate-100 dark:bg-slate-700 p-2.5 rounded-xl text-slate-600 dark:text-slate-300"><LucideIcon name="users" className="w-5 h-5" /></div>
                        <div>
                            <span className="block font-bold text-slate-800 dark:text-white text-sm">Yolcu Sayısı</span>
                            <span className="text-[10px] text-slate-400">Sürücü Dahil</span>
                        </div>
                    </div>
                    <div className="flex items-center bg-slate-100 dark:bg-slate-900 rounded-xl p-1">
                        <button onClick={() => setPassengers(Math.max(1, passengers - 1))} className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-slate-700 shadow-sm transition-all"><LucideIcon name="minus" className="w-4 h-4" /></button>
                        <span className="w-10 text-center font-bold text-lg text-slate-800 dark:text-white">{passengers}</span>
                        <button onClick={() => setPassengers(passengers + 1)} className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-slate-700 shadow-sm transition-all text-gold-600"><LucideIcon name="plus" className="w-4 h-4" /></button>
                    </div>
                </div>

                {passengers > 1 && (
                    <div onClick={() => setIsDriverExempt(!isDriverExempt)} className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${isDriverExempt ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800' : 'bg-slate-50 border-transparent dark:bg-slate-700/50'}`}>
                        <div className="flex items-center gap-3">
                            <div className={`p-1.5 rounded-full ${isDriverExempt ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-500'}`}><LucideIcon name="car" className="w-4 h-4" /></div>
                            <div className="flex flex-col">
                                <span className={`font-bold text-xs ${isDriverExempt ? 'text-indigo-900 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400'}`}>Araç Sahibi Muafiyeti</span>
                                <span className="text-[10px] opacity-70">Ortak giderlerden (Yakıt vb.) muaf tutulur.</span>
                            </div>
                        </div>
                        <div className={`w-9 h-5 rounded-full p-0.5 transition-colors ${isDriverExempt ? 'bg-indigo-500' : 'bg-slate-300'}`}>
                            <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${isDriverExempt ? 'translate-x-4' : ''}`}></div>
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Değişken Giderler (Tahmini - Toplam)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InputField label="Yakıt (Gidiş-Dönüş)" icon="fuel" value={costs.fuel} field="fuel" onChange={handleCostChange} currencySymbol="$" />
                    <InputField label="Otel Konaklama" icon="bed-double" value={costs.hotel} field="hotel" onChange={handleCostChange} currencySymbol="$" />
                    <InputField label="Yeme & İçme" icon="utensils" value={costs.food} field="food" onChange={handleCostChange} currencySymbol="$" />
                    <InputField label="Diğer (Sim, Hediye)" icon="wallet" value={costs.other} field="other" onChange={handleCostChange} currencySymbol="$" />
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="bg-slate-100 dark:bg-slate-900 p-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2"><LucideIcon name="receipt" className="w-4 h-4" /> Hesap Detayları</h3>
                    <span className="text-[10px] bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 text-slate-500">2026 Tahmini</span>
                </div>
                
                <div className="p-4 space-y-5">
                    <div>
                        <h4 className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-2 border-b border-slate-100 dark:border-slate-700 pb-1">Araç & Sınır Giderleri (Ortak)</h4>
                        <div className="space-y-2">
                            {FIXED_EXPENSES.filter(e => e.type === 'car').map(item => (
                                <div key={item.id} className="flex justify-between items-center text-xs">
                                    <span className="text-slate-600 dark:text-slate-300 flex items-center gap-2">
                                        <span className={`text-[9px] px-1 rounded font-bold ${item.country === 'TR' ? 'bg-red-100 text-red-600' : item.country === 'SA' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>{item.country}</span>
                                        {item.label}
                                    </span>
                                    <span className="font-mono text-slate-800 dark:text-slate-200">{symbol}{fmt(item.amount)}</span>
                                </div>
                            ))}
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-600 dark:text-slate-300 flex items-center gap-2">
                                    <span className="text-[9px] px-1 rounded font-bold bg-slate-100 text-slate-500">GEN</span>
                                    Yakıt (Tahmini)
                                </span>
                                <span className="font-mono text-slate-800 dark:text-slate-200">{symbol}{fmt(costs.fuel)}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-2 border-b border-slate-100 dark:border-slate-700 pb-1">Vize & Harçlar (Kişi x {passengers})</h4>
                        <div className="space-y-2">
                            {FIXED_EXPENSES.filter(e => e.type === 'person').map(item => (
                                <div key={item.id} className="flex justify-between items-center text-xs">
                                    <span className="text-slate-600 dark:text-slate-300 flex items-center gap-2">
                                        <span className={`text-[9px] px-1 rounded font-bold ${item.country === 'TR' ? 'bg-red-100 text-red-600' : item.country === 'SA' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>{item.country}</span>
                                        {item.label}
                                    </span>
                                    <span className="font-mono text-slate-800 dark:text-slate-200">{symbol}{fmt(item.amount * passengers)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                      <div>
                        <h4 className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-2 border-b border-slate-100 dark:border-slate-700 pb-1">Konaklama & Yaşam</h4>
                        <div className="flex justify-between items-center text-xs mb-1">
                            <span className="text-slate-600 dark:text-slate-300">Toplam Otel, Yemek, Diğer</span>
                            <span className="font-mono text-slate-800 dark:text-slate-200">{symbol}{fmt(Number(costs.hotel) + Number(costs.food) + Number(costs.other))}</span>
                        </div>
                      </div>
                      
                      <div className="pt-3 border-t-2 border-slate-100 dark:border-slate-700 flex justify-between items-center">
                        <span className="font-bold text-sm text-slate-800 dark:text-white">GENEL TOPLAM</span>
                        <span className="font-bold text-xl text-gold-600 dark:text-gold-400 font-mono">{symbol}{fmt(totalTripCost / multiplier)}</span>
                      </div>
                </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-900/50 flex gap-3 items-start">
                <LucideIcon name="alert-triangle" className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div className="text-xs text-red-700 dark:text-red-300 leading-relaxed">
                    <span className="font-bold block mb-1">Yasal Uyarı & Bilgilendirme</span>
                    Bu hesaplama aracı sadece <b>fikir vermek amacıyla</b> tasarlanmıştır. Gümrük vergileri, vize ücretleri ve döviz kurları anlık olarak değişebilir. Resmi makamların talep edeceği ek ücretler, sigorta farkları veya yakıt zamları buradaki hesaba dahil olmayabilir. Lütfen yola çıkmadan önce güncel resmi kaynaklardan teyit alınız.
                </div>
            </div>

        </div>
    );
};

const FeaturedCards = ({ handleNavigation }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);

    const cards = [
    { id: 'c1', title: 'Rota Simülasyonu', sub: 'İnteraktif harita ile yol tarifi', icon: 'map', bg: 'bg-gradient-to-br from-cyan-800 to-cyan-900', text: 'text-cyan-100', act: () => handleNavigation('routeSim') },
    { id: 'c2', title: 'Seyahat Rehberi', sub: 'Sınır geçişleri & belgeler', icon: 'book-open', bg: 'bg-gradient-to-br from-emerald-800 to-emerald-900', text: 'text-emerald-100', act: () => handleNavigation('travelGuide') },
    { id: 'c3', title: 'Maliyet Hesapla', sub: 'Vize ve Araç Giderleri', icon: 'calculator', bg: 'bg-gradient-to-br from-slate-900 to-slate-800', text: 'text-white', act: () => handleNavigation('costCalc') },
    { id: 'c4', title: 'Mikat Kontrol', sub: 'İhram sınırına yaklaşınca uyar', icon: 'map-pin', bg: 'bg-gradient-to-br from-indigo-800 to-indigo-900', text: 'text-indigo-100', act: () => handleNavigation('miqat') }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isPaused && scrollRef.current) {
                const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current;
                const nextScroll = scrollLeft + clientWidth;
                if (nextScroll + 10 >= scrollWidth) {
                    scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                    setActiveIndex(0);
                } else {
                    scrollRef.current.scrollTo({ left: nextScroll, behavior: 'smooth' });
                    setActiveIndex(prev => prev + 1);
                }
            }
        }, 7000);
        return () => clearInterval(interval);
    }, [isPaused]);

    return (
        <div className="col-span-full mb-2 relative group">
            <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 snap-x snap-mandatory scrollbar-hide" style={{ scrollBehavior: 'smooth' }}>
                {cards.map(c => (
                    <div key={c.id} onClick={c.act} className={`relative overflow-hidden ${c.bg} rounded-2xl p-5 shadow-xl cursor-pointer border border-white/10 min-w-[100%] snap-center shrink-0 flex flex-col justify-between h-36`}>
                        <div className="relative z-10">
                            <span className={`px-2 py-0.5 rounded text-[10px] bg-white/10 ${c.text} font-bold uppercase tracking-wider mb-2 inline-block`}>Öne Çıkan</span>
                            <h2 className={`text-2xl font-serif font-bold ${c.text} mb-0.5`}>{c.title}</h2>
                            <p className={`${c.text} text-xs opacity-80`}>{c.sub}</p>
                        </div>
                        <div className={`absolute -right-2 -bottom-4 w-24 h-24 ${c.text} opacity-10 rotate-12`}>
                            <LucideIcon name={c.icon} className="w-full h-full" />
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={(e) => { e.stopPropagation(); setIsPaused(!isPaused); }} className="absolute top-3 right-3 z-20 p-1.5 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 transition-colors"><LucideIcon name={isPaused ? "play" : "pause"} className="w-3 h-3 fill-current" /></button>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                {cards.map((_, i) => (<div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === activeIndex ? 'bg-white' : 'bg-white/30'}`}></div>))}
            </div>
        </div>
    );
};

const MiqatModule = () => {
    const [userLoc, setUserLoc] = useState(null);
    const [alertDist, setAlertDist] = useState(20); 
    const [isActive, setIsActive] = useState(true);
    const [triggered, setTriggered] = useState({});
    const audioRef = useRef(new Audio(AUDIO_TELBIYE));

    useEffect(() => {
        let watchId;
        if (isActive && navigator.geolocation) {
            watchId = navigator.geolocation.watchPosition(
                (pos) => {
                    const { latitude: lat, longitude: lng } = pos.coords;
                    setUserLoc({ lat, lng });
                    MIQAT_DATA.forEach(m => {
                        const d = calculateDistance(lat, lng, m.lat, m.lng);
                        if (d <= alertDist && !triggered[m.id]) {
                            if (Notification.permission === "granted") new Notification("Mikat Sınırı", { body: `${m.title} ${d}km kaldı.` });
                            audioRef.current.play().catch(e => console.log(e));
                            setTriggered(prev => ({ ...prev, [m.id]: true }));
                        }
                    });
                },
                (err) => console.log(err), { enableHighAccuracy: true }
            );
        }
        return () => { if(watchId) navigator.geolocation.clearWatch(watchId); };
    }, [isActive, alertDist, triggered]);

    const openMap = (lat, lng) => window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');

    return (
        <div className="p-4 pb-24 animate-fade-in space-y-6">
            <div className="bg-indigo-900 text-white p-5 rounded-2xl relative overflow-hidden shadow-lg">
                <div className="relative z-10">
                    <h3 className="font-serif font-bold text-xl mb-2 text-indigo-200">Mikat Nedir?</h3>
                    <p className="text-sm text-indigo-100 opacity-90 leading-relaxed">
                        Harem bölgesine (Mekke) girmek isteyenlerin, ihramsız geçmemeleri gereken sınır noktalarıdır. 
                        Peygamber Efendimiz (s.a.v) tarafından belirlenmiştir. Bu sınırı geçmeden önce ihrama girilmeli ve niyet edilmelidir. Bu sınırları niyet etmeden ve ihrama girmeden geçmenin kurban kesme cezası vardır.
                    </p>
                </div>
                <div className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-10 rotate-12"><LucideIcon name="map-pin" className="w-full h-full" /></div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                        <LucideIcon name="bell-ring" className="w-4 h-4 text-gold-500" /> Yaklaşma Alarmı
                    </h4>
                    <button 
                        onClick={() => setIsActive(!isActive)}
                        className={`w-10 h-6 rounded-full p-1 transition-colors ${isActive ? 'bg-green-500' : 'bg-slate-300'}`}
                    >
                        <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${isActive ? 'translate-x-4' : ''}`}></div>
                    </button>
                </div>
                {isActive && (
                    <div className="flex gap-2">
                        {[10, 20, 50, 100].map(km => (
                            <button 
                                key={km} 
                                onClick={() => setAlertDist(km)}
                                className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${alertDist === km ? 'bg-indigo-50 border-indigo-500 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300' : 'border-slate-200 text-slate-500 dark:border-slate-700'}`}
                            >
                                {km} km
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="space-y-4">
                {MIQAT_DATA.map(m => {
                    const dist = userLoc ? calculateDistance(userLoc.lat, userLoc.lng, m.lat, m.lng) : null;
                    return (
                        <div key={m.id} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700">
                            <div className="h-32 bg-slate-200 dark:bg-slate-700 relative flex items-center justify-center">
                                {m.image.startsWith('[') ? (<div className="text-slate-400 text-xs flex flex-col items-center gap-2"><LucideIcon name="image" className="w-8 h-8 opacity-50" /><span>{m.title}</span></div>) : <img src={m.image} className="w-full h-full object-cover" />}
                                {dist && <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full font-mono">{dist} km</div>}
                            </div>
                            <div className="p-4">
                                <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100">{m.title}</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{m.desc}</p>
                                <button onClick={() => openMap(m.lat, m.lng)} className="w-full py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-bold text-xs rounded-lg flex items-center justify-center gap-2"><LucideIcon name="navigation" className="w-3 h-3" /> Yol Tarifi</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const DictionaryModule = () => {
    const [activeCat, setActiveCat] = useState("cat_sinir");
    const [searchQuery, setSearchQuery] = useState("");
    const [expandCard, setExpandCard] = useState(null);

    const speak = (text) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'ar-SA';
            utterance.rate = 0.8;
            window.speechSynthesis.speak(utterance);
        } else {
            alert("Cihazınız sesli okumayı desteklemiyor.");
        }
    };

    const filteredItems = searchQuery.length > 0 
        ? DICTIONARY_DATA.flatMap(cat => cat.items).filter(item => 
            item.tr.toLowerCase().includes(searchQuery.toLowerCase()) || 
            item.en.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : DICTIONARY_DATA.find(cat => cat.id === activeCat)?.items || [];

    return (
        <div className="p-4 pb-24 animate-fade-in space-y-4">
            <div className="bg-rose-900 text-white p-6 rounded-3xl relative overflow-hidden shadow-xl mb-2">
                <div className="relative z-10">
                    <h2 className="text-2xl font-serif font-bold mb-1">Acil Sözlük</h2>
                    <p className="text-rose-100 text-sm opacity-80">Seyahat, sağlık ve alışveriş için kurtarıcı cümleler.</p>
                </div>
                <div className="absolute -right-6 -bottom-6 w-32 h-32 text-rose-500 opacity-20 rotate-12">
                    <LucideIcon name="languages" className="w-full h-full" />
                </div>
            </div>

            <div className="sticky top-[75px] z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="relative flex items-center">
                    <LucideIcon name="search" className="absolute left-3 w-5 h-5 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Kelime veya cümle ara... (Örn: Su, Lastik)" 
                        className="w-full bg-transparent pl-10 pr-4 py-3 text-sm font-bold text-slate-800 dark:text-white placeholder-slate-400 outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery("")} className="absolute right-3 p-1 bg-slate-200 dark:bg-slate-700 rounded-full">
                            <LucideIcon name="x" className="w-3 h-3 text-slate-500" />
                        </button>
                    )}
                </div>
            </div>

            {!searchQuery && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
                    {DICTIONARY_DATA.map((d) => (
                        <button 
                            key={d.id} 
                            onClick={() => setActiveCat(d.id)} 
                            className={`flex flex-col items-center justify-center gap-2 min-w-[5rem] h-20 rounded-2xl transition-all border ${
                                activeCat === d.id 
                                ? 'bg-rose-500 text-white border-rose-600 shadow-lg shadow-rose-500/30 transform scale-105' 
                                : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-700'
                            }`}
                        >
                            <LucideIcon name={d.icon} className="w-6 h-6" />
                            <span className="text-[10px] font-bold text-center leading-tight px-1">{d.cat.split(' ')[0]}</span>
                        </button>
                    ))}
                </div>
            )}

            <div className="grid gap-3">
                {filteredItems.length === 0 ? (
                    <div className="text-center py-10 text-slate-400">
                        <LucideIcon name="search-x" className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Sonuç bulunamadı.</p>
                    </div>
                ) : (
                    filteredItems.map((item, i) => (
                        <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden group">
                            <div className="p-4 flex flex-col gap-3">
                                <div className="border-b border-slate-50 dark:border-slate-700/50 pb-2">
                                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{item.tr}</span>
                                    <span className="block text-[10px] text-slate-400 mt-0.5">{item.en}</span>
                                </div>
                                
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-2xl font-serif text-rose-600 dark:text-rose-400 font-bold mb-1" dir="rtl">{item.ar}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 italic">"{item.pron}"</p>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => speak(item.ar)} 
                                            className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 transition-colors"
                                        >
                                            <LucideIcon name="volume-2" className="w-5 h-5" />
                                        </button>
                                        <button 
                                            onClick={() => setExpandCard(item)} 
                                            className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-rose-600 hover:bg-rose-100 hover:scale-110 transition-all"
                                        >
                                            <LucideIcon name="maximize-2" className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {expandCard && (
                <div className="fixed inset-0 z-[100] bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
                    <button 
                        onClick={() => setExpandCard(null)} 
                        className="absolute top-6 right-6 p-3 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-300"
                    >
                        <LucideIcon name="x" className="w-6 h-6" />
                    </button>
                    
                    <div className="flex-1 flex flex-col items-center justify-center w-full">
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Göster (Show This)</p>
                        
                        <div className="w-full bg-rose-50 dark:bg-rose-900/10 p-8 rounded-3xl border-2 border-rose-100 dark:border-rose-900/30 mb-8">
                            <p className="text-5xl sm:text-6xl font-serif font-bold text-rose-600 dark:text-rose-400 leading-relaxed py-4" dir="rtl">
                                {expandCard.ar}
                            </p>
                        </div>
                        
                        <p className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">{expandCard.tr}</p>
                        <p className="text-slate-500 italic">"{expandCard.pron}"</p>

                        <button 
                            onClick={() => speak(expandCard.ar)} 
                            className="mt-12 px-8 py-4 bg-rose-600 text-white rounded-full font-bold shadow-xl shadow-rose-600/30 flex items-center gap-3 active:scale-95 transition-transform"
                        >
                            <LucideIcon name="volume-2" className="w-6 h-6" /> Sesli Okut
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const PremiumChecklist = () => {
    const [checkedItems, setCheckedItems] = useState({});
    const [activeTab, setActiveTab] = useState("Resmi Evraklar");

    useEffect(() => {
        if(window.lucide) window.lucide.createIcons();
    });

    useEffect(() => {
        const saved = localStorage.getItem('checklist_v3');
        if (saved) {
            setCheckedItems(JSON.parse(saved));
        }
    }, []);

    const toggleItem = (id) => {
        const newChecked = { ...checkedItems, [id] : !checkedItems[id] };
        setCheckedItems(newChecked);
        localStorage.setItem('checklist_v3', JSON.stringify(newChecked));
    };

    const allItems = Object.values(CHECKLISTS_DATA).flat();
    const totalItems = allItems.length;
    const completedCount = allItems.filter(i => checkedItems[i.id]).length;
    const progress = Math.round((completedCount / totalItems) * 100);

    return (
        <div className="p-4 pb-24 animate-fade-in space-y-6">
            
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 rounded-3xl relative overflow-hidden shadow-2xl border border-gold-500/20">
                <div className="relative z-10 flex justify-between items-center">
                    <div>
                        <p className="text-xs font-bold text-gold-500 uppercase tracking-widest mb-1">Yolculuk Hazırlığı</p>
                        <h2 className="text-3xl font-serif font-bold text-white mb-2">%{progress}</h2>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span className="bg-white/10 px-2 py-1 rounded text-white font-mono">{completedCount}/{totalItems}</span>
                            <span>Tamamlandı</span>
                        </div>
                    </div>
                    <div className="w-16 h-16 rounded-full border-4 border-slate-700 flex items-center justify-center relative">
                        <svg className="w-full h-full -rotate-90 absolute top-0 left-0" viewBox="0 0 36 36">
                            <path className="text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                            <path className="text-gold-500 transition-all duration-1000 ease-out" strokeDasharray={`${progress}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                        </svg>
                        <LucideIcon name={progress === 100 ? "check-circle-2" : "list-checks"} className={`w-6 h-6 ${progress === 100 ? "text-green-500" : "text-white"}`} />
                    </div>
                </div>
                <div className="absolute right-0 top-0 w-32 h-32 bg-gold-500/10 rounded-full blur-3xl pointer-events-none"></div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
                {Object.keys(CHECKLISTS_DATA).map(category => (
                    <button
                        key={category}
                        onClick={() => setActiveTab(category)}
                        className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                            activeTab === category 
                            ? 'bg-slate-900 dark:bg-gold-500 text-white dark:text-slate-900 border-slate-900 dark:border-gold-500 shadow-lg' 
                            : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="space-y-3">
                {CHECKLISTS_DATA[activeTab].map(item => {
                    const isChecked = checkedItems[item.id];
                    return (
                        <div 
                            key={item.id}
                            onClick={() => toggleItem(item.id)}
                            className={`group relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                                isChecked 
                                ? 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800' 
                                : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-gold-200 dark:hover:border-gold-500/30'
                            }`}
                        >
                            <div className="flex items-start gap-4 relative z-10">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                                    isChecked 
                                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-400' 
                                    : 'bg-gold-50 dark:bg-gold-900/20 text-gold-600 dark:text-gold-400'
                                }`}>
                                    <LucideIcon name={item.icon} className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <h4 className={`font-bold text-sm mb-1 transition-all ${isChecked ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-slate-100'}`}>
                                        {item.label}
                                    </h4>
                                    <p className={`text-[10px] leading-relaxed transition-colors ${isChecked ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                                        {item.desc}
                                    </p>
                                </div>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                    isChecked 
                                    ? 'bg-green-500 border-green-500 text-white scale-110' 
                                    : 'border-slate-300 dark:border-slate-600 text-transparent group-hover:border-gold-400'
                                }`}>
                                    <LucideIcon name="check" className="w-3.5 h-3.5" />
                                </div>
                            </div>
                            {isChecked && <div className="absolute inset-0 bg-slate-100/50 dark:bg-slate-900/50 pointer-events-none"></div>}
                        </div>
                    );
                })}
            </div>

            {completedCount === totalItems && (
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-900/50 text-center animate-fade-in-up">
                    <div className="inline-flex p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 mb-2">
                        <LucideIcon name="party-popper" className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-green-800 dark:text-green-300">Tebrikler!</h3>
                    <p className="text-xs text-green-700 dark:text-green-400">Tüm hazırlıklarını tamamladın. Yolun açık olsun.</p>
                </div>
            )}
        </div>
    );
};

// --- GÜNCELLENMİŞ ACİL NUMARALAR / OTO TAMİRCİLER BİLEŞENİ ---
const PremiumContacts = () => {
    const [activeTab, setActiveTab] = useState('official'); // 'official' | 'mechanics'

    return (
        <div className="p-4 pb-24 animate-fade-in space-y-4">
            
            {/* Üst Sekmeler (Tabs) */}
            <div className="flex bg-slate-200 dark:bg-slate-700 rounded-xl p-1 mb-4">
                <button 
                    onClick={() => setActiveTab('official')} 
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'official' ? 'bg-white dark:bg-slate-600 shadow text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                    <LucideIcon name="shield-alert" className="w-4 h-4" /> Resmi Makamlar
                </button>
                <button 
                    onClick={() => setActiveTab('mechanics')} 
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'mechanics' ? 'bg-white dark:bg-slate-600 shadow text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                    <LucideIcon name="wrench" className="w-4 h-4" /> Oto Tamirciler
                </button>
            </div>

            {activeTab === 'official' && (
                <div className="space-y-4 animate-fade-in-up">
                    {EMERGENCY_NUMBERS.map((e, i) => (
                        <a href={`tel:${e.number}`} key={i} className="block bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all active:scale-[0.98] group relative overflow-hidden">
                            <div className="relative z-10 flex items-center">
                                <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center mr-4 group-hover:bg-red-500 group-hover:text-white transition-colors"><LucideIcon name={e.icon} className="w-6 h-6" /></div>
                                <div><h4 className="font-bold text-slate-800 dark:text-slate-100">{e.title}</h4><p className="text-xs text-slate-400 mb-1">{e.desc}</p><span className="text-sm font-mono font-bold text-slate-600 dark:text-slate-300">{e.number}</span></div>
                                <div className="ml-auto bg-green-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0"><LucideIcon name="phone" className="w-4 h-4" /></div>
                            </div>
                        </a>
                    ))}
                </div>
            )}

            {activeTab === 'mechanics' && (
                <div className="space-y-4 animate-fade-in-up">
                    
                    {/* Bilgilendirme Metni */}
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/50 p-4 rounded-2xl mb-4 text-xs text-amber-800 dark:text-amber-300 leading-relaxed text-justify">
                        <span className="font-bold block mb-1 text-sm flex items-center gap-1">
                            <LucideIcon name="info" className="w-4 h-4" /> Bilgilendirme
                        </span>
                        Karayolu ile umre seyahatlerinde araç arızaları yaşanabilmektedir. Özellikle Ortadoğu coğrafyasında Avrupa araçların parça temini ve tamiri zor olabildiğinden, Japon ve Kore grubu araçlar tavsiye edilir. Olası arıza durumlarında derdinizi anlatabileceğiniz, farklı şehirlerde hizmet veren Türk ustalarımızın iletişim bilgilerini aşağıda bulabilirsiniz. Rabbim yolculuğunuzu kolaylaştırsın, sağ salim gidip dönmeyi nasip eylesin.
                    </div>

                    {/* Tamirci Kartları */}
                    {AUTO_MECHANICS_DATA.map((item) => (
                        <div key={item.id} className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center">
                                        <LucideIcon name="wrench" className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 dark:text-slate-100">{item.name}</h4>
                                        <div className="flex flex-wrap items-center gap-2 mt-0.5">
                                            <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded font-bold text-slate-500 dark:text-slate-300 flex items-center gap-1">
                                                <LucideIcon name="map-pin" className="w-3 h-3" /> {item.city}
                                            </span>
                                            <span className="text-[10px] text-slate-400">{item.type}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {item.altPhone && (
                                <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5 font-mono">
                                    <LucideIcon name="phone" className="w-3 h-3" /> Alternatif TR: {item.altPhone}
                                </div>
                            )}

                            <div className="flex gap-2">
                                <a href={`tel:${item.phone}`} className="flex-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-colors shadow-sm active:scale-95">
                                    <LucideIcon name="phone" className="w-4 h-4" /> Ara
                                </a>
                                <a href={getWaLink(item.phone)} target="_blank" rel="noreferrer" className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold shadow-md shadow-green-500/20 transition-colors active:scale-95">
                                    <LucideIcon name="message-circle" className="w-4 h-4" /> WhatsApp
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const UmrahGuideDetail = () => {
    const [active, setActive] = useState(null);

    const steps = [
        {
            t: "1. Hazırlık ve İhram (Mikat)", 
            d: "Mikât sınırına gelindiğinde mümkünse gusül abdesti alınır. Erkekler dikişsiz, beyaz iki parça örtüden oluşan izar ve rida ile ihrama girer. Ardından iki rekât ihram namazı kılınır. İhram ve tavaf namazlarında ise birinci rekâtta Fâtiha sûresinden sonra Kâfirûn Suresi, ikinci rekâtta Fâtiha sûresinden sonra İhlâs Suresi okunur.", 
            icon: "shirt", 
            text: "Niyet: Allah'ım senin rızan için umre yapmak istiyorum. Bunu bana kolaylaştır ve benden kabul eyle."
        },
        {
            t: "2. Telbiye ve Yolculuk", 
            d: "Niyetten sonra Kabe görülene kadar yol boyunca sık sık, yüksek sesle Telbiye getirilir. İhram yasakları başlamıştır.", 
            icon: "footprints", 
            text: "Lebbeyk Allahümme Lebbeyk. Lebbeyke lâ şerîke leke lebbeyk. İnnel hamde ven-ni’mete leke vel mülk, lâ şerîke lek."
        },
        {
            t: "3. Harem'e Giriş ve Selamlama", 
            d: "Mescid-i Haram'a sağ ayakla, tevazu ile girilir. Kabe ilk görüldüğünde yapılan dua reddedilmez, samimiyetle dua edilir.", 
            icon: "map-pin", 
            text: "Allah'ım! Bu Beyt'in (Kabe'nin) şerefini, azametini, keremini ve heybetini artır."
        },
        {
            t: "4. Tavaf Hazırlığı (Iztıba)", 
            d: "Tavafa başlamadan önce erkekler, üst ihramın (Rida) bir ucunu sağ koltuk altından geçirip sol omuz üzerine atar. Sağ omuz açık kalır.", 
            icon: "user", 
            text: "Niyet: Allah'ım senin rızan için Umre tavafını yapmak istiyorum."
        },
        {
            t: "5. Tavaf (7 Şavt)", 
            d: "Tavaf, Hacerül Esved hizasından başlar ve yine Hacerül Esved’de sona erer. Her şavta başlarken Hacerül Esved selamlanır ve ‘Bismillahi Allahu Ekber’ denir. Kâbe sola alınarak 7 şavt tamamlanır. Erkekler ilk 3 şavtta omuzları silkeler tarzda canlı ve hızlı yürür (Remel). Tavafın başlangıç hizasını belirlemek için tavaf alanında ve üst katlarda yeşil ışık bulunmaktadır. Rükn-i Yemânî, Hacerül Esved’den bir önceki köşedir. Her şavtta, Hacerül Esved’den bir önceki köşe olan Rükn-i Yemânî de selamlanır ve buradan Hacerül Esved’e varıncaya kadar “Rabbena atina” duası okunur.", 
            icon: "repeat", 
            text: "Bismillahi Allahu Ekber. (Rükn-i Yemani ile Hacer-ül Esved arası: Rabbenâ âtina fid'dunyâ haseneten ve fil'âhirati haseneten ve kınâ azâbennâr. Rabbenâğfirlî ve li-vâlideyye ve lilMu'minine yevme yekûmu'l hisâb.)"
        },
        {
            t: "6. Tavaf Namazı ve Zemzem", 
            d: "Tavaf bitince omuz kapatılır. Kerahat vakti değilse Makam-ı İbrahim arkasında 2 rekat namaz kılınır, ardından Zemzem içilir. Dipnot: Tavaf namazında da yukarıda belirtildiği üzere birinci rekâtta Fâtiha’dan sonra Kâfirûn Suresi, ikinci rekâtta Fâtiha’dan sonra İhlâs Suresi okunur.", 
            icon: "droplets", 
            text: "Zemzem içerken: Allah'ım! Senden faydalı ilim, bol rızık ve her türlü dertten şifa niyaz ediyorum."
        },
        {
            t: "7. Sa'y (Safa ve Merve)", 
            d: "Safa tepesine çıkılır, Kabe'ye dönülüp tekbir getirilir. Safa'dan Merve'ye 4, Merve'den Safa'ya 3 kez gidilir. Yeşil ışıklı alanda erkekler koşar (Hervele).", 
            icon: "activity", 
            text: "İnnes-safa vel-mervete min şeairillah... (Şüphesiz Safa ve Merve Allah'ın nişanelerindendir.)"
        },
        {
            t: "8. Tıraş ve İhramdan Çıkış", 
            d: "Sa'y bitince Merve tepesinde dua edilir. Erkekler saçlarını tamamen kazıtır veya kısaltır, kadınlar uçtan keser. Umre tamamlanmış olur.", 
            icon: "scissors", 
            text: "Elhamdülillah. (Allah kabul etsin.)"
        }
    ];

    return (
        <div className="p-4 space-y-3 pb-24 animate-fade-in">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800 mb-4">
                <h3 className="font-bold text-emerald-800 dark:text-emerald-400">Umre Rehberi</h3>
                <p className="text-xs text-emerald-600">Sünnet ve edeplerine uygun tam rehber</p>
            </div>
            {steps.map((s, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden transition-all">
                    <button onClick={() => setActive(active === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                                <LucideIcon name={s.icon} className="w-4 h-4 text-slate-500" />
                            </div>
                            <span className="font-bold text-sm text-slate-700 dark:text-slate-200">{s.t}</span>
                        </div>
                        <LucideIcon name="chevron-down" className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${active === i ? 'rotate-180 text-emerald-500' : ''}`} />
                    </button>
                    {active === i && (
                        <div className="px-4 pb-4 pl-[3.25rem]">
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">{s.d}</p>
                            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border-l-4 border-amber-400">
                                <p className="text-[10px] font-bold text-amber-700 mb-1 opacity-75 tracking-wider uppercase">Okunacak Dua / Niyet</p>
                                <p className="text-xs italic text-slate-700 dark:text-slate-300 font-medium">"{s.text}"</p>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

const About = () => {

    const handleShare = async () => {
        const shareData = {
            title: 'UmreGO',
            text: 'Karayolu ile umre yolculuğu için en kapsamlı rehber uygulama. Rota, maliyet hesabı ve daha fazlası.',
            url: window.location.href
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(window.location.href);
                alert("Link kopyalandı!");
            } catch (err) {
                alert("Paylaşım desteklenmiyor.");
            }
        }
    };

    return (
        <div className="p-4 pb-24 animate-fade-in space-y-6">
            <div className="relative bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-xl border border-slate-100 dark:border-slate-700">
                <div className="h-32 bg-gradient-to-r from-emerald-600 to-emerald-900 relative">
                      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
                      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 bg-gold-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg overflow-hidden">
                        <img src={DEVELOPER_PHOTO_URL} alt="SG" className="w-full h-full object-cover" />
                      </div>
                </div>
                <div className="pt-12 pb-6 px-6 text-center">
                    <h2 className="text-2xl font-serif font-bold text-slate-800 dark:text-white">Sami G.</h2>
                    <span className="inline-block mt-2 px-3 py-1 rounded-full bg-gold-50 dark:bg-gold-900/30 text-gold-600 dark:text-gold-400 text-xs font-bold uppercase tracking-wider">Uygulama Geliştiricisi</span>
                    <div className="mt-6 text-left space-y-4">
                         <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                            <p className="font-serif text-lg text-emerald-800 dark:text-emerald-400 mb-2 text-center">﷽</p>
                            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-serif text-justify">
                                <span className="font-bold block mb-2 text-slate-800 dark:text-slate-200 text-center">Esselamü Aleyküm ve Rahmetullah,</span>
                                Kıymetli Allah'ın misafirleri; bu çalışma, Haremeyn-i Şerifeyn'e vuslat yolculuğunda sizlere rehberlik etmek, bu meşakkatli ama kutlu seferde yükünüzü bir nebze olsun hafifletmek gayesiyle "Sadaka-i Cariye" niyetiyle hazırlanmıştır. Dualarınızda bulunmak temennisiyle.
                                <br /><br />Uygulamanın hiçbir yerinde veri kaydı yoktur ve tamamen tarayıcı (telefon hafızası) temelli çalışmaktadır, güvenle kullanabilirsiniz.
                                    <br /><br /><b>Özel Teşekkür:</b> Sitenin içeriğinin zenginleştirilmesi sürecinde katkılarından ötürü <b>Mekke ve Medineden Esintiler</b> kanalı sahibi hocamızdan Allah (c.c.) ebeden razı olsun.
                            </p>
                         </div>
                    </div>
                    
                    <div className="mt-6">
                        <a href={FEEDBACK_FORM_URL} target="_blank" className="block w-full py-3 px-4 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-600 dark:text-slate-300 text-sm font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-2">
                            <LucideIcon name="message-circle" className="w-4 h-4" />
                            Geri Bildirim & Öneri Gönder
                        </a>
                        <p className="text-[10px] text-slate-400 mt-2">Görüşleriniz uygulamayı geliştirmemiz için önemlidir.</p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
                        <div className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gold-500/10 rounded-full -mr-10 -mt-10 blur-xl transition-all group-hover:bg-gold-500/20"></div>
                            
                            <h3 className="font-serif font-bold text-lg text-slate-800 dark:text-white mb-1">Hayra Vesile Ol</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Bu rehberi sevdiklerinle paylaşarak onların da yolculuğunu kolaylaştır.</p>
                            
                            <button 
                                onClick={handleShare}
                                className="w-full py-3 bg-slate-900 dark:bg-gold-500 text-white dark:text-slate-900 font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <LucideIcon name="share-2" className="w-4 h-4" />
                                Uygulamayı Paylaş
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            <footer className="legal-footer mt-8 mb-4">
                <div className="max-w-md mx-auto text-center">
                    <div className="flex items-center justify-center gap-3 mb-4 opacity-30">
                        <div className="h-[1px] w-12 bg-slate-400 dark:bg-slate-500"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-gold-500"></div>
                        <div className="h-[1px] w-12 bg-slate-400 dark:bg-slate-500"></div>
                    </div>

                    <h6 className="text-[10px] uppercase tracking-[0.2em] text-gold-600 dark:text-gold-400 font-bold mb-3">
                        Yasal Uyarı & Bilgilendirme
                    </h6>

                    <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 font-light mx-auto">
                        Bu uygulamadaki tüm içerik ve öneriler, şahsi tecrübeler ışığında hazırlanmış <span className="font-medium text-slate-600 dark:text-slate-300">tavsiye niteliğindedir</span>. 
                        İçerikler deneyimlere dayandığı için sehven hatalı bilgi içerebilir. 
                        Uygulama hiçbir surette <span className="font-medium text-slate-600 dark:text-slate-300">kişisel veri kaydı yapmamakta</span> olup, 
                        kullanımdan doğabilecek durumlardan hiçbir sorumluluk kabul edilmemektedir.
                    </p>

                    <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 font-light mt-2 italic">
                        "Gayemiz; Allah rızasını kazanmak amacıyla kutsal topraklara gitmek isteyenlere rehber olmaktır."
                    </p>
                    
                    <div className="mt-6 opacity-20 flex justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 dark:text-slate-500">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 16v-4"/>
                            <path d="M12 8h.01"/>
                        </svg>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const PrayerTimesDetail = () => {
    const [city, setCity] = useState("Mekke");
    const [times, setTimes] = useState(null);
    const [nextPrayer, setNextPrayer] = useState(null);
    const [countdown, setCountdown] = useState("");
    const [dataDate, setDataDate] = useState("");
    const [isOffline, setIsOffline] = useState(false);
    const [lastFetch, setLastFetch] = useState("");
    const todayStr = new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    useEffect(() => {
        if (!times) return;
        const timer = setInterval(() => {
            const now = new Date();
            const currentTime = now.getHours() * 60 + now.getMinutes();
            const currentSeconds = now.getSeconds();
            const prayerList = [{ name: 'Imsak', time: times.Imsak }, { name: 'Gunes', time: times.Gunes }, { name: 'Ogle', time: times.Ogle }, { name: 'Ikindi', time: times.Ikindi }, { name: 'Aksam', time: times.Aksam }, { name: 'Yatsi', time: times.Yatsi }];
            let next = null;
            let minDiff = Infinity;
            for (let p of prayerList) {
                const [h, m] = p.time.split(':').map(Number);
                const pTime = h * 60 + m;
                let diff = pTime - currentTime;
                if (diff < 0) diff += 24 * 60;
                if (diff < minDiff) { minDiff = diff; next = p; }
            }
            setNextPrayer(next);
            const totalSecs = (minDiff * 60) - currentSeconds;
            const h = Math.floor(totalSecs / 3600);
            const m = Math.floor((totalSecs % 3600) / 60);
            const s = totalSecs % 60;
            setCountdown(`${h}:${m < 10 ? '0'+m : m}:${s < 10 ? '0'+s : s}`);
        }, 1000);
        return () => clearInterval(timer);
    }, [times]);

    useEffect(() => {
        const fetchTimes = async () => {
            try {
                const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Saudi Arabia&method=4`);
                if (!response.ok) throw new Error("API Hatası");
                const data = await response.json();
                const t = data.data.timings;
                const formatted = { Imsak: t.Fajr, Gunes: t.Sunrise, Ogle: t.Dhuhr, Ikindi: t.Asr, Aksam: t.Maghrib, Yatsi: t.Isha };
                setTimes(formatted);
                setDataDate(data.data.date.readable);
                setLastFetch(new Date().toLocaleTimeString());
                setIsOffline(false);
                localStorage.setItem(`prayer_${city}`, JSON.stringify({ t: formatted, d: data.data.date.readable, lf: new Date().toLocaleTimeString() }));
            } catch (e) {
                const saved = localStorage.getItem(`prayer_${city}`);
                if (saved) { const p = JSON.parse(saved); setTimes(p.t); setDataDate(p.d); setLastFetch(p.lf || "Bilinmiyor"); } 
                else { setTimes({ Imsak: "05:00", Gunes: "06:30", Ogle: "12:30", Ikindi: "15:45", Aksam: "18:20", Yatsi: "19:50" }); }
                setIsOffline(true);
            }
        };
        fetchTimes();
    }, [city]);

    return (
        <div className="p-4 pb-20 animate-fade-in space-y-4">
            <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl mb-4">
                {["Mekke", "Medine"].map(c => ( <button key={c} onClick={() => setCity(c)} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${city === c ? 'bg-white dark:bg-slate-600 shadow text-gold-600' : 'text-slate-500'}`}>{c}</button> ))}
            </div>
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10 text-center"><p className="text-xs text-gold-400 font-bold uppercase tracking-widest mb-1">{city}</p><h2 className="text-xl font-serif font-bold mb-2">{todayStr}</h2>{nextPrayer && (<div className="mt-4 p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10 inline-block"><p className="text-xs text-slate-300 mb-1">{nextPrayer.name} Vaktine Kalan</p><p className="text-3xl font-mono font-bold text-gold-400">{countdown}</p></div>)}</div>
                <div className="absolute -right-4 -top-4 w-32 h-32 text-white opacity-5"><LucideIcon name="moon" className="w-full h-full" /></div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden divide-y divide-slate-100 dark:divide-slate-700">
                {times && Object.entries(times).map(([v, s]) => {
                    const pOrder = ['Imsak', 'Gunes', 'Ogle', 'Ikindi', 'Aksam', 'Yatsi'];
                    const nextIdx = nextPrayer ? pOrder.indexOf(nextPrayer.name) : -1;
                    const currentIdx = nextIdx === 0 ? 5 : nextIdx - 1; 
                    const isCurrent = pOrder[currentIdx] === v;
                    return (
                        <div key={v} className={`p-4 flex justify-between items-center transition-colors ${isCurrent ? 'bg-gold-50 dark:bg-gold-900/20' : ''}`}>
                            <div className="flex items-center gap-3"><span className={`text-xs font-bold uppercase tracking-wider ${isCurrent ? 'text-gold-600 dark:text-gold-400' : 'text-slate-400'}`}>{v}</span>{isCurrent && <span className="flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500"></span></span>}</div>
                            <span className={`font-mono text-xl font-bold ${isCurrent ? 'text-gold-700 dark:text-gold-300' : 'text-slate-800 dark:text-slate-200'}`}>{s}</span>
                        </div>
                    );
                })}
            </div>
            {isOffline && (<div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/50"><LucideIcon name="wifi-off" className="w-4 h-4 text-red-500" /><div className="text-xs text-red-700 dark:text-red-300 leading-tight"><span className="font-bold block">Çevrimdışı Mod</span>Son güncelleme: {lastFetch}. Lütfen internetinizi kontrol ediniz.</div></div>)}
        </div>
    );
};

const CurrencyConverter = () => {
    const [amount, setAmount] = useState(1);
    const [fromCurr, setFromCurr] = useState('SAR');
    const [toCurr, setToCurr] = useState('TRY');
    const [rates, setRates] = useState(null);
    const [result, setResult] = useState(0);

    useEffect(() => {
        const fetchRates = async () => {
            try {
                const res = await fetch('https://api.exchangerate-api.com/v4/latest/SAR');
                const data = await res.json();
                setRates(data.rates);
                localStorage.setItem('rates_v2', JSON.stringify(data.rates));
            } catch (e) {
                setRates(JSON.parse(localStorage.getItem('rates_v2')));
            }
        };
        fetchRates();
    }, []);

    useEffect(() => {
        if (!rates) return;
        const fromRate = rates[fromCurr];
        const toRate = rates[toCurr];
        if (fromRate && toRate) {
            const inSar = amount / fromRate;
            const finalVal = inSar * toRate;
            setResult(finalVal.toFixed(2));
        }
    }, [amount, fromCurr, toCurr, rates]);

    const swap = () => { setFromCurr(toCurr); setToCurr(fromCurr); };

    return (
        <div className="p-6 animate-fade-in space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 relative">
                <h3 className="font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2"><LucideIcon name="arrow-left-right" className="w-5 h-5 text-gold-500" /> Döviz Çevirici</h3>
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 mb-2">
                    <label className="text-[10px] uppercase font-bold text-slate-400 mb-1">Dönüştürülecek Tutar</label>
                    <div className="flex justify-between items-center">
                        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="bg-transparent text-2xl font-bold text-slate-800 dark:text-slate-100 focus:outline-none w-1/2" />
                        <select value={fromCurr} onChange={(e) => setFromCurr(e.target.value)} className="bg-white dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-200 p-2 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 outline-none">
                            <option value="SAR">🇸🇦 SAR</option>
                            <option value="USD">🇺🇸 USD</option>
                            <option value="TRY">🇹🇷 TRY</option>
                            <option value="EUR">🇪🇺 EUR</option>
                            <option value="JOD">🇯🇴 JOD</option>
                        </select>
                    </div>
                </div>
                <div className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 z-10"><button onClick={swap} className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white dark:border-slate-800 hover:scale-110 transition-transform"><LucideIcon name="arrow-down-up" className="w-5 h-5" /></button></div>
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 mt-2">
                    <label className="text-[10px] uppercase font-bold text-slate-400 mb-1">Karşılık</label>
                    <div className="flex justify-between items-center">
                        <div className="text-2xl font-bold text-gold-600 dark:text-gold-400">{result}</div>
                        <select value={toCurr} onChange={(e) => setToCurr(e.target.value)} className="bg-white dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-200 p-2 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 outline-none">
                            <option value="SAR">🇸🇦 SAR</option>
                            <option value="USD">🇺🇸 USD</option>
                            <option value="TRY">🇹🇷 TRY</option>
                            <option value="EUR">🇪🇺 EUR</option>
                            <option value="JOD">🇯🇴 JOD</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- GÜNCELLENMİŞ HARİTA GÖRÜNÜMÜ BİLEŞENİ ---
const PlacesMap = ({ placesList, userLoc }) => {
    const mapRef = useRef(null);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const markersRef = useRef([]);

    useEffect(() => {
        if(window.lucide) window.lucide.createIcons();
    });

    useEffect(() => {
        let isMounted = true;
        const loadLeaflet = async () => {
            if (!window.L) {
                const css = document.createElement('link');
                css.rel = 'stylesheet';
                css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                document.head.appendChild(css);

                const loadScript = (src) => new Promise(resolve => {
                    const script = document.createElement('script');
                    script.src = src;
                    script.onload = resolve;
                    document.head.appendChild(script);
                });

                await loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js');
            }
            if (isMounted) initMap();
        };

        loadLeaflet();

        return () => {
            isMounted = false;
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    const updateMarkerIcons = () => {
        if (!mapRef.current) return;
        const zoom = mapRef.current.getZoom();
        const isZoomedIn = zoom >= 9; // İyice yaklaşma eşiği (7'den 9'a çıkarıldı)

        markersRef.current.forEach(item => {
            // Sarı daireler kaldırıldı, sadece emoji ve yaklaşınca yanda mini bilgi çerçevesi
            const html = isZoomedIn 
                ? `<div class="relative z-50 cursor-pointer group">
                    <div class="text-3xl transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform origin-center" style="filter: drop-shadow(0px 6px 8px rgba(0,0,0,0.4));">📍</div>
                    <div class="absolute left-3 top-1/2 -translate-y-1/2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm px-2 py-1 rounded-md shadow-md border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap ml-1 pointer-events-none">
                        ${item.place.title}
                    </div>
                   </div>`
                : `<div class="text-3xl transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform origin-center z-40 cursor-pointer" style="filter: drop-shadow(0px 6px 8px rgba(0,0,0,0.4));">📍</div>`;

            item.marker.setIcon(window.L.divIcon({
                className: 'custom-place-marker bg-transparent border-0',
                html: html,
                iconSize: [0, 0],
                iconAnchor: [0, 0]
            }));
        });
    };

    const initMap = () => {
        if (mapRef.current) return;
        
        const mapContainer = document.getElementById('places-map-canvas');
        if(!mapContainer) return;

        // Varsayılan olarak Medine-Mekke arası bir odak
        const map = window.L.map(mapContainer, { zoomControl: false }).setView([24.4672, 39.6109], 5); 
        mapRef.current = map;

        window.L.tileLayer('https://mt1.google.com/vt/lyrs=m&hl=tr&x={x}&y={y}&z={z}', {
            attribution: '&copy; Google Maps',
            maxZoom: 19
        }).addTo(map);

        window.L.control.zoom({ position: 'topright' }).addTo(map);

        // Kullanıcı Konumu Pini
        if (userLoc) {
            const userIcon = window.L.divIcon({
                className: 'user-loc-marker',
                html: `<div class="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center animate-ping absolute inset-0"></div>
                       <div class="w-8 h-8 rounded-full bg-blue-500 border-2 border-white shadow-xl flex items-center justify-center text-white relative z-10 text-sm">🚶</div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 16]
            });
            window.L.marker([userLoc.lat, userLoc.lng], { icon: userIcon, zIndexOffset: 1000 }).addTo(map);
        }

        // Mekan Pinleri
        placesList.forEach(place => {
            const marker = window.L.marker([place.lat, place.lng]).addTo(map);
            
            marker.on('click', () => {
                setSelectedPlace(place);
                
                // Harita odaklanırken mevcut zoom seviyesini değil, hedef zoom seviyesini baz almalıyız ki proje/koordinat hesabı şaşmasın.
                const targetZoom = map.getZoom() < 12 ? 12 : map.getZoom();
                const pt = map.project([place.lat, place.lng], targetZoom);
                
                // Kart açıldığında haritanın engelsiz(üst) kısmında görünmesi için pikselsel olarak aşağı kaydır
                pt.y += map.getSize().y * 0.25; 
                
                map.flyTo(map.unproject(pt, targetZoom), targetZoom, { duration: 0.6 });
            });

            markersRef.current.push({ marker, place });
        });

        updateMarkerIcons();
        map.on('zoomend', updateMarkerIcons);
    };

    const openMapDir = (lat, lng) => window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
    const openYoutube = (url) => window.open(url, '_blank');

    return (
        <div className="relative w-full h-[70vh] rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
            <div id="places-map-canvas" className="w-full h-full z-0" style={{ minHeight: '100%' }}></div>
            
            {/* Alt Premium Kart (Bottom Sheet Modal) */}
            <div className={`absolute bottom-0 left-0 right-0 z-[1500] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-white/20 dark:border-slate-700/50 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform ${selectedPlace ? 'translate-y-0' : 'translate-y-[120%]'}`}>
                {selectedPlace && (
                    <div className="flex flex-col max-h-[60vh]">
                        {/* Kapatma ve Sürükleme Çubuğu */}
                        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/50 backdrop-blur-md rounded-full cursor-pointer z-20 shadow-sm" onClick={() => setSelectedPlace(null)}></div>
                        <button onClick={() => setSelectedPlace(null)} className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors z-20">
                            <LucideIcon name="x" className="w-4 h-4" />
                        </button>

                        {/* Kart Header / Image */}
                        <div className="h-40 shrink-0 relative overflow-hidden rounded-t-[2rem]">
                            {selectedPlace.image.startsWith('[') ? (
                                <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                    <LucideIcon name="image" className="w-10 h-10" />
                                </div>
                            ) : (
                                <img src={selectedPlace.image} alt={selectedPlace.title} className="w-full h-full object-cover" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
                            <div className="absolute bottom-4 left-5 right-5">
                                <span className="px-2 py-0.5 rounded text-[10px] bg-gold-500 text-white font-bold uppercase tracking-wider mb-1 inline-block shadow-sm">Lokasyon</span>
                                <h3 className="text-xl font-bold text-white leading-tight shadow-sm">{selectedPlace.title}</h3>
                            </div>
                        </div>

                        {/* Kart İçerik */}
                        <div className="p-5 overflow-y-auto">
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
                                {selectedPlace.desc}
                            </p>

                            {userLoc && (
                                <div className="flex items-center gap-2 mb-5 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                                    <LucideIcon name="navigation" className="w-4 h-4 text-blue-500" />
                                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Şu anki konumunuza uzaklık:</span>
                                    <span className="text-sm font-mono font-bold text-slate-800 dark:text-slate-200 ml-auto">
                                        {calculateDistance(userLoc.lat, userLoc.lng, selectedPlace.lat, selectedPlace.lng)} km
                                    </span>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button onClick={() => openMapDir(selectedPlace.lat, selectedPlace.lng)} className="flex-1 py-3 bg-gold-500 hover:bg-gold-600 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-gold-500/20 active:scale-95">
                                    <LucideIcon name="map" className="w-4 h-4" /> Yol Tarifi Al
                                </button>
                                
                                {selectedPlace.youtube && (
                                    <button onClick={() => openYoutube(selectedPlace.youtube)} className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-red-500/20 active:scale-95">
                                        <LucideIcon name="youtube" className="w-4 h-4" /> Videoyu İzle
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- GÜNCELLENMİŞ PLACES DETAIL BİLEŞENİ ---
const PlacesDetail = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [userLoc, setUserLoc] = useState(null);
    const [viewMode, setViewMode] = useState('list'); // 'list' veya 'map'

    useEffect(() => { 
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                p => setUserLoc({ lat: p.coords.latitude, lng: p.coords.longitude }),
                () => console.log("Konum alınamadı.")
            );
        }
    }, []);

    const openMap = (lat, lng) => window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
    
    // Tüm mekanları tek bir listede birleştiriyoruz (Harita için gerekli)
    const allPlaces = PLACES_DATA.reduce((acc, category) => [...acc, ...category.items], []);

    return (
        <div className="p-4 pb-24 animate-fade-in space-y-4">
            
            {/* Görünüm Değiştirici (Toggle) */}
            <div className="flex bg-slate-200 dark:bg-slate-700 rounded-xl p-1 mb-2">
                <button 
                    onClick={() => setViewMode('list')} 
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${viewMode === 'list' ? 'bg-white dark:bg-slate-600 shadow text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                    <LucideIcon name="list" className="w-4 h-4" /> Liste Görünümü
                </button>
                <button 
                    onClick={() => setViewMode('map')} 
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${viewMode === 'map' ? 'bg-white dark:bg-slate-600 shadow text-gold-600' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                    <LucideIcon name="map-pin" className="w-4 h-4" /> Harita Görünümü
                </button>
            </div>

            {viewMode === 'list' ? (
                <>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
                        {PLACES_DATA.map((c, i) => (
                            <button key={i} onClick={() => setActiveTab(i)} className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold border transition-colors ${activeTab === i ? 'bg-gold-500 border-gold-500 text-slate-900' : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'}`}>{c.category}</button>
                        ))}
                    </div>
                    <div className="space-y-4 animate-fade-in-up">
                        {PLACES_DATA[activeTab].items.map(p => {
                            const dist = userLoc ? calculateDistance(userLoc.lat, userLoc.lng, p.lat, p.lng) : null;
                            return (
                                <div key={p.id} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700">
                                    <div className="h-48 bg-slate-200 dark:bg-slate-700 relative flex items-center justify-center">
                                        {p.image.startsWith('[') ? (<div className="text-slate-400 text-xs flex flex-col items-center gap-2"><LucideIcon name="image" className="w-8 h-8 opacity-50" /><span>{p.title}</span></div>) : (<img src={p.image} className="w-full h-full object-cover" />)}
                                        {dist && <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5"><LucideIcon name="navigation" className="w-3 h-3 text-gold-400" /> {dist} km</div>}
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-bold text-xl text-slate-800 dark:text-slate-100">{p.title}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-5 leading-relaxed">{p.desc}</p>
                                        <div className="flex gap-3">
                                            <button onClick={() => openMap(p.lat, p.lng)} className="flex-1 py-3 bg-gold-50 dark:bg-gold-900/20 text-gold-700 dark:text-gold-400 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors hover:bg-gold-100 dark:hover:bg-gold-900/40">
                                                <LucideIcon name="map" className="w-4 h-4" /> Yol Tarifi
                                            </button>
                                            {p.youtube && (
                                                <button onClick={() => window.open(p.youtube, '_blank')} className="flex-1 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors hover:bg-red-100 dark:hover:bg-red-900/40">
                                                    <LucideIcon name="youtube" className="w-4 h-4" /> Video İzle
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            ) : (
                <div className="animate-fade-in-up">
                    <PlacesMap placesList={allPlaces} userLoc={userLoc} />
                </div>
            )}
        </div>
    );
};

const ComprehensiveGuide = () => {
    const [activeSection, setActiveSection] = useState(null);

    return (
        <div className="p-4 pb-24 animate-fade-in space-y-4">
             <div className="bg-emerald-900 text-white p-6 rounded-2xl relative overflow-hidden shadow-xl mb-6">
                <div className="relative z-10">
                    <h2 className="text-2xl font-serif font-bold mb-1">Seyahat Rehberi</h2>
                    <p className="text-emerald-100 text-sm opacity-80">Sınır geçişleri ve resmi prosedürler.</p>
                </div>
                <div className="absolute -right-6 -bottom-6 w-32 h-32 text-emerald-500 opacity-20 rotate-12"><LucideIcon name="book-open" className="w-full h-full" /></div>
            </div>

            {GUIDE_DATA.map((section) => (
                <div key={section.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm transition-all duration-300">
                    <button
                        onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                        className="w-full flex items-center justify-between p-5 text-left"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${section.color}-50 dark:bg-${section.color}-900/20 text-${section.color}-600`}>
                                <LucideIcon name={section.icon} className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-slate-800 dark:text-slate-100">{section.title}</h3>
                        </div>
                        <div className={`transition-transform duration-300 ${activeSection === section.id ? 'rotate-180' : ''}`}>
                            <LucideIcon name="chevron-down" className="w-5 h-5 text-slate-400" />
                        </div>
                    </button>
                    {activeSection === section.id && (
                        <div className="px-5 pb-5 border-t border-slate-100 dark:border-slate-700 pt-4 bg-slate-50 dark:bg-slate-800/50">
                            <div className="space-y-4">
                                {section.content.map((item, idx) => (
                                    <div key={idx} className="relative pl-4 border-l-2 border-slate-200 dark:border-slate-600">
                                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">{item.t}</h4>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.d}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

// --- ANA UYGULAMA (GÜVENLİK KORUMALARI EKLENDİ) ---
const App = () => {
    const [view, setView] = useState('dashboard');
    const [installPrompt, setInstallPrompt] = useState(null);
    const [showBanner, setShowBanner] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const lastBackPress = useRef(0);
    const [settings, setSettings] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('sets')) || { fontSize: 'medium', theme: 'light', notifications: false, location: false };
        } catch {
            return { fontSize: 'medium', theme: 'light', notifications: false, location: false };
        }
    });

    useEffect(() => { if(window.lucide) window.lucide.createIcons(); });

    // --- YENİ EKLENEN GÜVENLİK / KOPYALAMA KORUMASI ---
    useEffect(() => {
        // 1. Sağ tık engelleme
        const handleContextMenu = (e) => e.preventDefault();
        document.addEventListener('contextmenu', handleContextMenu);

        // 2. Klavye kısayolları engelleme (F12, Ctrl+U, Ctrl+Shift+I, Ctrl+C, Ctrl+A)
        const handleKeyDown = (e) => {
            if (
                e.key === 'F12' || 
                (e.ctrlKey && e.shiftKey && e.key === 'I') || 
                (e.ctrlKey && e.key === 'U') || 
                (e.ctrlKey && e.key === 'C') || 
                (e.ctrlKey && e.key === 'A')
            ) {
                e.preventDefault();
            }
        };
        document.addEventListener('keydown', handleKeyDown);

        // 3. Metin seçimi engelleme CSS'i
        const noSelectStyle = document.createElement('style');
        noSelectStyle.innerHTML = `
            body {
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
            /* Sadece input alanlarında (örneğin döviz ve maliyet hesaplayıcı) seçime ve yazmaya izin ver */
            input, textarea {
                -webkit-user-select: text;
                -moz-user-select: text;
                -ms-user-select: text;
                user-select: text;
            }
        `;
        document.head.appendChild(noSelectStyle);

        // Cleanup
        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
            if (document.head.contains(noSelectStyle)) {
                document.head.removeChild(noSelectStyle);
            }
        };
    }, []);

    // --- NAVİGASYON VE GERİ TUŞU YÖNETİMİ ---
    const handleNavigation = (newView) => {
        if (newView === view) return;
        window.scrollTo(0, 0); 
        window.history.pushState({ view: newView }, '', '');
        setView(newView);
    };

    useEffect(() => {
        window.history.replaceState({ view: 'dashboard' }, '', '');

        const onPopState = (event) => {
            if (event.state && event.state.view) {
                setView(event.state.view);
                window.scrollTo(0, 0);
            } else {
                const now = Date.now();
                if (now - lastBackPress.current < 2000) {
                    window.history.back(); 
                } else {
                    lastBackPress.current = now;
                    window.history.pushState({ view: 'dashboard' }, '', '');
                    
                    const t = document.getElementById('exit-toast');
                    if (t) {
                        t.classList.remove('opacity-0', 'pointer-events-none');
                        t.classList.add('opacity-100');
                        setTimeout(() => {
                            t.classList.add('opacity-0', 'pointer-events-none');
                            t.classList.remove('opacity-100');
                        }, 2000);
                    }
                }
            }
        };

        window.addEventListener('popstate', onPopState);
        return () => window.removeEventListener('popstate', onPopState);
    }, []);

    useEffect(() => {
        const homeBtn = document.getElementById('nav-home-btn');
        const backBtn = document.getElementById('nav-back-btn');

        const goHome = () => handleNavigation('dashboard');
        const goBack = () => window.history.back();

        if(homeBtn) homeBtn.addEventListener('click', goHome);
        if(backBtn) backBtn.addEventListener('click', goBack);

        return () => {
            if(homeBtn) homeBtn.removeEventListener('click', goHome);
            if(backBtn) backBtn.removeEventListener('click', goBack);
        };
    }, [view]);

    useEffect(() => {
        if (window.gtag) {
            window.gtag('event', 'page_view', {
                page_title: view,
                page_path: `/${view}`
            });
        }
    }, [view]);

    useEffect(() => {
        const savedVersion = localStorage.getItem('app_saved_version');
        const currentVersion = APP_VERSION;

        if (savedVersion && savedVersion !== currentVersion) {
            setShowUpdateModal(true);
        }

        localStorage.setItem('app_saved_version', currentVersion);
        
        localStorage.setItem('sets', JSON.stringify(settings));
        document.documentElement.className = settings.theme === 'dark' ? 'dark' : '';
        document.documentElement.classList.remove('text-sm', 'text-base', 'text-lg');
        document.documentElement.classList.add(settings.fontSize === 'small' ? 'text-sm' : settings.fontSize === 'large' ? 'text-lg' : 'text-base');
    }, [settings]);

    useEffect(() => {
        const h = (e) => { e.preventDefault(); setInstallPrompt(e); setShowBanner(true); }; 
        window.addEventListener('beforeinstallprompt', h);
        const timer = setTimeout(() => { if(!localStorage.getItem('dismiss_v2')) setShowBanner(true); }, 3000);
        return () => window.removeEventListener('beforeinstallprompt', h);
    }, []);

    const handleInstall = () => {
        if(!installPrompt) { alert("Tarayıcı özelliği zaten yüklendi."); setShowBanner(false); localStorage.setItem('dismiss_v2', 'true'); return; }
        installPrompt.prompt();
    };

    const updateSettings = (k, v) => setSettings(p => ({...p, [k]: v}));

    const renderView = () => {
        switch(view) {
            case 'dashboard': return (
                <div className="p-4 grid grid-cols-2 gap-3 pb-24 animate-fade-in">
                    <FeaturedCards handleNavigation={handleNavigation} />
                    <AnnouncementBar />
                    <MenuCard icon="book-open" label="Seyahat Rehberi" subLabel="Sınır & Prosedür" colorClass="bg-emerald-500 text-emerald-600" onClick={() => handleNavigation('travelGuide')} />
                    <MenuCard icon="map" label="Rota Simülasyonu" subLabel="Adım Adım Beytullah’a" colorClass="bg-cyan-500 text-cyan-600" onClick={() => handleNavigation('routeSim')} />
                    <MenuCard icon="briefcase" label="İhtiyaç Listesi" subLabel="Evrak, İhram, Araç..." colorClass="bg-purple-500 text-purple-600" onClick={() => handleNavigation('luggage')} />
                    <MenuCard icon="calculator" label="Maliyet Hesapla" subLabel="Tahmini Gider Hesaplama" colorClass="bg-slate-700 text-slate-800 dark:text-slate-100" onClick={() => handleNavigation('costCalc')} />
                    <MenuCard icon="moon" label="Umre İbadeti" subLabel="Adım Adım Umre" colorClass="bg-amber-500 text-amber-600" onClick={() => handleNavigation('guide')} />
                    <MenuCard icon="map-pin" label="Mikat Mahalleri" subLabel="Sınırlar & Alarm" colorClass="bg-indigo-500 text-indigo-600" onClick={() => handleNavigation('miqat')} />
                    <MenuCard icon="bed-double" label="Otel & Restaurant" subLabel="Önerilen Mekânlar" colorClass="bg-orange-500 text-orange-600" onClick={() => handleNavigation('hotelsRestaurants')} />
                    <MenuCard icon="map" label="Gezilecek Yerler" subLabel="Suriye-Mekke" colorClass="bg-blue-500 text-blue-600" onClick={() => handleNavigation('places')} />
                    <MenuCard icon="clock" label="Namaz Vakitleri" subLabel="Mekke & Medine Güncel" colorClass="bg-cyan-500 text-cyan-600" onClick={() => handleNavigation('times')} />
                    <MenuCard icon="arrow-left-right" label="Döviz" subLabel="Hesaplama & Çevirici" colorClass="bg-green-600 text-green-700" onClick={() => handleNavigation('currency')} />
                    <MenuCard icon="phone" label="Acil Numaralar" subLabel="Resmi & Ustalar" colorClass="bg-red-500 text-red-600" onClick={() => handleNavigation('contacts')} />
                    <MenuCard icon="languages" label="Acil Sözlük" subLabel="İngilizce & Arapça Kalıplar" colorClass="bg-rose-500 text-rose-600" onClick={() => handleNavigation('dictionary')} />
                    <MenuCard icon="link" label="Faydalı Siteler" subLabel="İşe Yarar Linkler" colorClass="bg-teal-500 text-teal-600" onClick={() => handleNavigation('usefulLinks')} />
                    <MenuCard icon="info" label="Hakkında" subLabel="Künye & Geribildirim" colorClass="bg-slate-400 text-slate-500" onClick={() => handleNavigation('about')} />
                </div>
            );
            case 'routeSim': return <RouteSimulation />;
            case 'travelGuide': return <ComprehensiveGuide />;
            case 'costCalc': return <CostCalculator />;
            case 'guide': return <UmrahGuideDetail />;
            case 'places': return <PlacesDetail />;
            case 'times': return <PrayerTimesDetail />;
            case 'currency': return <CurrencyConverter />;
            case 'luggage': return <PremiumChecklist />;
            case 'contacts': return <PremiumContacts />;
            case 'miqat': return <MiqatModule />;
            case 'dictionary': return <DictionaryModule />;
            case 'hotelsRestaurants': return <HotelsRestaurantsModule />;
            case 'usefulLinks': return <UsefulLinksModule />;
            case 'about': return <About />;
            default: return <div className="p-10 text-center">Yapım aşamasında</div>;
        }
    };

    return (
        <div className="min-h-screen transition-colors duration-500 relative bg-slate-50 dark:bg-[#0f172a]">
            <Header title={view === 'dashboard' ? 'LOGO_STYLE' : 'Rehber'} goBack={view !== 'dashboard' ? () => window.history.back() : null} onOpenSettings={() => setShowSettings(true)} showSettingsBtn={true} />
            <main className="max-w-3xl mx-auto">{renderView()}</main>
            {view !== 'dashboard' && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"><button onClick={() => handleNavigation('dashboard')} className="bg-slate-900/90 dark:bg-slate-800/90 backdrop-blur-md text-gold-400 px-6 py-3 rounded-full shadow-2xl border border-gold-500/20 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"><LucideIcon name="layout-grid" className="w-5 h-5" /><span className="font-bold text-sm">Ana Menü</span></button></div>}
            
            <div id="exit-toast" className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-xs opacity-0 pointer-events-none transition-opacity z-50">
                Çıkmak için tekrar geri tuşuna basın.
            </div>

            <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} settings={settings} updateSettings={updateSettings} installPrompt={installPrompt} onInstall={handleInstall} />
            <UpdateModal show={showUpdateModal} onClose={() => setShowUpdateModal(false)} version={APP_VERSION} />
            <InstallBanner show={showBanner} onInstall={handleInstall} onClose={() => {setShowBanner(false); localStorage.setItem('dismiss_v2', 'true');}} />
        </div>
    );
};

const container = document.getElementById('root');
if (!container._reactRoot) {
    const root = ReactDOM.createRoot(container);
    container._reactRoot = root;
    root.render(<App />);
} else {
    container._reactRoot.render(<App />);
}
