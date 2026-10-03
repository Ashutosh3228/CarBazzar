const express = require('express');
const router = express.Router();
const {
  createInquiry,
  getReceivedInquiries,
  getSentInquiries,
  updateInquiryStatus,
} = require('../controllers/inquiryController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', createInquiry);
router.get('/received', getReceivedInquiries);
router.get('/sent', getSentInquiries);
router.patch('/:id', updateInquiryStatus);

module.exports = router;
