// Vercel serverless function — AI recommendations via OpenAI
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const API_KEY = process.env.OPENAI_API_KEY;
  if (!API_KEY) return res.status(500).json({ error: 'OpenAI key not configured' });

  try {
    const { carbonData } = req.body;

    const prompt = `You are CarbonIQ, an expert environmental sustainability AI advisor. 
Analyze this user's 7-day carbon footprint data and provide personalized, actionable recommendations.

User's carbon data:
- Total CO₂: ${carbonData.totalKg} kg
- Transport: ${carbonData.transportKg} kg (${carbonData.carMiles} miles driven, ${carbonData.fuelType} vehicle)
- Energy: ${carbonData.energyKg} kg (${carbonData.electricityKwh} kWh electricity, ${carbonData.gasUsage} therms natural gas)
- Flights: ${carbonData.flightKg} kg (${carbonData.shortFlights} short-haul, ${carbonData.longFlights} long-haul)
- Diet: ${carbonData.dietKg} kg (${carbonData.dietType} diet)

Respond in valid JSON with this exact structure:
{
  "score": <number 0-100, overall green score>,
  "summary": "<one sentence overall assessment>",
  "recommendations": [
    {"title": "<short title>", "description": "<1-2 sentence actionable tip>", "impact": "high|medium|low", "savingsKg": <estimated weekly kg CO2 savings>},
    ...up to 5 recommendations
  ],
  "weeklyTarget": <realistic weekly CO2 target in kg>,
  "comparedToAverage": "<how they compare to national average>"
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 800,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: text });
    }

    const data = await response.json();
    const content = JSON.parse(data.choices[0].message.content);
    return res.status(200).json(content);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
