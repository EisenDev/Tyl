const FALLBACKS = [
    {
        verse: { text: 'Love is patient, love is kind. It does not envy, it does not boast, it is not proud.', reference: '1 Corinthians 13:4' },
        quote: 'The best thing to hold onto in life is each other. — Audrey Hepburn'
    },
    {
        verse: { text: 'Above all, maintain constant love for one another, for love covers a multitude of sins.', reference: '1 Peter 4:8' },
        quote: 'Being deeply loved by someone gives you strength, while loving someone deeply gives you courage. — Lao Tzu'
    },
    {
        verse: { text: 'Let all that you do be done in love.', reference: '1 Corinthians 16:14' },
        quote: 'Where there is love there is life. — Mahatma Gandhi'
    },
    {
        verse: { text: 'We love because he first loved us.', reference: '1 John 4:19' },
        quote: 'Love is composed of a single soul inhabiting two bodies. — Aristotle'
    }
]

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
    if (req.method === 'OPTIONS') return res.status(200).end()

    const date = req.query?.date
    if (!date) return res.status(400).json({ error: 'date query param required' })

    const apiKey = process.env.GEMINI_API_KEY
    const modelName = 'gemini-2.5-flash'

    // Pick a deterministic fallback based on the date so it doesn't flip-flop
    const dateHash = date.split('-').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const fallback = { ...FALLBACKS[dateHash % FALLBACKS.length], _isFallback: true }

    if (!apiKey) return res.status(200).json(fallback)

    const prompt = `Today's date is ${date}. Create a unique, romantic devotional for Eisen and Peinshiii.
    
    STRICT RULES:
    1. THEME: Choose ONE from [Trust, Growth, Forgiveness, Devotion, Resilience, or Joy].
    2. CONTENT: Must be 100% unique. NEVER use 1 Corinthians 13:4 or the Audrey Hepburn quote unless it is March 2027.
    3. SCRIPTURE: A verse that fits the theme.
    4. QUOTE: A heartfelt 1-2 sentence message to Peinshiii.

    Respond ONLY with JSON: {"verse":{"text":"...","reference":"..."},"quote":"..."}`

    try {
        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 1.0, maxOutputTokens: 600, responseMimeType: 'application/json' }
            })
        })

        if (!geminiRes.ok) {
            res.setHeader('Cache-Control', 'no-store, max-age=0, must-revalidate')
            return res.status(200).json(fallback)
        }

        const data = await geminiRes.json()
        let raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
        raw = raw.replace(/```json/g, '').replace(/```/g, '').trim()

        const parsed = JSON.parse(raw)
        if (parsed.verse && parsed.quote) {
            res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=43200')
            return res.status(200).json(parsed)
        }
        return res.status(200).json(fallback)

    } catch (err) {
        res.setHeader('Cache-Control', 'no-store, max-age=0, must-revalidate')
        return res.status(200).json(fallback)
    }
}
