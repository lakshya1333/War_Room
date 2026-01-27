"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reconRouter = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const reconService_1 = require("../services/reconService");
const router = (0, express_1.Router)();
exports.reconRouter = router;
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
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
        (0, reconService_1.startReconnaissance)({
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
    }
    catch (error) {
        console.error('Recon endpoint error:', error);
        res.status(500).json({ error: error.message });
    }
});
//# sourceMappingURL=recon.js.map