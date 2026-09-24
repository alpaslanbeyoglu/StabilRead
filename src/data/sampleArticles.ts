import { ArticleItem } from '../types';

export const SAMPLE_ARTICLES: ArticleItem[] = [
  {
    id: 'vestibulo-ocular',
    title: 'Hareket Halinde Okuma ve Vestibülo-Oküler Refleks (VOR)',
    category: 'Nöroloji & Bilişsel Bilim',
    readTimeMin: 4,
    author: 'Dr. Selin Aksoy',
    date: '24 Mart 2026',
    summary: 'Araçta seyahat ederken neden kitap veya telefon okumak baş dönmesi yapar ve gözlerimiz neden odağını kaybeder?',
    content: [
      'İnsan gözü, evrimsel süreçte avlanırken veya koşarken baş hareketlerini dengelemek üzere olağanüstü bir biyolojik mekanizma geliştirmiştir: Vestibülo-Oküler Refleks (VOR). İç kulaktaki semisirküler kanallar, başımızın milimetrik dönüşlerini ve ivmelerini algılayarak göz kaslarına milisaniyeler içinde ters yönde sinyal gönderir.',
      'Ancak bir otomobilin arka koltuğunda oturup elimizde akıllı telefon tuttuğumuzda bu biyolojik denge kökten sarsılır. Otomobil asfalttaki mikronluk pürüzlerden, çukurlardan ve virajlardan geçerken telefon elimizde saniyede 10 ila 30 kez titreşir.',
      'Gözlerimiz elimizdeki ekrana odaklanmak isterken, vücudumuz bambaşka bir ivme vektörüne maruz kalır. Sonuç; retinaya düşen harflerin hızla kayması (retinal slip), göz kaslarının aşırı yorulması ve vestibüler uyumsuzluk kaynaklı araç tutmasıdır (motion sickness).',
      'Akıllı stabilizasyon algoritmaları, telefonun dahili MEMS ivmeölçer verilerini alarak yazıyı ekran üzerinde titreşimin tam tersi fazda (180° ters faz) kaydırır. Böylece telefon elinizde sarsılsa dahi, yazı kullanıcının göz retinasına göre uzayda tamamen sabit kalır.',
      'Bu teknoloji yalnızca okuma konforunu katlamakla kalmaz; göz yorgunluğunu %70 oranında azaltarak seyahatleri üretken okuma seanslarına dönüştürür.'
    ]
  },
  {
    id: 'quantum-computing',
    title: 'Kuantum Bilgisayarlar ve Atomik Titreşim İzolasyonu',
    category: 'İleri Teknoloji & Fizik',
    readTimeMin: 6,
    author: 'Prof. Kaan Erdener',
    date: '18 Mart 2026',
    summary: 'Kuantum kübitlerinin dekoheransını engellemek için geliştirilen kriyojenik sönümleme sistemleri günlük hayatımıza nasıl uyarlanıyor?',
    content: [
      'Kuantum hesaplamanın kalbinde yatan süperpozisyon ve dolanıklık durumları, evrenin en kırılgan kuantum halleridir. Bir kübitin durumu, ortamdaki en ufak bir termal dalgalanma veya mikroskobik zemin sarsıntısı yüzünden saniyenin milyonda birinde bozulabilir (dekoherans).',
      'IBM ve Google gibi devlerin kuantum laboratuvarlarında, devasa seyreltme buzdolapları çok katmanlı yay-kütle damperleri ve manyetik kaldırma yatakları üzerine inşa edilir. Bu düzenekler, kilometrelerce ötedeki bir otoyoldan geçen kamyonun yarattığı sismik gürültüyü bile filtreler.',
      'Günümüzde akıllı telefonlarımızda yer alan mikro-elektro-mekanik sistemler (MEMS), bu kuantum laboratuvarlarındaki algoritmik filtreleme prensiplerini avuçlarımızın içine taşımıştır.',
      'Gelişmiş Kalman filtreleri, telefonun üç eksenli ivmeölçer ve jiroskop çiplerinden gelen yüksek gürültülü ham veriyi ayıklar; yerçekimi bileşenini gerçek sarsıntıdan ayırır ve piksel düzeyinde ters kuvvet oluşturur.',
      'Geleceğin giyilebilir artırılmış gerçeklik (AR) gözlükleri ve saydam ekranları da aynı mekanik prensiplerle göz hareketlerimizi ve araç sarsıntılarını kusursuz bir optik dengeye oturtacaktır.'
    ]
  },
  {
    id: 'james-webb-optics',
    title: 'James Webb Uzay Teleskobu: Uzayda Sıfır Titreşim Mühendisliği',
    category: 'Astrofizik & Uzay',
    readTimeMin: 5,
    author: 'Merve Gökmen',
    date: '12 Şubat 2026',
    summary: 'Dünya’dan 1.5 milyon kilometre uzakta, Lagrange-2 noktasında en ufak bir titreşim olmadan evrenin ilk ışıklarını yakalamak.',
    content: [
      'James Webb Uzay Teleskobu (JWST), Büyük Patlama’dan sadece birkaç yüz milyon yıl sonra oluşan ilk galaksileri görüntüleyebilmek için pikometre (metrenin trilyonda biri) seviyesinde hassasiyetle konumlanmak zorundadır.',
      'Teleskobun içindeki reaksiyon tekerlekleri veya kriyosoğutucu pompalar bile en ufak bir rezonans ürettiğinde, milyarlarca ışık yılı uzaktan gelen soluk kızılötesi fotonlar bulanıklaşır.',
      'NASA mühendisleri, JWST’nin devasa 6.5 metrelik berilyum aynalarını gövdeden ayıran özel dinamik sönümleme aktüatörleri ve aktif optik kontrol sistemleri geliştirdiler. Ayna arkasındaki piezoseramik motorlar, saniyede yüzlerce kez milimetrenin milyonda biri kadar mikro düzeltmeler yapar.',
      'StabilRead okuma motorunun arkasındaki matematiksel prensip, JWST aktif ayna dengeleme mimarisinin bir mikro yazılım uyarlamasıdır: Dış dünyadaki kaos ve sarsıntı ne kadar yüksek olursa olsun, odaklanılan bilgi daima durağan kalmalıdır.'
    ]
  },
  {
    id: 'night-train-journey',
    title: 'Doğu Ekspresi’nde Gece Yolculuğu ve Sessiz Sayfalar',
    category: 'Edebiyat & Anlatı',
    readTimeMin: 3,
    author: 'Cemal Özkan',
    date: '5 Ocak 2026',
    summary: 'Karlar altında rayların ritmik tıkırtısı eşliğinde bir kompartımanda sarsıntısız okumanın huzuru.',
    content: [
      'Kars’a doğru yol alan trenin kompartımanında sarı bir okuma lambası yanıyordu. Dışarıda ay ışığının aydınlattığı sonsuz bir beyazlık, donmuş nehirler ve çam ormanları geriye doğru akıp gidiyordu.',
      'Rayların birleşim yerlerinden gelen o tanıdık "tak-tak, tak-tak" sesi vagonu hafifçe beşik gibi sallarken, parmaklarımın arasındaki ekranda harfler tek bir milim bile oynamadan gözlerimin önünde asılı duruyordu.',
      'Bir zamanlar sarsıntılı trenlerde ya da otobüs virajlarında kitap okumak imkansız bir çaba, gözleri zonklatan bir inattı. Şimdi ise teknoloji doğanın sarsıntısını zarafetle emiyor; kelimeler tıpkı durağan bir kütüphane masasında açılmış gibi dingin akıyor.',
      'Pencereye vuran kar taneleri ve gecenin soğuğu karşısında, harflerin bu hareketsiz sıcaklığı insanın içine derin bir yolculuk sükuneti dolduruyor.'
    ]
  }
];
