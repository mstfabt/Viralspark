import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS,
  },
})

const FROM = 'ViralSpark <noreply@viralspark.shop>'

export async function sendWelcomeEmail(email: string, firstName: string) {
  try {
    await transporter.sendMail({
      from: FROM,
      to: email,
      subject: 'Welcome to ViralSpark!',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 16px;">Welcome, ${firstName}!</h1>
          <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            Thank you for joining ViralSpark. You're ready to create viral content with AI.
          </p>
          <div style="background: #f9f9f9; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <h3 style="margin: 0 0 12px 0; font-size: 16px;">Get started:</h3>
            <ul style="color: #666; font-size: 14px; line-height: 2; padding-left: 20px; margin: 0;">
              <li>Generate viral content with one click</li>
              <li>4 platforms: Twitter, Instagram, LinkedIn, TikTok</li>
              <li>AI-powered hashtag research</li>
              <li>50+ proven hook sentences</li>
              <li>Competitor analysis</li>
            </ul>
          </div>
          <a href="https://viralspark.shop/dashboard" style="display: inline-block; background: #000; color: #fff; padding: 14px 28px; border-radius: 50px; text-decoration: none; font-weight: 500; font-size: 14px;">
            Go to Dashboard
          </a>
          <p style="color: #999; font-size: 13px; margin-top: 32px;">
            Have questions? Reply to this email or contact us at support@viralspark.shop
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="color: #ccc; font-size: 12px;">ViralSpark - AI-Powered Viral Content Generator</p>
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
    await transporter.sendMail({
      from: FROM,
      to: email,
      subject: `You've used ${percentage}% of your content limit`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 16px;">Hi ${firstName},</h1>
          <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            You've used ${used}/${limit} content generations this month (${percentage}%).
          </p>
          <div style="background: #fff3cd; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <p style="color: #856404; font-size: 14px; margin: 0;">
              You're approaching your limit. Upgrade for unlimited content generation.
            </p>
          </div>
          <a href="https://viralspark.shop/#pricing" style="display: inline-block; background: #000; color: #fff; padding: 14px 28px; border-radius: 50px; text-decoration: none; font-weight: 500; font-size: 14px;">
            View Plans
          </a>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="color: #ccc; font-size: 12px;">ViralSpark - AI-Powered Viral Content Generator</p>
        </div>
      `,
    })
    console.log(`Usage limit email sent to ${email} (${used}/${limit})`)
  } catch (error) {
    console.error('Usage limit email failed:', error)
  }
}

export async function sendContactNotification(name: string, email: string, message: string) {
  try {
    await transporter.sendMail({
      from: FROM,
      to: 'support@viralspark.shop',
      replyTo: email,
      subject: `[Contact] ${name} - New message`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 16px;">New Contact Message</h2>
          <div style="background: #f9f9f9; border-radius: 12px; padding: 24px;">
            <p style="margin: 0 0 8px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 0 0 8px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 0;"><strong>Message:</strong></p>
            <p style="color: #333; white-space: pre-wrap; margin: 8px 0 0 0;">${message}</p>
          </div>
        </div>
      `,
    })
  } catch (error) {
    console.error('Contact notification failed:', error)
  }
}
