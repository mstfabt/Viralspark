export type Hook = {
  id: number
  text: string
  category: string
  platform: string
  engagement: 'high' | 'medium' | 'low'
}

export const HOOK_CATEGORIES = [
  'Tümü',
  'Merak Uyandıran',
  'Tartışma Başlatan',
  'Hikaye Anlatıcı',
  'Eğitici',
  'Motivasyon',
  'Satış',
  'Trend',
  'Kişisel',
]

export const HOOKS: Hook[] = [
  // Merak Uyandıran
  { id: 1, text: "Kimse bundan bahsetmiyor ama...", category: "Merak Uyandıran", platform: "twitter", engagement: "high" },
  { id: 2, text: "Bunu öğrendiğimde her şey değişti.", category: "Merak Uyandıran", platform: "instagram", engagement: "high" },
  { id: 3, text: "3 yıldır sakladığım sırrı paylaşıyorum.", category: "Merak Uyandıran", platform: "instagram", engagement: "high" },
  { id: 4, text: "Bu bilgiyi %99 insan bilmiyor.", category: "Merak Uyandıran", platform: "tiktok", engagement: "high" },
  { id: 5, text: "Herkesin yanlış bildiği bir şey var...", category: "Merak Uyandıran", platform: "twitter", engagement: "high" },
  { id: 6, text: "Bana inanmayacaksınız ama...", category: "Merak Uyandıran", platform: "tiktok", engagement: "medium" },
  { id: 7, text: "Bu gönderiyi kaydedin. İleride teşekkür edeceksiniz.", category: "Merak Uyandıran", platform: "instagram", engagement: "high" },
  { id: 8, text: "POV: Az önce hayatını değiştirecek bir şey öğrendin", category: "Merak Uyandıran", platform: "tiktok", engagement: "high" },

  // Tartışma Başlatan
  { id: 10, text: "Unpopular opinion: ...", category: "Tartışma Başlatan", platform: "twitter", engagement: "high" },
  { id: 11, text: "Bence herkes bunda yanılıyor.", category: "Tartışma Başlatan", platform: "twitter", engagement: "high" },
  { id: 12, text: "Bu konuda bana katılmayacaksınız ama...", category: "Tartışma Başlatan", platform: "linkedin", engagement: "high" },
  { id: 13, text: "Çoğunluk X diyor. Ben Y diyorum. İşte nedeni:", category: "Tartışma Başlatan", platform: "linkedin", engagement: "medium" },
  { id: 14, text: "Hot take: ...", category: "Tartışma Başlatan", platform: "twitter", engagement: "high" },
  { id: 15, text: "Bunu söylediğim için linç yiyeceğim ama...", category: "Tartışma Başlatan", platform: "twitter", engagement: "high" },

  // Hikaye Anlatıcı
  { id: 20, text: "Geçen yıl bugün, hiçbir şeyim yoktu. Bugün ise...", category: "Hikaye Anlatıcı", platform: "instagram", engagement: "high" },
  { id: 21, text: "Bu fotoğrafın arkasında bir hikaye var.", category: "Hikaye Anlatıcı", platform: "instagram", engagement: "high" },
  { id: 22, text: "24 yaşımdaydım ve cebimde 50 lira bile yoktu.", category: "Hikaye Anlatıcı", platform: "linkedin", engagement: "high" },
  { id: 23, text: "Patronuma istifamı verdim. İşte sonraki 365 gün:", category: "Hikaye Anlatıcı", platform: "linkedin", engagement: "high" },
  { id: 24, text: "Bu müşterinin mesajını okuyunca gözlerim doldu.", category: "Hikaye Anlatıcı", platform: "instagram", engagement: "medium" },
  { id: 25, text: "Herkes 'yapma' dedi. Ben yaptım. İşte sonuç:", category: "Hikaye Anlatıcı", platform: "tiktok", engagement: "high" },

  // Eğitici
  { id: 30, text: "5 dakikada öğren: ...", category: "Eğitici", platform: "instagram", engagement: "high" },
  { id: 31, text: "Bunu daha önce bilseydim keşke...", category: "Eğitici", platform: "tiktok", engagement: "high" },
  { id: 32, text: "İşte [konu] hakkında bilmeniz gereken her şey:", category: "Eğitici", platform: "linkedin", engagement: "medium" },
  { id: 33, text: "Thread: [konu] için adım adım rehber 🧵", category: "Eğitici", platform: "twitter", engagement: "high" },
  { id: 34, text: "Bu 3 hata yüzünden başarısız oluyorsunuz:", category: "Eğitici", platform: "linkedin", engagement: "high" },
  { id: 35, text: "Kaydet ve uygula. Sonuçlar 30 günde gelecek.", category: "Eğitici", platform: "instagram", engagement: "medium" },
  { id: 36, text: "Başlangıç rehberi: 0'dan [konu]'ya", category: "Eğitici", platform: "linkedin", engagement: "medium" },

  // Motivasyon
  { id: 40, text: "Bugün başlamak için mükemmel gün.", category: "Motivasyon", platform: "instagram", engagement: "medium" },
  { id: 41, text: "Başarı bir gece değil, her gece.", category: "Motivasyon", platform: "linkedin", engagement: "medium" },
  { id: 42, text: "Kimse mükemmel başlamadı. Herkes bir yerden başladı.", category: "Motivasyon", platform: "instagram", engagement: "high" },
  { id: 43, text: "Kendine hatırlat: Sen buradasın çünkü yeteneğin var.", category: "Motivasyon", platform: "tiktok", engagement: "medium" },
  { id: 44, text: "1 yıl sonra bugüne dönüp bakacaksın ve 'iyi ki başlamışım' diyeceksin.", category: "Motivasyon", platform: "instagram", engagement: "high" },

  // Satış
  { id: 50, text: "Bu ürünü görmeden satın almayın.", category: "Satış", platform: "tiktok", engagement: "high" },
  { id: 51, text: "Müşterilerimiz bunu söylüyor:", category: "Satış", platform: "instagram", engagement: "medium" },
  { id: 52, text: "7 gün ücretsiz deneyin. Risk yok.", category: "Satış", platform: "twitter", engagement: "medium" },
  { id: 53, text: "Neden 10.000+ kişi bizi tercih ediyor?", category: "Satış", platform: "linkedin", engagement: "high" },
  { id: 54, text: "Bu hafta sonu bitiyor. Son şansınız.", category: "Satış", platform: "instagram", engagement: "high" },
  { id: 55, text: "Fiyat artmadan son [X] adet.", category: "Satış", platform: "twitter", engagement: "high" },

  // Trend
  { id: 60, text: "2026'da bunu yapmayan geride kalacak.", category: "Trend", platform: "linkedin", engagement: "high" },
  { id: 61, text: "Herkes AI konuşuyor ama asıl fırsat [X]'te.", category: "Trend", platform: "twitter", engagement: "high" },
  { id: 62, text: "Bu trend'e erken binen kazanacak.", category: "Trend", platform: "tiktok", engagement: "high" },
  { id: 63, text: "Sektörde sessiz devrim: ...", category: "Trend", platform: "linkedin", engagement: "medium" },
  { id: 64, text: "Dikkat edin, bu büyüyecek: ...", category: "Trend", platform: "twitter", engagement: "medium" },

  // Kişisel
  { id: 70, text: "Bugün size bir itirafta bulunacağım.", category: "Kişisel", platform: "instagram", engagement: "high" },
  { id: 71, text: "3 ay önce burnout yaşadım. İşte öğrendiğim dersler:", category: "Kişisel", platform: "linkedin", engagement: "high" },
  { id: 72, text: "İlk işimi kurduğumda en büyük hatam buydu:", category: "Kişisel", platform: "linkedin", engagement: "high" },
  { id: 73, text: "Benim sabah rutinim (kopyalayın):", category: "Kişisel", platform: "tiktok", engagement: "medium" },
  { id: 74, text: "Dürüst olacağım: Bu kolay değildi.", category: "Kişisel", platform: "instagram", engagement: "medium" },
]
