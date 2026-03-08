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

    const primaryModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
    const fallbackModel = 'gemini-1.5-flash'

    const prompt = `Today's date is ${date}. You are creating a tender, romantic devotional for a couple deeply in love (Eisen and Peinshiii).
    Eisen is the sender, Peinshiii is the recipient. 
    Generate:
    1. ONE Bible verse (love/faithfulness) — include text and reference.
    2. ONE unique, heartfelt quote about their bond.
    Respond ONLY with JSON: {"verse":{"text":"...","reference":"..."},"quote":"..."}`

    async function tryGenerate(modelName) {
        try {
            const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 1.0, maxOutputTokens: 500, responseMimeType: 'application/json' }
                })
            })

            if (!geminiRes.ok) {
                const errTxt = await geminiRes.text()
                console.error(`Gemini [${modelName}] failed:`, geminiRes.status, errTxt)
                return { success: false, status: geminiRes.status }
            }

            const data = await geminiRes.json()
            let raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
            raw = raw.replace(/```json/g, '').replace(/```/g, '').trim()

            const parsed = JSON.parse(raw)
            if (parsed.verse && parsed.quote) {
                return { success: true, data: parsed }
            }
            return { success: false }
        } catch (e) {
            console.error(`TryGenerate [${modelName}] catch:`, e)
            return { success: false }
        }
    }

    try {
        let result = await tryGenerate(primaryModel)

        // If Primary hits Quota (429) or doesn't exist (404), switch to high-quota 1.5-flash
        if (!result.success && (result.status === 429 || result.status === 404)) {
            console.warn(`Rotating to fallback model because ${primaryModel} failed with ${result.status}`)
            result = await tryGenerate(fallbackModel)
        }

        if (result.success) {
            res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=43200')
            return res.status(200).json(result.data)
        } else {
            res.setHeader('Cache-Control', 'no-store, max-age=0, must-revalidate')
            return res.status(200).json(FALLBACK)
        }
    } catch (err) {
        console.error('Final API Handler failure:', err)
        res.setHeader('Cache-Control', 'no-store, max-age=0, must-revalidate')
        return res.status(200).json(FALLBACK)
    }
}
