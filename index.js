import express from 'express';
import yts from 'yt-search';
import cors from 'cors';
import NodeCache from 'node-cache';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const cache = new NodeCache({ stdTTL: 3600 }); // Caché de 1 hora
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- CONFIGURACIÓN ---
const MYKE_TOWERS_ITUNES_ID = '1021481524';

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
        version: "3.0.0",
        descripción: "API optimizada con datos locales y conexión a iTunes/YouTube.",
        endpoints: [
            "/albums - Discografía completa (Local)",
            "/albums/:id/songs - Canciones de un álbum (Local)",
            "/social - Posts del muro social",
            "/historia - Biografía y datos personales",
            "/videos - Videos de YouTube",
            "/dynamic-albums - Discografía en tiempo real (iTunes)"
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
        const r = await yts({ query: 'Myke Towers oficial', type: 'video' });
        const videos = r.videos.slice(0, 12).map(v => ({
            id: v.videoId,
            titulo: v.title,
            vistas: v.views,
            duracion: v.timestamp,
            publicado: v.ago,
            imagen: v.thumbnail,
            url: v.url
        }));
        cache.set(cacheKey, videos);
        res.json(videos);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener videos" });
    }
});

// 6. Social Posts (Local)
app.get('/social', (req, res) => {
    const db = getDB();
    res.json(db.socialWall);
});

// 7. Álbumes (Local - El que usa el frontend principal)
app.get('/albums', (req, res) => {
    const db = getDB();
    res.json(db.discography);
});

// 8. Canciones de un álbum (Local)
app.get('/albums/:id/songs', (req, res) => {
    const db = getDB();
    const { id } = req.params;
    // Buscamos por ID (que puede ser string o número en db.json)
    const album = db.discography.find(a => String(a.id) === id);

    if (!album) {
        return res.status(404).json({ error: "Álbum no encontrado" });
    }

    res.json({
        album: album.title,
        year: album.year,
        image: album.image,
        songs: album.tracklist || []
    });
});

// 9. Dynamic Albums (iTunes API)
app.get('/dynamic-albums', async (req, res) => {
    try {
        const response = await axios.get(`https://itunes.apple.com/lookup?id=${MYKE_TOWERS_ITUNES_ID}&entity=album&limit=100`);
        const albums = response.data.results
            .filter(item => item.wrapperType === 'collection' && item.collectionType === 'Album')
            .map(album => ({
                id: album.collectionId,
                title: album.collectionName,
                image: album.artworkUrl100.replace('100x100bb', '1000x1000bb'),
                year: album.releaseDate.split('-')[0],
                tracksCount: album.trackCount
            }))
            .sort((a, b) => b.year - a.year);
        res.json(albums);
    } catch (error) {
        res.status(500).json({ error: "Error al conectar con iTunes" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 API Profesional de Myke Towers activa en http://localhost:${PORT}`);
});
