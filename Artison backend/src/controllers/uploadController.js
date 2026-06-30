const { cloudinary } = require('../config/cloudinary');

const uploadToCloudinary = async (fileBuffer, mimetype) => {
  const b64 = Buffer.from(fileBuffer).toString("base64");
  const dataURI = "data:" + mimetype + ";base64," + b64;
  return await cloudinary.uploader.upload(dataURI, {
    folder: 'artisna',
    resource_type: 'auto', // Automatically detects image, video, or raw (doc)
  });
};

const uploadSingle = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file provided' });
    }

    const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype);

    res.status(200).json({
      success: true,
      data: {
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        resource_type: result.resource_type
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'File upload failed' });
  }
};

const uploadMultiple = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files provided' });
    }

    const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer, file.mimetype));
    const results = await Promise.all(uploadPromises);

    const data = results.map(result => ({
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      resource_type: result.resource_type
    }));

    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Multiple files upload failed' });
  }
};

module.exports = { uploadSingle, uploadMultiple };
