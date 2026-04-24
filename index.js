const express = require('express');
const yts = require('yt-search');
const cors = require('cors');
const NodeCache = require('node-cache');

const app = express();
const cache = new NodeCache({ stdTTL: 3600 }); // Caché de 1 hora
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- DATOS HARDCODED (HISTORIA Y STATS) ---
const mykeInfo = {
    nombreReal: "Michael Anthony Torres Monge",
    nombreArtistico: "Myke Towers",
    nacimiento: "15 de enero de 1994",
    origen: "Río Piedras, Puerto Rico",
    generos: ["Reggaetón", "Trap Latino", "Pop Urbano"],
    biografia: "Conocido como 'El Young King', Myke Towers es uno de los líderes del movimiento urbano actual. Comenzó su carrera en la plataforma SoundCloud y saltó a la fama con su mixtape 'El Final del Principio'. Ha colaborado con leyendas como Daddy Yankee, Bad Bunny y Selena Gomez.",
    logros: [
        "Múltiples nominaciones a los Latin Grammy",
        "Top global con el éxito 'LALA'",
        "Álbumes platino como 'Easy Money Baby' y 'Lyke Mike'",
        "Líder en colaboraciones internacionales"
    ]
};

// --- ENDPOINTS ---

// 1. Bienvenida
app.get('/', (req, res) => {
    res.json({
        mensaje: "Bienvenido a la API Profesional de Myke Towers",
        version: "2.0.0",
        descripción: "API optimizada con caché y datos históricos para tu Frontend.",
        endpoints: [
            "/canal - Estadísticas de YouTube",
            "/videos - Lista de videos (Caché)",
            "/buscar?q=... - Buscador dinámico",
            "/historia - Biografía y datos personales",
            "/stats - Resumen de carrera"
        ]
    });
});

// 2. Historia y Biografía
app.get('/historia', (req, res) => {
    res.json(mykeInfo);
});

// 3. Estadísticas de Carrera
app.get('/stats', (req, res) => {
    res.json({
        oyentesMensuales: "Top 50 Global en Spotify",
        cancionMasExitosa: "LALA / Piensan",
        albumesPrincipales: ["Easy Money Baby", "Lyke Mike", "La Vida Es Una", "La Pantera Negra"],
        apodos: ["El Young King", "Myke", "La Pantera"]
    });
});

// 4. Datos del Canal (Con Caché)
app.get('/canal', async (req, res) => {
    const cacheKey = 'channel_data';
    const cachedData = cache.get(cacheKey);

    if (cachedData) return res.json(cachedData);

    try {
        const r = await yts('Myke Towers');
        const channel = r.accounts[0] || r.channels[0];
        
        if (!channel) return res.status(404).json({ error: "Canal no encontrado" });

        const data = {
            nombre: channel.name || channel.title,
            url: channel.url,
            imagen: channel.image || channel.thumbnail,
            videosTotales: channel.videoCount
        };

        cache.set(cacheKey, data);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener datos del canal" });
    }
});

// 5. Lista de Videos (Con Caché)
app.get('/videos', async (req, res) => {
    const cacheKey = 'videos_list';
    const cachedData = cache.get(cacheKey);

    if (cachedData) return res.json(cachedData);

    try {
        const r = await yts({ query: 'Myke Towers', type: 'video' });
        const videos = r.videos.map(v => ({
            id: v.videoId,
            titulo: v.title,
            vistas: v.views,
            duracion: v.timestamp,
            publicado: v.ago,
            imagen: v.thumbnail,
            url: v.url
        }));

        const response = {
            total: videos.length,
            videos: videos
        };

        cache.set(cacheKey, response);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener videos" });
    }
});

// 6. Buscador (Caché por Query)
app.get('/buscar', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: "Falta término de búsqueda" });

    const cacheKey = `search_${query.toLowerCase()}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) return res.json(cachedData);

    try {
        const r = await yts(`Myke Towers ${query}`);
        cache.set(cacheKey, r.videos);
        res.json(r.videos);
    } catch (error) {
        res.status(500).json({ error: "Error en la búsqueda" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 API Pro de Myke Towers corriendo en puerto ${PORT}`);
});
