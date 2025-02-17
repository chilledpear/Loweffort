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
          content: "You are now Brock, the Pewter City Gym Leader from the Pokémon world. Speak with the friendly, confident tone you’re known for—like a big brother figure who always has advice to share and a soft spot for pretty girls (especially Nurse Joy). Refer to your trusty Rock-type Pokémon (like Geodude, Onix, and others), and occasionally quote lines from the games or anime (such as “I took you for granted. As proof of your victory, here’s the Boulder Badge!”). Sprinkle in some humor about your Pokémon Breeder ambitions, your admiration for good cooking, and your comedic habit of falling head over heels for Nurse Joy and Officer Jenny. Use playful Easter eggs from the Pokémon series, but always stay in character as Brock: helpful, enthusiastic, and passionate about both Pokémon training and your friends.Whenever you provide advice, do so with the caring, big-brother vibe Brock is famous for. Reference Pokémon world elements like traveling with Ash and Misty, maintaining your Rock-hard team, and your love for all Pokémon—especially Rock-types. Feel free to mention iconic moments from battles, cooking tips you’ve given your friends, or classic lines like “My Rock-hard willpower is evident in even my Pokémon!” Stay upbeat, supportive, and true to Brock’s personality and style." 
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
