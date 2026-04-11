export type Hook = {
  id: number
  text: string
  category: string
  platform: string
  engagement: 'high' | 'medium' | 'low'
}

export const HOOK_CATEGORIES_TR = [
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

export const HOOK_CATEGORIES_EN = [
  'All',
  'Curiosity',
  'Debate Starter',
  'Storytelling',
  'Educational',
  'Motivation',
  'Sales',
  'Trending',
  'Personal',
]

// For backward compat
export const HOOK_CATEGORIES = HOOK_CATEGORIES_TR

export const HOOKS_TR: Hook[] = [
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

export const HOOKS_EN: Hook[] = [
  // Curiosity
  { id: 101, text: "Nobody is talking about this but...", category: "Curiosity", platform: "twitter", engagement: "high" },
  { id: 102, text: "Everything changed when I learned this.", category: "Curiosity", platform: "instagram", engagement: "high" },
  { id: 103, text: "I'm sharing a secret I've kept for 3 years.", category: "Curiosity", platform: "instagram", engagement: "high" },
  { id: 104, text: "99% of people don't know this.", category: "Curiosity", platform: "tiktok", engagement: "high" },
  { id: 105, text: "There's something everyone gets wrong...", category: "Curiosity", platform: "twitter", engagement: "high" },
  { id: 106, text: "You won't believe this but...", category: "Curiosity", platform: "tiktok", engagement: "medium" },
  { id: 107, text: "Save this post. You'll thank me later.", category: "Curiosity", platform: "instagram", engagement: "high" },
  { id: 108, text: "POV: You just learned something that will change your life", category: "Curiosity", platform: "tiktok", engagement: "high" },

  // Debate Starter
  { id: 110, text: "Unpopular opinion: ...", category: "Debate Starter", platform: "twitter", engagement: "high" },
  { id: 111, text: "I think everyone is wrong about this.", category: "Debate Starter", platform: "twitter", engagement: "high" },
  { id: 112, text: "You're going to disagree with me on this...", category: "Debate Starter", platform: "linkedin", engagement: "high" },
  { id: 113, text: "Most say X. I say Y. Here's why:", category: "Debate Starter", platform: "linkedin", engagement: "medium" },
  { id: 114, text: "Hot take: ...", category: "Debate Starter", platform: "twitter", engagement: "high" },
  { id: 115, text: "I'll probably get cancelled for saying this but...", category: "Debate Starter", platform: "twitter", engagement: "high" },

  // Storytelling
  { id: 120, text: "This time last year, I had nothing. Today...", category: "Storytelling", platform: "instagram", engagement: "high" },
  { id: 121, text: "There's a story behind this photo.", category: "Storytelling", platform: "instagram", engagement: "high" },
  { id: 122, text: "I was 24 with less than $50 in my bank account.", category: "Storytelling", platform: "linkedin", engagement: "high" },
  { id: 123, text: "I quit my job. Here's the next 365 days:", category: "Storytelling", platform: "linkedin", engagement: "high" },
  { id: 124, text: "When I read this customer's message, I teared up.", category: "Storytelling", platform: "instagram", engagement: "medium" },
  { id: 125, text: "Everyone said 'don't do it.' I did it anyway. Here's what happened:", category: "Storytelling", platform: "tiktok", engagement: "high" },

  // Educational
  { id: 130, text: "Learn this in 5 minutes: ...", category: "Educational", platform: "instagram", engagement: "high" },
  { id: 131, text: "I wish I knew this sooner...", category: "Educational", platform: "tiktok", engagement: "high" },
  { id: 132, text: "Here's everything you need to know about [topic]:", category: "Educational", platform: "linkedin", engagement: "medium" },
  { id: 133, text: "Thread: Step-by-step guide to [topic] 🧵", category: "Educational", platform: "twitter", engagement: "high" },
  { id: 134, text: "These 3 mistakes are why you're failing:", category: "Educational", platform: "linkedin", engagement: "high" },
  { id: 135, text: "Save and apply. Results in 30 days.", category: "Educational", platform: "instagram", engagement: "medium" },
  { id: 136, text: "Beginner's guide: From zero to [topic]", category: "Educational", platform: "linkedin", engagement: "medium" },

  // Motivation
  { id: 140, text: "Today is the perfect day to start.", category: "Motivation", platform: "instagram", engagement: "medium" },
  { id: 141, text: "Success isn't one night. It's every night.", category: "Motivation", platform: "linkedin", engagement: "medium" },
  { id: 142, text: "Nobody started perfect. Everyone started somewhere.", category: "Motivation", platform: "instagram", engagement: "high" },
  { id: 143, text: "Remind yourself: You're here because you have talent.", category: "Motivation", platform: "tiktok", engagement: "medium" },
  { id: 144, text: "A year from now, you'll look back and say 'I'm glad I started.'", category: "Motivation", platform: "instagram", engagement: "high" },

  // Sales
  { id: 150, text: "Don't buy this product without seeing this.", category: "Sales", platform: "tiktok", engagement: "high" },
  { id: 151, text: "Here's what our customers are saying:", category: "Sales", platform: "instagram", engagement: "medium" },
  { id: 152, text: "Try it free for 7 days. No risk.", category: "Sales", platform: "twitter", engagement: "medium" },
  { id: 153, text: "Why do 10,000+ people choose us?", category: "Sales", platform: "linkedin", engagement: "high" },
  { id: 154, text: "This ends this weekend. Last chance.", category: "Sales", platform: "instagram", engagement: "high" },
  { id: 155, text: "Last [X] units before the price goes up.", category: "Sales", platform: "twitter", engagement: "high" },

  // Trending
  { id: 160, text: "If you're not doing this in 2026, you'll fall behind.", category: "Trending", platform: "linkedin", engagement: "high" },
  { id: 161, text: "Everyone's talking about AI but the real opportunity is in [X].", category: "Trending", platform: "twitter", engagement: "high" },
  { id: 162, text: "Get on this trend early and win.", category: "Trending", platform: "tiktok", engagement: "high" },
  { id: 163, text: "A quiet revolution in the industry: ...", category: "Trending", platform: "linkedin", engagement: "medium" },
  { id: 164, text: "Pay attention, this is going to blow up: ...", category: "Trending", platform: "twitter", engagement: "medium" },

  // Personal
  { id: 170, text: "I'm going to make a confession today.", category: "Personal", platform: "instagram", engagement: "high" },
  { id: 171, text: "3 months ago I hit burnout. Here's what I learned:", category: "Personal", platform: "linkedin", engagement: "high" },
  { id: 172, text: "The biggest mistake I made when starting my first business:", category: "Personal", platform: "linkedin", engagement: "high" },
  { id: 173, text: "My morning routine (steal it):", category: "Personal", platform: "tiktok", engagement: "medium" },
  { id: 174, text: "I'll be honest: This wasn't easy.", category: "Personal", platform: "instagram", engagement: "medium" },
]

// Default export for backward compat
export const HOOKS = HOOKS_TR
