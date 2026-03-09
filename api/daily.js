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

    const models = [
        process.env.GEMINI_MODEL || 'gemini-1.5-flash',
        'gemini-2.0-flash',
        'gemini-1.5-pro'
    ]

    const prompt = `Today's date is ${date}. You are creating a unique daily devotional for a couple deeply in love (Eisen and Peinshiii).
    Eisen is the sender, Peinshiii is the recipient. 

    CRITICAL: Do NOT repeat previous themes. Today, pick a specific theme from this list: [Deep Trust, Shared Growth, Playful Joy, Quiet Devotion, Future Dreams, or Resilience].

    Generate:
    1. ONE Bible verse that fits the chosen theme — include text and reference.
    2. ONE fresh, heartfelt quote (1-2 sentences) about their connection.
    
    Respond ONLY with JSON: {"verse":{"text":"...","reference":"..."},"quote":"..."}`

    async function tryGenerate(modelName) {
        try {
            // Use a unique cache-buster key in the URL to ensure fresh AI calls
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 1.0,
                        maxOutputTokens: 600,
                        responseMimeType: 'application/json',
                        candidateCount: 1
                    }
                })
            })
            if (!res.ok) {
                const txt = await res.text()
                return { success: false, status: res.status, error: txt }
            }
            const data = await res.json()
            let raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
            raw = raw.replace(/```json/g, '').replace(/```/g, '').trim()
            const parsed = JSON.parse(raw)
            return { success: !!(parsed.verse && parsed.quote), data: parsed }
        } catch (e) { return { success: false, error: e.message } }
    }

    let lastError = 'No models attempted'
    for (const modelName of models) {
        const result = await tryGenerate(modelName)
        if (result.success) {
            // Success: Cache for 24h at the edge
            res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=43200')
            return res.status(200).json(result.data)
        }
        lastError = result.error || 'Unknown error'
        console.warn(`Model ${modelName} failed. Trying next...`)
    }

    // If all fail
    res.setHeader('Cache-Control', 'no-store, max-age=0, must-revalidate')
    return res.status(200).json({
        ...FALLBACK,
        _debug: lastError.substring(0, 100) // Secret debug for us
    })
}
