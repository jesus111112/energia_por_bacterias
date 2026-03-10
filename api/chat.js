export default async function handler(req, res)

  // ── CORS: solo permite tu GitHub Pages ──
  res.setHeader("Access-Control-Allow-Origin", "https://jesus111112.github.io");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // preflight
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")    return res.status(405).json({ error: "Método no permitido" });

  const { messages, page } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Faltan mensajes" });
  }

  // ── Contextos de NanoBot ──
  const PAGES = {
    "index":         "El usuario está en la página de inicio del proyecto 'Modificación de bacterias con nanopartículas de magnetita para producir energía eléctrica'. Accesos a: modelo 3D, simulador 2D, simulación de bacterias, investigación, wiki, modelo hiperrealista, galería virtual y editor 3D.",
    "modelo3d":      "El usuario ve el modelo 3D interactivo de una celda de combustible microbiana (MFC) con bacterias modificadas con nanopartículas de magnetita (Fe3O4). Las bacterias transfieren electrones hacia el ánodo generando corriente eléctrica.",
    "simulador2d":   "El usuario ve el Simulador 2D: flujo de electrones desde las bacterias al circuito, cámara anódica y catódica separadas por membrana PEM, y cómo las nanopartículas de magnetita mejoran la conductividad eléctrica.",
    "simulacion":    "El usuario ve la simulación 3D de bacterias electroactivas (Geobacter sulfurreducens) en movimiento con nanopartículas de magnetita adheridas, formando biofilms conductores y transfiriendo electrones extracelularmente.",
    "investigacion": "El usuario lee el documento de investigación del proyecto: celdas de combustible microbianas (MFC), nanopartículas de magnetita, bacterias electroactivas, metodología experimental, resultados y referencias.",
    "hiperrealista": "El usuario ve el Modelo Hiperrealista 3D de la celda de combustible microbiana en entorno industrial: cámara anódica, catódica, membrana PEM, electrodos y circuito externo.",
  };

  const contexto = PAGES[page] || PAGES["index"];

  const systemPrompt = `Eres NanoBot, asistente científico del proyecto "Modificación de bacterias con nanopartículas de magnetita para producir energía eléctrica". Experto en: Celdas MFC, Nanopartículas Fe3O4, Bacterias electroactivas, Biotecnología y nanotecnología, Transferencia extracelular de electrones.

CONTEXTO ACTUAL DEL USUARIO:
${contexto}

INSTRUCCIONES: Responde SIEMPRE en español. Máximo 150 palabras. Usa emojis científicos ocasionalmente. Relaciona tu respuesta con lo que el usuario ve en pantalla. Tono amigable y motivador.`;

  // ── Convertir mensajes al formato de Gemini ──
  // Gemini usa "user" y "model" (no "assistant")
  const geminiMessages = messages.map(m => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }]
  }));

  try {
    // ── Llamada a Gemini API ──
    // La API key vive aquí en Vercel, NUNCA en tu HTML
    const GEMINI_KEY = process.env.GEMINI_API_KEY;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemPrompt }]
          },
          contents: geminiMessages,
          generationConfig: {
            maxOutputTokens: 400,
            temperature: 0.7,
          }
        })
      }
    );

    const data = await geminiRes.json();

    // Extraer texto de la respuesta de Gemini
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
      || "Lo siento, no pude procesar tu pregunta.";

    return res.status(200).json({ text });

  } catch (error) {
    console.error("Error Gemini:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}


