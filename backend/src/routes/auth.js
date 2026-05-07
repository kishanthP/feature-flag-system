const router = require('express').Router();
const { superAdminLogin, adminSignup, adminLogin } = require('../controllers/authController');

router.post('/superadmin/login', superAdminLogin);
router.post('/admin/signup', adminSignup);
router.post('/admin/login', adminLogin);

module.exports = router;
