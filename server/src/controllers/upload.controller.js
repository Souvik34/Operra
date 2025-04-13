export const uploadImage = (req, res, next) => {
    const file = req.file;

    if (!file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
    
    res.status(200).json({ success: true, imageUrl });
};
