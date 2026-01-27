import { Router } from 'express';
import multer from 'multer';
import { startReconnaissance } from '../services/reconService';

const router = Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

router.post('/recon', upload.single('image'), async (req, res) => {
  try {
    const { url, repo } = req.body;
    const image = req.file;
    const io = req.app.get('io');

    if (!url && !repo) {
      return res.status(400).json({ error: 'URL or repo is required' });
    }

    const sessionId = `recon_${Date.now()}`;
    
    // Start reconnaissance in background
    startReconnaissance({
      sessionId,
      url,
      repo,
      image: image ? {
        buffer: image.buffer,
        mimetype: image.mimetype,
        originalname: image.originalname
      } : undefined,
      io
    }).catch(error => {
      console.error('Recon error:', error);
      io.emit('recon:error', { sessionId, error: error.message });
    });

    res.json({ 
      success: true, 
      sessionId,
      message: 'Reconnaissance started'
    });
  } catch (error: any) {
    console.error('Recon endpoint error:', error);
    res.status(500).json({ error: error.message });
  }
});

export { router as reconRouter };
