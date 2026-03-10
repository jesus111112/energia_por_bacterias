module.exports = async function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")    return res.status(405).json({ error: "Método no permitido" });

  const { messages, page } = req.body;

  const PAGES = {
    "index":         "El usuario está en la página de inicio del proyecto 'Modificación de bacterias con nanopartículas de magnetita para producir energía eléctrica'. Accesos a: modelo 3D, simulador 2D, simulación de bacterias, investigación, wiki, modelo hiperrealista, galería virtual y editor 3D.",
    "modelo3d":      "El usuario ve el modelo 3D interactivo de una celda de combustible microbiana (MFC) con bacterias modificadas con nanopartículas de magnetita (Fe3O4). Las bacterias transfieren electrones hacia el ánodo generando corriente eléctrica.",
    "simulador2d":   "El usuario ve el Simulador 2D: flujo de electrones, cámara anódica y catódica separadas por membrana PEM, nanopartículas mejoran conductividad.",
    "simulacion":    "El usuario ve la simulación 3D de bacterias electroactivas (Geobacter sulfurreducens) con nanopartículas de magnetita, formando biofilms conductores.",
    "investigacion": "El usuario lee el documento de investigación: celdas MFC, nanopartículas de magnetita, bacterias electroactivas, metodología y resultados.",
    "hiperrealista": "El usuario ve el Modelo Hiperrealista 3D de la celda en entorno industrial: cámara anódica, catódica, membrana PEM, electrodos y circuito externo.",
  };

  const contexto = PAGES[page] || PAGES["index"];

  const systemPrompt = `Eres NanoBot, asistente científico del proyecto "Modificación de bacterias con nanopartículas de magnetita para producir energía eléctrica". Experto en: Celdas MFC, Nanopartículas Fe3O4, Bacterias electroactivas, Biotecnología y nanotecnología.

CONTEXTO ACTUAL: ${contexto}

INSTRUCCIONES: Responde SIEMPRE en español. Máximo 150 palabras. Usa emojis científicos. Tono amigable y motivador.`;

  const geminiMessages = (messages || []).map(m => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }]
  }));

  try {
    const GEMINI_KEY = process.env.GEMINI_API_KEY;

    console.log("KEY existe:", !!GEMINI_KEY);

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: geminiMessages,
          generationConfig: { maxOutputTokens: 400, temperature: 0.7 }
        })
      }
    );

    const data = await geminiRes.json();
    console.log("Gemini status:", geminiRes.status);
    console.log("Gemini data:", JSON.stringify(data).substring(0, 300));

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
      || "Error: " + JSON.stringify(data?.error || "Sin respuesta");

    return res.status(200).json({ text });

  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
}



