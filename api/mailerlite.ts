import type { VercelRequest, VercelResponse } from "@vercel/node"

const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY
const MAILERLITE_API_URL = "https://connect.mailerlite.com/api"

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    // Set CORS headers to allow requests from any origin
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "POST, DELETE, OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type")

    // Respond to preflight OPTIONS requests
    if (req.method === "OPTIONS") {
        return res.status(200).end()
    }

    if (!MAILERLITE_API_KEY) {
        return res.status(500).json({ error: "API key is not configured." })
    }

    const { email, fields, groups, mode } = req.body

    if (!email) {
        return res.status(400).json({ error: "Email is required." })
    }

    const headers = {
        Authorization: `Bearer ${MAILERLITE_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
    }

    // Handle unsubscribe requests
    if (mode === "unsubscribe") {
        try {
            const response = await fetch(
                `${MAILERLITE_API_URL}/subscribers/${encodeURIComponent(
                    email
                )}`,
                {
                    method: "DELETE",
                    headers,
                }
            )

            if (response.status === 404) {
                // If user not found, consider it a success for the frontend
                return res
                    .status(200)
                    .json({ message: "Subscriber not found or already unsubscribed." })
            }
            if (!response.ok) {
                const errorData = await response.json()
                return res.status(response.status).json(errorData)
            }
            
            return res.status(204).send(null) // Successfully unsubscribed
        } catch (error) {
            return res.status(500).json({ error: "An unexpected error occurred." })
        }
    }

    // Handle subscribe/update requests
    try {
        const subscriberCheckResponse = await fetch(
            `${MAILERLITE_API_URL}/subscribers/${encodeURIComponent(email)}`,
            { headers }
        )

        const fieldsPayload = fields
            ? Object.fromEntries(
                  Object.entries(fields).map(([key, value]) => [
                      key.toLowerCase(),
                      value,
                  ])
              )
            : {}

        let apiResponse
        let payload

        if (subscriberCheckResponse.status === 200) {
            // Subscriber exists, so we UPDATE them (PUT)
            payload = {
                fields: fieldsPayload,
                groups: groups || [],
            }
            apiResponse = await fetch(
                `${MAILERLITE_API_URL}/subscribers/${encodeURIComponent(
                    email
                )}`,
                {
                    method: "PUT",
                    headers,
                    body: JSON.stringify(payload),
                }
            )
        } else if (subscriberCheckResponse.status === 404) {
            // Subscriber does not exist, so we CREATE them (POST)
            payload = {
                email,
                fields: fieldsPayload,
                groups: groups || [],
            }
            apiResponse = await fetch(`${MAILERLITE_API_URL}/subscribers`, {
                method: "POST",
                headers,
                body: JSON.stringify(payload),
            })
        } else {
            // Handle other potential errors from the check
            const errorData = await subscriberCheckResponse.json()
            return res
                .status(subscriberCheckResponse.status)
                .json(errorData)
        }

        const data = await apiResponse.json()

        if (!apiResponse.ok) {
            return res.status(apiResponse.status).json(data)
        }

        return res.status(200).json(data)
    } catch (error) {
        return res.status(500).json({ error: "An unexpected error occurred." })
    }
} 