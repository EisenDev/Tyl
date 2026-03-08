const FALLBACK = {
    verse: {
        text: 'Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonor others, it is not self-seeking, it is not easily angered, it keeps no record of wrongs.',
        reference: '1 Corinthians 13:4–5',
    },
    quote: 'The best thing to hold onto in life is each other. — Audrey Hepburn',
}

export default async function handler(req, res) {
    // Allow CORS for local dev
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
    if (req.method === 'OPTIONS') return res.status(200).end()

    const date = req.query?.date
    if (!date) return res.status(400).json({ error: 'date query param required' })

    const apiKey = process.env.GEMINI_API_KEY
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash'

    if (!apiKey) {
        console.warn('GEMINI_API_KEY not set — returning fallback')
        return res.status(200).json(FALLBACK)
    }

    const prompt = `Today's date is ${date}. You are creating a tender, romantic devotional for a couple deeply in love (Eisen and Peinshiii).
    
    Eisen is the one sending this, and Peinshiii is the recipient. 

    Generate:
    1. ONE Bible verse that speaks beautifully to love, patience, or faithfulness — include the exact verse text AND its scripture reference.
    2. ONE unique, heartfelt quote (1–2 warm sentences) about their specific connection, or growing together. 

    Respond ONLY with this exact JSON format (ensure valid JSON):
    {"verse":{"text":"...","reference":"..."},"quote":"..."}`

    let responseData = FALLBACK
    let isSuccessful = false

    try {
        const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 1.0,  // Maximize variety
                        maxOutputTokens: 500,
                        responseMimeType: 'application/json',
                    },
                }),
            }
        )

        if (geminiRes.ok) {
            const data = await geminiRes.json()
            let raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

            // CLEANSE: Remove potential Markdown fences
            raw = raw.replace(/```json/g, '').replace(/```/g, '').trim()

            try {
                const parsed = JSON.parse(raw)
                if (parsed.verse && parsed.quote) {
                    responseData = parsed
                    isSuccessful = true
                }
            } catch (err) {
                console.error('JSON Parse error', err, 'Raw:', raw)
            }
        } else {
            const errTxt = await geminiRes.text()
            console.error('Gemini API Failure:', geminiRes.status, errTxt)
        }

        // Cache-Control Strategy
        if (isSuccessful) {
            // Success: Cache for 24h on Vercel Edge Cache (date-specific)
            res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=43200')
        } else {
            // Failure: Do NOT cache fallbacks so we can retry fresh next time
            res.setHeader('Cache-Control', 'no-store, max-age=0, must-revalidate')
        }

        return res.status(200).json(responseData)

    } catch (err) {
        console.error('Outer handler error', err)
        res.setHeader('Cache-Control', 'no-store, max-age=0, must-revalidate')
        return res.status(200).json(FALLBACK)
    }
}
