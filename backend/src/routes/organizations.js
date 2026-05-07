const router = require('express').Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const {
  createOrganization,
  listOrganizations,
  listOrganizationsPublic,
} = require('../controllers/organizationController');

// Public — used by admin signup dropdown
router.get('/public', listOrganizationsPublic);

// Protected — Super Admin only
router.post('/', authenticateToken, requireRole('super_admin'), createOrganization);
router.get('/', authenticateToken, requireRole('super_admin'), listOrganizations);

module.exports = router;
