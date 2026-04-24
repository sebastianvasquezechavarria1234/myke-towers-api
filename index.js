const express = require('express');
const yts = require('yt-search');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Endpoint principal
app.get('/', (req, res) => {
    res.json({
        mensaje: "Bienvenido a la API de Myke Towers (No oficial)",
        autor: "Antigravity AI",
        endpoints: [
            "/canal - Datos del canal",
            "/videos - Últimos videos",
            "/buscar?q=cancion - Buscar canciones"
        ]
    });
});

// Obtener datos del canal
app.get('/canal', async (req, res) => {
    try {
        const r = await yts('Myke Towers');
        const channel = r.accounts[0] || r.channels[0];
        
        if (!channel) return res.status(404).json({ error: "Canal no encontrado" });

        res.json({
            nombre: channel.name || channel.title,
            url: channel.url,
            imagen: channel.image || channel.thumbnail,
            videosTotales: channel.videoCount
        });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener datos del canal" });
    }
});

// Obtener lista de videos
app.get('/videos', async (req, res) => {
    try {
        const r = await yts('Myke Towers');
        res.json(r.videos);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener videos" });
    }
});

// Buscar canciones específicas
app.get('/buscar', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: "Debes proporcionar un término de búsqueda (?q=...)" });

    try {
        const r = await yts(`Myke Towers ${query}`);
        res.json(r.videos);
    } catch (error) {
        res.status(500).json({ error: "Error en la búsqueda" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
