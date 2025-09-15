const multer = require('multer');

// We use memoryStorage to temporarily hold the file in memory before processing
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

module.exports = upload;