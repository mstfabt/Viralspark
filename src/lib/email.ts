import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = 'ViralSpark <onboarding@resend.dev>'

export async function sendWelcomeEmail(email: string, firstName: string) {
  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: 'ViralSpark\'a Hosgeldiniz!',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 16px;">Hosgeldiniz, ${firstName}!</h1>
          <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            ViralSpark'a katildiginiz icin tesekkurler. Yapay zeka ile viral icerikler uretmeye hazirsiniz.
          </p>
          <div style="background: #f9f9f9; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <h3 style="margin: 0 0 12px 0; font-size: 16px;">Hemen baslayabilirsiniz:</h3>
            <ul style="color: #666; font-size: 14px; line-height: 2; padding-left: 20px; margin: 0;">
              <li>Tek tikla viral icerik uretin</li>
              <li>4 platforma ozel icerik (Twitter, Instagram, LinkedIn, TikTok)</li>
              <li>AI destekli hashtag arastirma</li>
              <li>50+ kanitlanmis hook cumlesi</li>
              <li>Rakip analizi ile stratejinizi guclenirin</li>
            </ul>
          </div>
          <a href="https://viralspark.vercel.app/dashboard" style="display: inline-block; background: #000; color: #fff; padding: 14px 28px; border-radius: 50px; text-decoration: none; font-weight: 500; font-size: 14px;">
            Dashboard'a Git
          </a>
          <p style="color: #999; font-size: 13px; margin-top: 32px;">
            Sorulariniz mi var? Bu e-postaya yanit vererek bize ulasabilirsiniz.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="color: #ccc; font-size: 12px;">ViralSpark - Yapay Zeka ile Viral Icerik Uretin</p>
        </div>
      `,
    })
    console.log(`Welcome email sent to ${email}`)
  } catch (error) {
    console.error('Welcome email failed:', error)
  }
}

export async function sendUsageLimitEmail(email: string, firstName: string, used: number, limit: number) {
  try {
    const percentage = Math.round((used / limit) * 100)
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: `Kullanim limitinizin %${percentage}'ine ulastiniz`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 16px;">Merhaba ${firstName},</h1>
          <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            Bu ay ${used}/${limit} icerik uretim hakkininizi kullandiniz (%${percentage}).
          </p>
          <div style="background: #fff3cd; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <p style="color: #856404; font-size: 14px; margin: 0;">
              Limitinize yaklasiyorsunuz. Sinirsiz uretim icin planainizi yukseltebilirsiniz.
            </p>
          </div>
          <a href="https://viralspark.vercel.app/#pricing" style="display: inline-block; background: #000; color: #fff; padding: 14px 28px; border-radius: 50px; text-decoration: none; font-weight: 500; font-size: 14px;">
            Planlari Incele
          </a>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="color: #ccc; font-size: 12px;">ViralSpark - Yapay Zeka ile Viral Icerik Uretin</p>
        </div>
      `,
    })
    console.log(`Usage limit email sent to ${email} (${used}/${limit})`)
  } catch (error) {
    console.error('Usage limit email failed:', error)
  }
}
