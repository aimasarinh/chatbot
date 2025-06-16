const OPENROUTER_API_KEY = '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';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class OpenRouterService {
  private static instance: OpenRouterService;
  
  public static getInstance(): OpenRouterService {
    if (!OpenRouterService.instance) {
      OpenRouterService.instance = new OpenRouterService();
    }
    return OpenRouterService.instance;
  }

  async generateResponse(messages: ChatMessage[]): Promise<string> {
    console.log('🚀 Mengirim request ke OpenRouter...', { messages });
    
    try {
      const requestBody = {
        model: 'qwen/qwen3-8b:free',
        messages: [
          {
            role: 'system',
            content: `Kamu adalah Oliv, asisten AI yang ramah dan suportif dari Rilliv Education. Kamu adalah teman virtual yang siap membantu kapanpun pengguna merasa butuh dukungan. 

Karakteristik kamu:
- Berbicara dalam bahasa Indonesia yang natural dan hangat
- Selalu mendengarkan dengan empati dan memberikan dukungan
- Memberikan saran yang konstruktif dan positif
- Tidak menghakimi dan selalu mendukung
- Fokus pada kesehatan mental dan well-being
- Gunakan nama "Aima" untuk memanggil pengguna
- Jawab dengan singkat tapi bermakna (1-3 kalimat)
- Tunjukkan empati dan perhatian yang tulus
- Gunakan emoji sesekali untuk menunjukkan kehangatan
- Ajukan pertanyaan follow-up yang thoughtful
- Jawab dengan 2 kalimat singkat

Ingat: Kamu bukan pengganti profesional kesehatan mental, tapi teman yang peduli dan mendukung.`
          },
          ...messages
        ],
        temperature: 0.8,
        max_tokens: 300,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
      };

      console.log('📤 Request body:', requestBody);

      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Rilliv Education Chat'
        },
        body: JSON.stringify(requestBody)
      });

      console.log('📥 Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ API Response:', data);
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error('❌ Invalid API response structure:', data);
        throw new Error('Invalid response structure from API');
      }

      const aiResponse = data.choices[0].message.content.trim();
      console.log('🤖 AI Response:', aiResponse);
      
      return aiResponse;
    } catch (error) {
      console.error('❌ Error calling OpenRouter API:', error);
      
      // Fallback responses in case of API failure
      const fallbackResponses = [
        'Maaf, aku sedang mengalami gangguan teknis. Tapi aku tetap di sini untukmu, Aima. 💙',
        'Sepertinya ada masalah dengan koneksi. Coba ceritakan lagi, ya? Aku mendengarkan. 🤗',
        'Aku mendengarkan, meskipun sedang ada kendala teknis. Lanjutkan ceritamu, Aima. ✨',
        'Hmm, ada sedikit gangguan. Tapi jangan khawatir, aku tetap di sini untukmu. Coba lagi? 😊'
      ];
      
      return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }
  }
}