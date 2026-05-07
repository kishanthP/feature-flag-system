const router = require('express').Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const {
  createFlag, getFlags, updateFlag, deleteFlag, checkFlag,
} = require('../controllers/flagController');

// Public — End User flag check
router.get('/check', checkFlag);

// Protected — Org Admin only
router.post('/', authenticateToken, requireRole('org_admin'), createFlag);
router.get('/', authenticateToken, requireRole('org_admin'), getFlags);
router.patch('/:id', authenticateToken, requireRole('org_admin'), updateFlag);
router.delete('/:id', authenticateToken, requireRole('org_admin'), deleteFlag);

module.exports = router;
