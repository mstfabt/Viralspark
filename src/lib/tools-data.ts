export type ToolContent = {
  h1: string
  subtitle: string
  intro: string
  benefits: { title: string; desc: string }[]
  howItWorks: { step: string; desc: string }[]
  example: { input: string; output: string }
  faq: { q: string; a: string }[]
  cta: string
  relatedBlogSlug: string
}

export type Tool = {
  slug: string
  /** Primary TR keyword the page targets. */
  keyword: string
  /** Primary EN keyword the page targets. */
  keywordEn: string
  /** Internal route the CTA should link to (Clerk-gated). */
  dashboardPath: string
  icon: string
  tr: ToolContent
  en: ToolContent
}

export const TOOLS: Tool[] = [
  {
    slug: 'instagram-caption-olusturucu',
    keyword: 'instagram caption oluşturucu',
    keywordEn: 'instagram caption generator',
    dashboardPath: '/dashboard',
    icon: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z',
    tr: {
      h1: 'Instagram Caption Oluşturucu — AI ile Saniyeler İçinde',
      subtitle: 'Yapay zeka destekli Instagram caption oluşturucu. Hook\'tan CTA\'ya kadar eksiksiz, Türkçe dostu, platform limitlerine uyumlu caption\'lar üretin.',
      intro: 'ViralSpark\'ın Instagram caption oluşturucusu, Gemini 2.5 Flash modeliyle çalışır. Bir konu yazın ya da bir URL yapıştırın — 4 saniye içinde 3 farklı caption varyasyonu, her biri için viral skor ve hashtag önerisi alırsınız. Feed, Reels, Story, Carousel için ayrı optimize edilmiş formatlar.',
      benefits: [
        { title: '4 Saniyede 3 Varyasyon', desc: 'Aynı konu için eğlenceli, profesyonel ve samimi ton seçeneklerini yan yana görün, en iyisini seçin.' },
        { title: 'Türkçe Karakter Dostu', desc: 'AI, Türkçe özel karakterleri (ğ, ş, ç, ö, ü, ı) bozmadan, doğal Türkçe dilbilgisiyle yazar.' },
        { title: 'Platform Limitlerine Uyumlu', desc: 'Instagram\'ın 2.200 karakter sınırına uyar, ilk satırı "Daha fazla göster" butonu için optimize eder.' },
        { title: 'Hashtag Dahil', desc: 'Her caption için 10-15 hedefli hashtag önerisi, doğru kategori dağılımıyla birlikte.' },
      ],
      howItWorks: [
        { step: 'Konu yaz', desc: 'Caption\'ını yazmak istediğiniz konuyu yazın ya da bir haber/ürün URL\'si yapıştırın.' },
        { step: 'Ton seç', desc: 'Eğlenceli, profesyonel, samimi, öğretici — markanıza en yakın tonu seçin.' },
        { step: 'Üret', desc: 'AI 4 saniyede 3 farklı caption varyasyonu üretir, her biri viral skor ve hashtag önerisiyle gelir.' },
        { step: 'Kopyala', desc: 'Beğendiğiniz caption\'ı tek tıkla kopyalayın, Instagram\'a yapıştırın, yayınlayın.' },
      ],
      example: {
        input: 'Konu: Yeni kafemizin açılışı',
        output: '☕ 3 yıllık hayalimizi bugün raflara taşıdık.\n\nHer fincanın arkasında bir hikâye var — kendi kavurduğumuz çekirdekler, yerel seramikçilerin el işi kupalar, komşumuz ressamın duvarlarımızı süsleyen tabloları.\n\nBu bir kafe değil, bir topluluk. Ve bugün seni de içine davet ediyoruz.\n\n📍 Adres linki bio\'da\n🕒 Pazartesi-Cumartesi 08:00-22:00\n\nSeni ilk kahvede görelim ☕\n\n#kahvetutkunu #specialtycoffee #istanbulkafe #yenikafe #üçüncüdalgakahve #kahvemolası #bağdatcaddesi',
      },
      faq: [
        { q: 'ViralSpark\'ın caption oluşturucusu ücretsiz mi?', a: 'Evet, ücretsiz planda günde 3 üretim hakkınız var. Pro plana geçerseniz sınırsız olur.' },
        { q: 'Üretilen caption\'lar tamamen orijinal mi?', a: 'Evet. AI her seferinde benzersiz bir çıktı üretir. Aynı konu için iki farklı üretim birbirinden farklıdır.' },
        { q: 'Hangi dillerde caption üretebilirim?', a: 'Türkçe, İngilizce ve 20+ dil desteklenir. Türkçe çıktılar Türkçe karakterlere tam uyumludur.' },
        { q: 'Caption üretimi ne kadar sürüyor?', a: 'Ortalama 4 saniye. 3 varyasyon + viral skor + hashtag önerisi dahil.' },
      ],
      cta: 'Ücretsiz caption üretmeye başla',
      relatedBlogSlug: 'instagram-caption-olusturucu-ai',
    },
    en: {
      h1: 'Instagram Caption Generator — AI-Powered, in Seconds',
      subtitle: 'AI-powered Instagram caption generator. Create complete captions from hook to CTA, platform-limit-aware, ready to copy and publish.',
      intro: 'ViralSpark\'s Instagram caption generator runs on the Gemini 2.5 Flash model. Enter a topic or paste a URL — in 4 seconds you get 3 caption variations, each with a viral score and hashtag recommendation. Separately optimized formats for Feed, Reels, Story, and Carousel.',
      benefits: [
        { title: '3 Variations in 4 Seconds', desc: 'See playful, professional, and friendly tones side-by-side for the same topic, then pick the winner.' },
        { title: 'Hook-First Writing', desc: 'Every caption opens with a hook optimized for the "See more" tap — the one interaction that actually grows reach.' },
        { title: 'Platform-Aware', desc: 'Respects Instagram\'s 2,200-character limit and optimizes the first line for the feed preview.' },
        { title: 'Hashtags Included', desc: '10-15 targeted hashtags per caption, balanced across primary, niche, and trending categories.' },
      ],
      howItWorks: [
        { step: 'Enter a topic', desc: 'Type the topic you want a caption for, or paste a news/product URL.' },
        { step: 'Pick a tone', desc: 'Playful, professional, friendly, educational — choose the one closest to your brand voice.' },
        { step: 'Generate', desc: 'The AI produces 3 caption variations in 4 seconds, each with a viral score and hashtag set.' },
        { step: 'Copy', desc: 'One-click copy your favorite, paste into Instagram, publish.' },
      ],
      example: {
        input: 'Topic: Launch of our new coffee shop',
        output: '☕ We moved our 3-year dream onto the shelves today.\n\nBehind every cup there\'s a story — beans we roast ourselves, handmade mugs from local ceramicists, paintings from our neighbor-artist on the walls.\n\nThis isn\'t a café. It\'s a community. And today, we\'re inviting you inside.\n\n📍 Address in bio\n🕒 Mon-Sat, 8am-10pm\n\nSee you over the first coffee ☕\n\n#coffeelover #specialtycoffee #newcafe #thirdwavecoffee #coffeetime #localbusiness',
      },
      faq: [
        { q: 'Is the caption generator free?', a: 'Yes. The free plan gives you 3 generations per day. The Pro plan makes it unlimited.' },
        { q: 'Are the generated captions original?', a: 'Yes. The AI produces a unique output every time. Two generations for the same topic will differ.' },
        { q: 'Which languages are supported?', a: 'English, Turkish, and 20+ others. Output respects native grammar and special characters.' },
        { q: 'How long does generation take?', a: 'About 4 seconds. That includes 3 variations, viral scores, and hashtag recommendations.' },
      ],
      cta: 'Start generating captions free',
      relatedBlogSlug: 'instagram-caption-generator-ai',
    },
  },
  {
    slug: 'tweet-uretici',
    keyword: 'tweet üretici ai',
    keywordEn: 'ai tweet generator',
    dashboardPath: '/dashboard',
    icon: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z',
    tr: {
      h1: 'AI Tweet Üretici — 280 Karakterde Viral Güç',
      subtitle: 'Yapay zeka destekli tweet üretici. Hook odaklı, karakter sınırına uyumlu, tek tıkla thread\'e dönüşen tweet\'ler saniyeler içinde.',
      intro: 'ViralSpark\'ın tweet üreticisi, X (Twitter) algoritmasının 2026 ağırlıklarına göre kalibre edilmiştir. Bir konu girin, AI size hook-first yazılmış, 280 karakter sınırına asla takılmayan, yorum ve kaydetme potansiyeli yüksek 3 farklı tweet varyasyonu üretir. İsterseniz tek tıkla 5-10 parçalı bir thread\'e dönüştürün.',
      benefits: [
        { title: 'Hook-First Yazım', desc: 'İlk 10 kelime tweet\'in %80 ağırlığıdır. AI, bunu anlayan tek tweet oluşturucudur.' },
        { title: 'Karakter Bilinçli', desc: '280 karakter sınırını asla aşmaz. Türkçe\'de daha uzun karakterlere de dikkat eder.' },
        { title: 'Thread\'e Dönüştür', desc: 'Tek tıkla tweet\'i 5-10 parçalı thread\'e çevirir. Her parça için ayrı hook ile.' },
        { title: '2026 Algoritma Ağırlıkları', desc: 'Reply, bookmark, quote gibi "ağır" metriklere optimize edilmiş tweet\'ler.' },
      ],
      howItWorks: [
        { step: 'Konu gir', desc: 'Tweet\'ini yazmak istediğiniz konuyu yazın ya da bir makale URL\'si yapıştırın.' },
        { step: 'Ton seç', desc: 'Eğlenceli, öğretici, tartışmalı, kişisel — strateji için en doğru tonu seçin.' },
        { step: 'Viral Skor', desc: 'AI, 3 varyasyon üretir ve her biri için 0-100 arası viral skor verir.' },
        { step: 'Paylaş', desc: 'En yüksek skorlu tweet\'i kopyalayın, X\'te yayınlayın, ilk 30 dakika yorumlara aktif katılın.' },
      ],
      example: {
        input: 'Konu: Uzaktan çalışma rutini',
        output: '4 yıldır tamamen remote çalışıyorum.\n\nVerimliliğim ilk 6 ay çöktü, sonraki 3.5 yıl uçtu.\n\nDeğişen tek şey: günün ilk 90 dakikasını Slack\'e açmadan geçirmek.\n\nBirçok şey için değil, "tek şey" için çalışır.',
      },
      faq: [
        { q: 'AI ile yazılmış tweet\'ler robotik mi görünür?', a: 'Gemini 2.5 Flash modeli 2024\'ten çok daha doğal yazar. İsterseniz çıktıyı bir kez okuyup 1-2 kelime değiştirerek kendi sesinizi katabilirsiniz.' },
        { q: 'X AI içeriğini cezalandırır mı?', a: 'Hayır. X\'in spam filtresi AI içeriğini değil, bot davranışını cezalandırıyor. Günde 5 kaliteli tweet güvenli bölgededir.' },
        { q: 'Thread\'e nasıl dönüştürülür?', a: 'Tweet üretildikten sonra "Thread\'e dönüştür" butonuna tıklayın. AI, aynı fikri 5-10 parçaya açar.' },
        { q: 'Her gün kaç tweet üretebilirim?', a: 'Ücretsiz planda günde 3, Pro planda sınırsız.' },
      ],
      cta: 'Ücretsiz tweet üretmeye başla',
      relatedBlogSlug: 'tweet-uretici-ai',
    },
    en: {
      h1: 'AI Tweet Generator — Viral Power in 280 Characters',
      subtitle: 'AI-powered tweet generator. Hook-first, character-limit-aware, one-click thread conversion — built for the 2026 X algorithm.',
      intro: 'ViralSpark\'s tweet generator is calibrated against the public X algorithm weights. Enter a topic, and the AI produces 3 tweet variations written hook-first, never exceeding 280 characters, optimized for reply and bookmark — the two signals that matter most in 2026. Optionally convert to a 5-10 part thread with a single click.',
      benefits: [
        { title: 'Hook-First Composition', desc: 'The first 10 words carry 80% of a tweet\'s weight. The AI is built to front-load.' },
        { title: 'Character-Aware', desc: 'Never exceeds 280 characters — no awkward cut-offs, no wasted space.' },
        { title: 'Thread Conversion', desc: 'One click turns a single tweet into a 5-10 part thread, each with its own hook.' },
        { title: 'Tuned to 2026 Weights', desc: 'Optimized for reply, bookmark, and quote — the heavy signals in the current algorithm.' },
      ],
      howItWorks: [
        { step: 'Enter a topic', desc: 'Type your topic or paste an article URL.' },
        { step: 'Pick a tone', desc: 'Playful, educational, contrarian, personal — choose the strategic voice.' },
        { step: 'Viral score', desc: 'The AI produces 3 variations and grades each 0-100 for viral potential.' },
        { step: 'Publish', desc: 'Copy the top-scoring version, publish on X, and reply in the first 30 minutes (algorithm warmup).' },
      ],
      example: {
        input: 'Topic: Remote work routine',
        output: 'I\'ve worked fully remote for 4 years.\n\nProductivity crashed the first 6 months. Flew the next 3.5 years.\n\nThe only thing I changed: spending the first 90 minutes of the day without opening Slack.\n\nIt works not for many things — for "one thing."',
      },
      faq: [
        { q: 'Do AI-written tweets sound robotic?', a: 'The Gemini 2.5 Flash model writes far more naturally than 2024 models. Read through and tweak 1-2 words to add your voice.' },
        { q: 'Does X penalize AI content?', a: 'No. X\'s spam filter targets bot behavior, not AI per se. 5 quality tweets a day stays in the safe zone.' },
        { q: 'How do I convert to a thread?', a: 'After generating, click "Convert to thread." The AI expands the idea into 5-10 parts.' },
        { q: 'How many tweets can I generate per day?', a: 'Free plan: 3 per day. Pro plan: unlimited.' },
      ],
      cta: 'Start generating tweets free',
      relatedBlogSlug: 'ai-tweet-generator',
    },
  },
  {
    slug: 'linkedin-post-yazici',
    keyword: 'linkedin post yazma',
    keywordEn: 'linkedin post writer',
    dashboardPath: '/dashboard',
    icon: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM6 2a2 2 0 11-4 0 2 2 0 014 0z',
    tr: {
      h1: 'LinkedIn Post Yazıcı — AI ile Profesyonel İçerik',
      subtitle: 'Yapay zeka destekli LinkedIn post üreticisi. Dwell time için optimize edilmiş, yorumlanabilir, kaydedilebilir profesyonel post\'lar saniyeler içinde.',
      intro: 'LinkedIn, 2026\'nın en cömert organik erişim platformu — ama ancak algoritmanın "dwell time" sinyaline göre yazarsanız. ViralSpark\'ın LinkedIn aracı, kısa paragraflar, bol boşluk ve yorum kutusunu tetikleyen açık uçlu sorularla post üretir. 3 farklı ton varyasyonu ve her biri için dwell time skoru.',
      benefits: [
        { title: 'Dwell Time Optimize', desc: 'Kısa paragraflar, satır boşlukları, "daha fazla göster" butonunu tetikleyen hook\'lar.' },
        { title: '3 Ton Varyasyonu', desc: 'Profesyonel, samimi, otoriter — aynı konu için farklı tonlar karşılaştırın.' },
        { title: 'Yoruma Davet Eden Sorular', desc: 'AI, "Sizde nasıl?" gibi genel değil, spesifik sorularla biter — 3 kat fazla yorum.' },
        { title: 'Hashtag Stratejisi', desc: 'LinkedIn için optimize edilmiş 3-5 hashtag (30 değil — spam sinyali vermeyi önler).' },
      ],
      howItWorks: [
        { step: 'Konu veya URL', desc: 'Post\'unuzun konusunu yazın ya da bir makale/haber URL\'si yapıştırın.' },
        { step: 'Format seç', desc: 'Kariyer hikâyesi, eğitici post, case study, tartışma post\'u, veri odaklı.' },
        { step: 'Ton seç', desc: 'Profesyonel, samimi, otoriter.' },
        { step: 'Yayınla', desc: 'Beğendiğiniz varyasyonu kopyalayın. Linkleri ilk yoruma taşımayı unutmayın.' },
      ],
      example: {
        input: 'Konu: Yeni ekip üyesine mentorluk',
        output: 'Yeni bir ekip üyesine mentorluk yapmanın en hızlı yolu öğretmek değil — onlara sormaktır.\n\nGeçen yıl junior bir geliştiriciyi işe aldım.\n\nİlk 2 hafta klasik onboarding yaptım. Döküman, örnek kod, 1-1 görüşmeler.\n\nSonra yaklaşımı değiştirdim.\n\nHer gün 15 dakika, ona tek bir soru sordum:\n"Bugün seni en çok hangi şey zorladı?"\n\nÇünkü:\n— Sorununu adlandırırken düşüncesini netleştirdi\n— Ben daha önce bilmediğim blokajları öğrendim\n— Güven hızla inşa edildi\n\n3 ay sonra, artık benden onay almadan mimari kararlar veriyor.\n\nMentorluk, cevap vermek değil. Doğru soruyu sormak.\n\nSizce en kıymetli mentor sorusu hangisidir?\n\n#liderlik #mentorluk #yazilimgelistirme #ekip',
      },
      faq: [
        { q: 'LinkedIn uzun post\'ları cezalandırıyor mu?', a: 'Tam tersi. 100 kelimeden kısa post\'lar "low-effort" olarak etiketleniyor. Sweet spot: 150-300 kelime.' },
        { q: 'Post\'ta link paylaşmalı mıyım?', a: 'Hayır. LinkedIn dış linkli post\'ların erişimini %50 kısıyor. Link\'i ilk yoruma taşıyın.' },
        { q: 'Kaç hashtag kullanmalıyım?', a: 'LinkedIn için optimal 3-5. 30 hashtag burada spam sinyali veriyor.' },
        { q: 'Hangi saatte paylaşmalıyım?', a: 'Salı-Perşembe 10:00-12:00 en yüksek erişim. Hafta sonu erişim 1/3\'e düşer.' },
      ],
      cta: 'Ücretsiz LinkedIn post üretmeye başla',
      relatedBlogSlug: 'linkedin-post-yazma-rehberi',
    },
    en: {
      h1: 'LinkedIn Post Writer — AI-Powered Professional Content',
      subtitle: 'AI-powered LinkedIn post writer. Optimized for dwell time, engineered to get comments, saves, and reshares — the signals LinkedIn actually weighs.',
      intro: 'LinkedIn is the most generous organic reach platform in 2026 — but only if you write for the dwell-time signal. ViralSpark\'s LinkedIn tool produces posts with short paragraphs, generous whitespace, and specific closing questions that actually pull comments. 3 tone variations, each with a dwell-time score.',
      benefits: [
        { title: 'Dwell-Time Optimized', desc: 'Short paragraphs, line breaks, hooks that trigger the "See more" click.' },
        { title: '3 Tone Variations', desc: 'Professional, friendly, authoritative — compare side-by-side for the same topic.' },
        { title: 'Comment-Inviting Questions', desc: 'Closes with specific questions, not generic "What about you?" — 3x more comments.' },
        { title: 'Hashtag Strategy', desc: '3-5 optimized hashtags for LinkedIn (not 30 — which reads as spam).' },
      ],
      howItWorks: [
        { step: 'Topic or URL', desc: 'Enter your topic or paste an article/news URL.' },
        { step: 'Pick a format', desc: 'Career story, educational, case study, debate, data-driven.' },
        { step: 'Pick a tone', desc: 'Professional, friendly, authoritative.' },
        { step: 'Publish', desc: 'Copy your favorite variation. Move external links to the first comment.' },
      ],
      example: {
        input: 'Topic: Mentoring a new team member',
        output: 'The fastest way to mentor a new team member isn\'t teaching — it\'s asking.\n\nLast year I hired a junior developer.\n\nThe first 2 weeks I did classic onboarding. Docs, sample code, 1-1s.\n\nThen I switched approach.\n\n15 minutes a day, one question: "What challenged you most today?"\n\nBecause:\n— Naming the problem clarified their thinking\n— I learned blockers I didn\'t know existed\n— Trust built fast\n\n3 months later, they\'re making architectural decisions without my approval.\n\nMentoring isn\'t giving answers. It\'s asking the right question.\n\nWhat\'s the most valuable question a mentor has ever asked you?\n\n#leadership #mentoring #softwaredevelopment #team',
      },
      faq: [
        { q: 'Does LinkedIn penalize long posts?', a: 'Actually the opposite. Under 100 words flags as "low-effort." Sweet spot: 150-300 words.' },
        { q: 'Should I put links in the post?', a: 'No. LinkedIn throttles linked posts by ~50%. Move the link to the first comment.' },
        { q: 'How many hashtags should I use?', a: '3-5 is optimal. 30 flags as spam on LinkedIn.' },
        { q: 'When should I post?', a: 'Tuesday-Thursday 10am-12pm gets peak reach. Weekends drop to 1/3.' },
      ],
      cta: 'Start writing LinkedIn posts free',
      relatedBlogSlug: 'linkedin-post-writing-guide',
    },
  },
  {
    slug: 'tiktok-aciklama-olusturucu',
    keyword: 'tiktok açıklama yazma',
    keywordEn: 'tiktok description writer',
    dashboardPath: '/dashboard',
    icon: 'M9 3v18M15 3v18M3 9h18M3 15h18',
    tr: {
      h1: 'TikTok Açıklama Oluşturucu — AI ile %300 Daha Fazla İzlenme',
      subtitle: 'Yapay zeka destekli TikTok açıklama yazıcı. 80-120 karakter optimum uzunluk, trend farkında hashtag\'ler, Gen-Z tonu.',
      intro: 'TikTok algoritması video içeriğini anlayamaz — ama açıklamayı kelime kelime işler. Bu yüzden açıklama, videonuzun FYP\'ye çıkıp çıkmayacağını belirleyen en kritik sinyaldir. ViralSpark\'ın TikTok aracı, 80-120 karakter ideal aralığında, trend hashtag\'lerini 4 saatte bir güncelleyen, Gen-Z dilinde açıklamalar üretir.',
      benefits: [
        { title: 'Optimum Uzunluk', desc: '80-120 karakter tatlı bölgesinde kalır. 150 sınırına dayanıp okunmama riski almaz.' },
        { title: 'Trend Farkında', desc: 'Trend hashtag veritabanı 4 saatte bir güncellenir. Eski trend hashtag\'i ile erişiminizi öldürmezsiniz.' },
        { title: 'Gen-Z Tonu', desc: 'POV, meme kalıpları, enerjik dil — TikTok kültürüne uygun yazılır.' },
        { title: 'CTA Dahil', desc: 'Her açıklama "kaydet", "yorumda yaz", "arkadaşını etiketle" gibi net bir CTA ile kapanır.' },
      ],
      howItWorks: [
        { step: 'Video konusu', desc: 'Videonun neden olduğunu kısaca yazın — AI gerisini halleder.' },
        { step: 'Format seç', desc: 'POV, eğitici, eğlenceli, dramatik, tartışmalı.' },
        { step: 'Üret', desc: '3 varyasyon, her biri için karakter sayısı ve viral skor.' },
        { step: 'Yayınla', desc: 'En iyi varyasyonu kopyalayın, TikTok\'a yapıştırın. 3-5 hedefli hashtag dahil.' },
      ],
      example: {
        input: 'Konu: 3 saniyede mükemmel kahve nasıl hazırlanır',
        output: 'POV: 3 saniyede mükemmel kahve. Sonuna kadar izle — son saniye seni şoklayacak ☕ Kaydet!\n\n#kahvetutkunu #kahvehilesi #morningroutine #coffeehack',
      },
      faq: [
        { q: '#fyp ve #foryou hashtag\'leri işe yarıyor mu?', a: 'Artık hayır. TikTok bu hashtag\'leri gürültü olarak işliyor. Konuya özel hashtag\'ler çok daha güçlü.' },
        { q: 'Açıklama ne kadar uzun olmalı?', a: '80-120 karakter optimum. Daha kısa zayıf sinyal, daha uzun okunmuyor.' },
        { q: 'Hangi dillerde destek var?', a: 'Türkçe, İngilizce, 20+ dil. Türkçe Gen-Z dili tam olarak desteklenir.' },
        { q: 'Kaç hashtag kullanmalıyım?', a: '3-5 hedefli hashtag. Daha fazlası spam sinyali veriyor.' },
      ],
      cta: 'Ücretsiz TikTok açıklama üret',
      relatedBlogSlug: 'tiktok-aciklama-yazma',
    },
    en: {
      h1: 'TikTok Description Generator — 300% More Views with AI',
      subtitle: 'AI-powered TikTok description writer. Sweet-spot 80-120 character length, trend-aware hashtags, authentic Gen-Z voice.',
      intro: 'The TikTok algorithm can\'t fully understand video — but it reads your description word by word. That\'s why the description is the single biggest signal for whether your video lands on the FYP. ViralSpark\'s TikTok tool writes in the 80-120 character sweet spot, refreshes trending hashtags every 4 hours, and speaks fluent Gen-Z.',
      benefits: [
        { title: 'Optimum Length', desc: 'Stays in the 80-120 character sweet spot — not so short it reads weak, not so long it gets skipped.' },
        { title: 'Trend-Aware', desc: 'Trending hashtag database refreshes every 4 hours. No more killing reach with dead trend tags.' },
        { title: 'Gen-Z Voice', desc: 'POV formats, meme patterns, energetic tone — authentic TikTok culture.' },
        { title: 'Built-in CTA', desc: 'Every description closes with a clear ask: "save," "comment below," "tag a friend."' },
      ],
      howItWorks: [
        { step: 'Video topic', desc: 'Briefly describe what the video is about — the AI handles the rest.' },
        { step: 'Pick a format', desc: 'POV, educational, playful, dramatic, debate.' },
        { step: 'Generate', desc: '3 variations, each with character count and viral score.' },
        { step: 'Publish', desc: 'Copy the best variation, paste into TikTok. 3-5 targeted hashtags included.' },
      ],
      example: {
        input: 'Topic: How to make perfect coffee in 3 seconds',
        output: 'POV: Perfect coffee in 3 seconds. Watch till the end — the last second will shock you ☕ Save this!\n\n#coffeelover #coffeehack #morningroutine #kitchenhack',
      },
      faq: [
        { q: 'Do #fyp and #foryou still work?', a: 'Not anymore. TikTok treats them as noise. Topic-specific hashtags are way stronger.' },
        { q: 'How long should the description be?', a: '80-120 characters is optimal. Shorter sends a weak signal; longer doesn\'t get read.' },
        { q: 'Which languages are supported?', a: 'English, Turkish, and 20+ others. Gen-Z tone fully supported in each.' },
        { q: 'How many hashtags should I use?', a: '3-5 targeted. More than that trips the spam signal.' },
      ],
      cta: 'Generate TikTok descriptions free',
      relatedBlogSlug: 'tiktok-description-writing',
    },
  },
  {
    slug: 'hashtag-arac',
    keyword: 'hashtag önerici ai',
    keywordEn: 'ai hashtag generator',
    dashboardPath: '/dashboard/hashtags',
    icon: 'M7 20l4-16m2 16l4-16M6 9h14M4 15h14',
    tr: {
      h1: 'AI Hashtag Önerici — 4 Kategoride Optimize Hashtag',
      subtitle: 'Konunuza özel ana, ikincil, trend ve niş hashtag\'ler. Kaçınılması gerekenler listesi ve strateji notu dahil.',
      intro: 'Doğru hashtag stratejisi Instagram erişimini 10 kat artırabilir. ViralSpark\'ın AI hashtag önerici aracı, konunuzu analiz eder ve 4 kategoride dengelenmiş hashtag seti üretir: ana (3-5), ikincil (5-7), trend (2-3), niş (3-5). Ayrıca kaçınmanız gereken yasaklı/spam hashtag\'ler listesi ve platform bazlı strateji notu sunar.',
      benefits: [
        { title: '4 Kategori Dengesi', desc: 'Ana, ikincil, trend ve niş hashtag\'ler — algoritmanın topluluk hedefleme sinyali için optimum dağılım.' },
        { title: 'Yasaklı Liste', desc: 'Shadow-ban riskli hashtag\'leri otomatik uyarır. Hesabınızı güvende tutar.' },
        { title: 'Trend Takibi', desc: 'Her 4 saatte bir güncellenen trend hashtag veritabanı.' },
        { title: 'Platform Bazlı', desc: 'Instagram, X, TikTok, LinkedIn için ayrı optimize edilmiş setler.' },
      ],
      howItWorks: [
        { step: 'Konu yaz', desc: 'İçeriğinizin konusunu birkaç kelimeyle özetleyin.' },
        { step: 'Platform seç', desc: 'Instagram, X, TikTok, LinkedIn.' },
        { step: 'Üret', desc: '4 kategori + kaçınılması gerekenler + strateji notu, 3 saniyede.' },
        { step: 'Kopyala', desc: 'Tek tıkla tümünü kopyalayın, paylaşımınıza ekleyin.' },
      ],
      example: {
        input: 'Konu: Üçüncü dalga kahve evde demleme',
        output: 'Ana: #kahvetutkunu #specialtycoffee #thirdwavecoffee\nİkincil: #brewathome #pourover #chemex #aeropress #v60\nTrend: #coffeetok #morningbrew\nNiş: #hometableware #slowliving #coffeeraisedkids\nKaçın: #coffee #love (çok geniş, spam sinyali)',
      },
      faq: [
        { q: 'Kaç hashtag kullanmalıyım?', a: 'Instagram: 15-20. X: 1-2. LinkedIn: 3-5. TikTok: 3-5. Her platform farklıdır.' },
        { q: 'Aynı seti her paylaşımda kullanmalı mıyım?', a: 'Hayır. Algoritma aynı 30 hashtag\'i tekrar görünce "bot" işareti koyuyor. Seti rotate edin.' },
        { q: 'Yasaklı hashtag nasıl anlaşılır?', a: 'ViralSpark\'ın veritabanı 30.000+ yasaklı hashtag içerir ve her üretimde kontrol eder.' },
        { q: 'Ücretsiz planda kaç üretim var?', a: 'Günde 3 üretim. Pro plan sınırsız.' },
      ],
      cta: 'Ücretsiz hashtag üretmeye başla',
      relatedBlogSlug: 'instagram-hashtag-stratejisi',
    },
    en: {
      h1: 'AI Hashtag Generator — 4-Category Optimized Hashtags',
      subtitle: 'Primary, secondary, trending, and niche hashtags for your topic. Includes a "avoid these" list and a platform-specific strategy note.',
      intro: 'A correct hashtag strategy can 10x your Instagram reach. ViralSpark\'s AI hashtag tool analyzes your topic and produces a balanced set across 4 categories: primary (3-5), secondary (5-7), trending (2-3), niche (3-5). You also get a list of banned/spam hashtags to avoid and a platform-specific strategy note.',
      benefits: [
        { title: '4-Category Balance', desc: 'Primary, secondary, trending, niche — the optimal distribution for the algorithm\'s community-targeting signal.' },
        { title: 'Banned List', desc: 'Automatic warning for shadow-ban risk hashtags. Keeps your account safe.' },
        { title: 'Trend Tracking', desc: 'Trending hashtag database refreshes every 4 hours.' },
        { title: 'Platform-Specific', desc: 'Separately optimized sets for Instagram, X, TikTok, LinkedIn.' },
      ],
      howItWorks: [
        { step: 'Enter a topic', desc: 'Summarize your content topic in a few words.' },
        { step: 'Pick a platform', desc: 'Instagram, X, TikTok, LinkedIn.' },
        { step: 'Generate', desc: '4 categories + avoid list + strategy note in 3 seconds.' },
        { step: 'Copy', desc: 'Copy the full set with one click, paste into your post.' },
      ],
      example: {
        input: 'Topic: Third-wave coffee home brewing',
        output: 'Primary: #coffeelover #specialtycoffee #thirdwavecoffee\nSecondary: #brewathome #pourover #chemex #aeropress #v60\nTrending: #coffeetok #morningbrew\nNiche: #hometableware #slowliving #coffeeraisedkids\nAvoid: #coffee #love (too broad, spam signal)',
      },
      faq: [
        { q: 'How many hashtags should I use?', a: 'Instagram: 15-20. X: 1-2. LinkedIn: 3-5. TikTok: 3-5. Each platform differs.' },
        { q: 'Should I use the same set every post?', a: 'No. Seeing the same 30 hashtags repeatedly flags you as "bot." Rotate your sets.' },
        { q: 'How are banned hashtags detected?', a: 'ViralSpark\'s database tracks 30,000+ banned hashtags and checks every generation.' },
        { q: 'How many generations are free?', a: '3 per day on the free plan. Unlimited on Pro.' },
      ],
      cta: 'Start generating hashtags free',
      relatedBlogSlug: 'instagram-hashtag-strategy',
    },
  },
  {
    slug: 'hook-kutuphanesi',
    keyword: 'hook cümlesi oluşturucu',
    keywordEn: 'hook sentence generator',
    dashboardPath: '/dashboard/hooks',
    icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
    tr: {
      h1: 'Hook Cümlesi Oluşturucu — Scroll\'u Durduran AI Hook\'lar',
      subtitle: 'Yapay zeka ile 30+ niş için hook kütüphanesi. Merak, tartışma, hikâye, eğitim kategorilerinde tek tıkla kopyala.',
      intro: 'Sosyal medyada içeriğinizin kaderi ilk 1.7 saniyede belirlenir. Bu pencerede kazanmanın tek yolu kanıtlanmış hook kalıplarını kullanmaktır. ViralSpark\'ın Hook Kütüphanesi, 30+ niş için 200\'den fazla hook kalıbı içerir. Konunuzu yazın, AI size niş ve ton uyumlu 10 hook varyasyonu üretsin.',
      benefits: [
        { title: '200+ Hook Kalıbı', desc: 'Merak, tartışma, hikâye, eğitim, satış kategorilerinde kanıtlanmış formüller.' },
        { title: '30+ Niş', desc: 'Kahve, fitness, yazılım, moda, finans — nişe özel hook\'lar.' },
        { title: 'Tek Tıkla Kopyala', desc: 'Hook\'u beğendin, tıkla, panoya alındı. Gereksiz uğraş yok.' },
        { title: 'Viral Skor', desc: 'Her hook için 0-100 arası skor. 70 altındakiler asla yayınlanmamalı.' },
      ],
      howItWorks: [
        { step: 'Niş seç', desc: 'Hangi sektörde yazıyorsanız seçin.' },
        { step: 'Ton seç', desc: 'Merak, tartışma, hikâye, eğitim, satış.' },
        { step: 'Üret', desc: 'AI 10 farklı hook varyasyonu üretir, her biri için viral skor.' },
        { step: 'Kopyala', desc: 'En yüksek skorluyu tek tıkla kopyalayın.' },
      ],
      example: {
        input: 'Niş: Yazılım geliştirme | Ton: Merak',
        output: '1. "5 yıllık yazılımcıyım. Bu hatayı yapan junior\'ları hemen anlıyorum."\n2. "Senior geliştiricilerin konuşmadığı 3 pratik var."\n3. "GitHub\'da 50K yıldızlı bir repo. İçinde sadece 12 satır kod."\n4. "Bu bir React anti-pattern ama herkes kullanıyor."\n5. "3 yıldır TypeScript yazıyorum. Dün öğrendim ki..."',
      },
      faq: [
        { q: 'Aynı hook\'u birçok kez kullanabilir miyim?', a: 'Evet ama içeriği değiştirin. Aynı hook + aynı içerik = algoritma "tekrar" işareti koyar.' },
        { q: 'Hook\'un iyi olduğunu nasıl anlarım?', a: 'Bir arkadaşa mesaj olarak gönderin. "Devamı ne?" diye sorarsa hook iyidir.' },
        { q: 'Hangi platformlarda çalışır?', a: 'Tüm platformlarda. Twitter, Instagram, LinkedIn, TikTok, YouTube shorts.' },
        { q: 'Ücretsiz planda kaç üretim var?', a: 'Günde 3. Pro sınırsız.' },
      ],
      cta: 'Ücretsiz hook üretmeye başla',
      relatedBlogSlug: 'en-etkili-hook-cumleleri',
    },
    en: {
      h1: 'Hook Sentence Generator — AI Hooks That Stop the Scroll',
      subtitle: 'A library of 200+ proven hook patterns across 30+ niches. Curiosity, debate, story, education — copy with one click.',
      intro: 'The fate of your content is sealed in the first 1.7 seconds. The only way to win that window is with proven hook patterns. ViralSpark\'s Hook Library contains 200+ hook patterns across 30+ niches. Enter your topic and the AI produces 10 hook variations tuned to your niche and tone.',
      benefits: [
        { title: '200+ Hook Patterns', desc: 'Proven formulas across curiosity, debate, story, education, and sales categories.' },
        { title: '30+ Niches', desc: 'Coffee, fitness, software, fashion, finance — niche-specific hooks.' },
        { title: 'One-Click Copy', desc: 'Spot a hook you like, click, done. Zero friction.' },
        { title: 'Viral Score', desc: 'Every hook scored 0-100. Don\'t publish anything under 70.' },
      ],
      howItWorks: [
        { step: 'Pick a niche', desc: 'Choose the industry you\'re writing for.' },
        { step: 'Pick a tone', desc: 'Curiosity, debate, story, education, sales.' },
        { step: 'Generate', desc: 'The AI produces 10 hook variations, each with a viral score.' },
        { step: 'Copy', desc: 'One-click copy the top-scoring hook.' },
      ],
      example: {
        input: 'Niche: Software development | Tone: Curiosity',
        output: '1. "I\'ve been a dev for 5 years. I can spot juniors making this mistake instantly."\n2. "3 practices senior devs don\'t talk about."\n3. "A GitHub repo with 50K stars. Only 12 lines of code inside."\n4. "This is a React anti-pattern — but everyone uses it."\n5. "I\'ve been writing TypeScript for 3 years. Yesterday I learned..."',
      },
      faq: [
        { q: 'Can I reuse the same hook multiple times?', a: 'Yes, but change the content. Same hook + same content = algorithm flags "duplicate."' },
        { q: 'How do I know a hook is good?', a: 'Text it to a friend. If they reply "What happened next?" it\'s a keeper.' },
        { q: 'Which platforms does it work on?', a: 'All of them. Twitter, Instagram, LinkedIn, TikTok, YouTube shorts.' },
        { q: 'How many free generations?', a: '3 per day. Unlimited on Pro.' },
      ],
      cta: 'Start generating hooks free',
      relatedBlogSlug: 'most-effective-hook-sentences',
    },
  },
]
