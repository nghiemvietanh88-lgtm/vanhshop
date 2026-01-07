import { Router } from 'express';
import { allowImageMineTypes, USER } from '../../constants.js';
import { createUser, deleteUser, getUsers, toggleLockAccount, updateUserById } from '../../controllers/users.controller.js';
import { isAdmin, isAdminOrStaff } from '../../middlewares/jwt-auth.js';
import UploadUtils from '../../utils/UploadUtils.js';

const router = Router();
const upload = UploadUtils.multerUpload('/users/', allowImageMineTypes);
const roleStaff = USER.ROLE.STAFF;
const roleCustomer = USER.ROLE.CUSTOMER;

/**
 * Authorization
 * route /staff     : only admin
 * route /customer  : admin or staff
 */

//#region /staff

router.route('/staff')
  .get(isAdmin, getUsers(roleStaff))
  .post(
    isAdmin,
    upload.single('avatar'),
    UploadUtils.handleFilePath('avatar'),
    createUser(roleStaff)
  );

//#endregion


router.route('/customer')
  .get(getUsers(roleCustomer))
  .post(
    isAdminOrStaff,
    upload.single('avatar'),
    UploadUtils.handleFilePath('avatar'),
    createUser(roleCustomer)
  );
router.route('/customer/:identity')
  .get(getUsers(roleCustomer))
  .patch(
    isAdminOrStaff,
    upload.single('avatar'),
    UploadUtils.handleFilePath('avatar'),
    updateUserById
  )
  .delete(
    isAdminOrStaff,
    deleteUser
  );

// Toggle lock/unlock customer account
router.route('/customer/:identity/toggle-lock')
  .patch(isAdminOrStaff, toggleLockAccount);

// Get ALL users (admin, staff, customer)
router.route('/all')
  .get(isAdminOrStaff, async (_req, res, next) => {
    try {
      const userService = (await import('../../services/user.service.js')).default;
      const ResponseUtils = (await import('../../utils/ResponseUtils.js')).default;

      let users = await userService.getAll();
      users = users.map(user => {
        if (user.password) delete user.password;
        return user;
      });

      if (users && users.length > 0) {
        ResponseUtils.status200(res, 'Gets all users successfully', users);
      } else {
        ResponseUtils.status404(res, 'No users found');
      }
    } catch (err) { next(err); }
  });

export default router;
