export default async function handler(req, res) {
  // 🔥 Habilita CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { channel, ...payload } = req.body;

  let webhookUrl;

  if (channel === "notify-cs") {
    webhookUrl = process.env.SLACK_WEBHOOK_URL;
  } else if (channel === "quitacao") {
    webhookUrl = process.env.SLACK_WEBHOOK_QUITACAO;
  }

  if (!webhookUrl) {
    return res.status(500).json({ error: "Webhook not configured" });
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
