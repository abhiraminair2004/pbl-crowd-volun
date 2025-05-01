const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // For images, always save as .jpg
        if (file.mimetype.startsWith('image/')) {
            cb(null, uniqueSuffix + '.jpg');
        } else {
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    }
});

// Process image after upload
const processImage = async (req, res, next) => {
    try {
        if (!req.file) {
            console.log('No file uploaded');
            return next();
        }

        console.log('Processing file:', {
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            path: req.file.path
        });

        // Only process if it's an image
        if (!req.file.mimetype.startsWith('image/')) {
            console.log('Not an image file, skipping processing');
            return next();
        }

        const filePath = path.join(uploadDir, req.file.filename);
        console.log('Processing image at path:', filePath);

        try {
            // Get image metadata
            const metadata = await sharp(req.file.path).metadata();
            console.log('Original image metadata:', metadata);

            // Calculate new dimensions while maintaining aspect ratio
            const MAX_WIDTH = 400;
            const MAX_HEIGHT = 400;
            let width = metadata.width;
            let height = metadata.height;

            // Always resize if either dimension exceeds the maximum
            if (width > MAX_WIDTH || height > MAX_HEIGHT) {
                const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
                width = Math.round(width * ratio);
                height = Math.round(height * ratio);
            }

            // Process image with sharp
            await sharp(req.file.path)
                .resize(width, height, {
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .jpeg({
                    quality: 70,
                    progressive: true,
                    mozjpeg: true,
                    chromaSubsampling: '4:2:0'
                })
                .toFile(filePath + '.processed');

            // Get processed file size
            const stats = fs.statSync(filePath + '.processed');
            console.log('Processed image size:', Math.round(stats.size / 1024), 'KB');

            // Replace original file with processed one
            fs.unlinkSync(req.file.path);
            fs.renameSync(filePath + '.processed', filePath);

            console.log('Image processing completed successfully');
        } catch (processError) {
            console.error('Error during image processing:', processError);
            // If processing fails, keep the original file
            console.log('Keeping original file due to processing error');
        }

        next();
    } catch (error) {
        console.error('Error in processImage middleware:', error);
        next(error);
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        console.log('Received file:', {
            originalname: file.originalname,
            mimetype: file.mimetype
        });

        // Accept images, videos, and documents
        const allowedMimes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'video/mp4',
            'video/mpeg',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/plain'
        ];

        if (allowedMimes.includes(file.mimetype)) {
            console.log('File type accepted');
            cb(null, true);
        } else {
            console.log('File type rejected:', file.mimetype);
            cb(new Error('Invalid file type'), false);
        }
    },
    limits: {
        fileSize: 25 * 1024 * 1024 // 25MB limit
    }
});

// Helper function to determine media type
const getMediaType = (mimetype) => {
    if (mimetype.startsWith('image/')) return 'image';
    if (mimetype.startsWith('video/')) return 'video';
    if (mimetype.startsWith('application/') || mimetype === 'text/plain') return 'document';
    return null;
};

// Helper function to get file URL
const getFileUrl = (filename) => {
    return `/uploads/${filename}`;
};

module.exports = {
    upload,
    processImage,
    getMediaType,
    getFileUrl,
    uploadDir
};