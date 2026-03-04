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

    const prompt = `Today's date is ${date}. You are creating a tender, romantic devotional for a couple deeply in love.

Generate:
1. ONE Bible verse that speaks beautifully to love, patience, faithfulness, or hope — include the exact verse text AND its scripture reference.
2. ONE original, heartfelt quote (1–2 warm sentences) about love, choosing each other, or growing together.

Make the content feel specific to this date — each day should feel unique and fresh.

Respond ONLY with this exact JSON (no markdown, no extra text):
{"verse":{"text":"...","reference":"..."},"quote":"..."}`

    try {
        const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.85,
                        maxOutputTokens: 350,
                        responseMimeType: 'application/json',
                    },
                }),
            }
        )

        if (!geminiRes.ok) {
            console.error('Gemini HTTP error', geminiRes.status)
            return res.status(200).json(FALLBACK)
        }

        const data = await geminiRes.json()
        const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

        let parsed = FALLBACK
        try {
            // responseMimeType: 'application/json' usually returns clean JSON
            parsed = JSON.parse(raw)
        } catch {
            const m = raw.match(/\{[\s\S]*\}/)
            if (m) {
                try { parsed = JSON.parse(m[0]) } catch { /* use fallback */ }
            }
        }

        // Tell Vercel CDN to cache for exactly 24 h → same date always same response
        res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600')
        return res.status(200).json(parsed)
    } catch (err) {
        console.error('handler error', err)
        return res.status(200).json(FALLBACK)
    }
}
