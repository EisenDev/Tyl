const FALLBACK = {
    verse: {
        text: 'Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonor others, it is not self-seeking, it is not easily angered, it keeps no record of wrongs.',
        reference: '1 Corinthians 13:4–5',
    },
    quote: 'The best thing to hold onto in life is each other. — Audrey Hepburn',
    _isFallback: true,
}

export default async function handler(req, res) {
    // Allow CORS for local dev
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
    if (req.method === 'OPTIONS') return res.status(200).end()

    const date = req.query?.date
    if (!date) return res.status(400).json({ error: 'date query param required' })

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) return res.status(200).json(FALLBACK)

    // ONLY USE gemini-2.5-flash AS REQUESTED
    const modelName = 'gemini-2.5-flash'

    const prompt = `Today's date is ${date}. You are creating a unique, deeply personalized daily devotional for a couple in love: Eisen and Peinshiii.
    Eisen is the sender, Peinshiii is the recipient. 

    STRICT RULES:
    1. NEVER repeat a devotion or scripture unless exactly one year has passed since it was last used.
    2. THEMES TO CYCLE: Love, Gratefulness, Growth, Forgiveness, Devotion, Trust, Future, Resilience, Patience, Faithfulness.
    3. BE FRESH: Each day must feel like a brand-new discovery. If there is even a 1% chance it was used recently, pick something completely different.
    4. SCRIPTURE: Pick ONE Bible verse that fits the day's mood perfectly.
    5. QUOTE: ONE unique, heartfelt quote (1-2 sentences) about their bond.

    Respond ONLY with valid JSON: {"verse":{"text":"...","reference":"..."},"quote":"..."}`

    try {
        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 1.0,
                    maxOutputTokens: 600,
                    responseMimeType: 'application/json'
                }
            })
        })

        if (!geminiRes.ok) {
            const errTxt = await geminiRes.text()
            console.error(`Gemini [${modelName}] failed:`, geminiRes.status, errTxt)
            // If it fails, we return fallback but tell frontend NOT to cache it
            res.setHeader('Cache-Control', 'no-store, max-age=0, must-revalidate')
            return res.status(200).json({ ...FALLBACK, _debug: `Error ${geminiRes.status}` })
        }

        const data = await geminiRes.json()
        let raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
        raw = raw.replace(/```json/g, '').replace(/```/g, '').trim()

        const parsed = JSON.parse(raw)
        if (parsed.verse && parsed.quote) {
            // SUCCESS: Cache for 24 hours
            res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=43200')
            return res.status(200).json(parsed)
        }

        throw new Error('Invalid JSON structure from AI')

    } catch (err) {
        console.error('Final API Handler failure:', err)
        res.setHeader('Cache-Control', 'no-store, max-age=0, must-revalidate')
        return res.status(200).json(FALLBACK)
    }
}
