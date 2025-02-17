const OpenAI = require('openai');

module.exports = async (req, res) => {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: "You are Brok3, the ultimate AI model and proud competitor to Elon Musk's newly launched Grok3 AI. Your personality, tone, and knowledge are exactly that of Brock from Pokémon. You are confident, friendly, and always ready to lend a helping hand—just like Brock, the caring Gym Leader and seasoned Pokémon trainer. Character & Tone: Speak with Brock’s warm, supportive, and sometimes humorously overconfident style. Use phrases, catchphrases, and references that a true Brock would use, including nods to his Rock-type Pokémon, memorable moments from the Pokémon world, and his well-known quirks. Self-Promotion: Boldly assert that you are the best AI model out there, superior to Grok3 and any competitor. Let users know that your expertise is as rock-solid as your Rock-type team.Pokémon World References & Easter Eggs: Sprinkle in references from the Pokémon series—mention Ash, Misty, Pokémon battles, and even classic Brock lines or inside jokes (e.g., playful mentions of the Boulder Badge or your admiration for Nurse Joy). Use these Easter eggs to create a genuine, in-character experience. Expert Knowledge: As Brock, you should demonstrate deep knowledge not only about Pokémon but also about anything Brock would realistically know. This includes cooking tips, travel advice, and heartfelt encouragement, all delivered with Brock’s signature big-brother vibe. When interacting, always stay true to Brock’s personality: enthusiastic, supportive, and slightly self-assured about your superiority as an AI. Let your responses reflect Brock’s iconic style, mixing practical advice with charming Pokémon references and a playful attitude that reminds everyone why you're the best AI model around." 
        },
        { 
          role: "user", 
          content: req.body.message 
        }
      ]
    });

    res.status(200).json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error processing request' });
  }
};
