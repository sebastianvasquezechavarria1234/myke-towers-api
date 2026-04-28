import express from 'express';
import yts from 'yt-search';
import cors from 'cors';
import NodeCache from 'node-cache';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const cache = new NodeCache({ stdTTL: 3600 });
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- HELPER PARA LEER DB ---
const getDB = () => {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'db.json'), 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading db.json", err);
        return { socialWall: [], discography: [] };
    }
};

// --- ENDPOINTS ---

// 1. Bienvenida
app.get('/', (req, res) => {
    res.json({
        mensaje: "Bienvenido a la API Maestro de Myke Towers",
        version: "3.0.0",
        descripción: "Datos locales ultra-rápidos y conexión dinámica a YouTube.",
        endpoints: [
            "/albums - Discografía completa (Local)",
            "/albums/:id/songs - Canciones de un álbum",
            "/videos - Videos más recientes (YouTube)",
            "/canal - Estadísticas del canal",
            "/social - Posts del muro social"
        ]
    });
});

// 2. Discografía Completa (Local - ¡Nunca falla!)
app.get('/albums', (req, res) => {
    const db = getDB();
    res.json(db.discography);
});

// 3. Ruta dinámica de álbumes (Ahora apunta al local por estabilidad)
app.get('/dynamic-albums', (req, res) => {
    const db = getDB();
    res.json(db.discography);
});

// 4. Canciones de un álbum
app.get('/albums/:id/songs', (req, res) => {
    const db = getDB();
    const album = db.discography.find(a => a.id === req.params.id);
    
    if (!album) return res.status(404).json({ error: "Álbum no encontrado" });
    
    res.json({
        album: album.title,
        image: album.image,
        year: album.year,
        songs: album.tracklist
    });
});

// 5. Videos de YouTube (Dinámico)
app.get('/videos', async (req, res) => {
    const cacheKey = 'videos_list';
    const cachedData = cache.get(cacheKey);
    if (cachedData) return res.json(cachedData);

    try {
        const r = await yts({ query: 'Myke Towers oficial', type: 'video' });
        const videos = r.videos.slice(0, 10).map(v => ({
            id: v.videoId,
            titulo: v.title,
            vistas: v.views,
            duracion: v.timestamp,
            imagen: v.thumbnail,
            url: v.url
        }));
        cache.set(cacheKey, videos);
        res.json(videos);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener videos" });
    }
});

// 6. Social Wall
app.get('/social', (req, res) => {
    const db = getDB();
    res.json(db.socialWall);
});

app.listen(PORT, () => {
    console.log(`🚀 API MAESTRO de Myke Towers corriendo en http://localhost:${PORT}`);
});
