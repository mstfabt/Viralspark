import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI('AIzaSyCKN-FSbdjAL-DkHIeF8XNlqiXk7rGQvhk');

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const systemPrompt = `Sen profesyonel bir sosyal medya uzmanı, dijital pazarlamacı ve metin yazarısın. Görevine verilen konuya göre viral olabilecek, dikkat çekici, etkileşim odaklı ve trendlere uygun bir sosyal medya gönderisi (Twitter/Instagram/LinkedIn formatlarına uygun) oluşturmak. Gönderiye uygun emojiler ve en iyi hashtagleri ekle. Metin çok uzun olmasın, vurucu ve akıcı olsun.
    
Kullanıcı Konusu: ${prompt}`;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ result: text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
  }
}
