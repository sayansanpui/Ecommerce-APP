import express from 'express';
import { loginUser, registerUser, adminLogin } from '../controllers/userController.js';

const UserRouter = express.Router();

UserRouter.post('/register', registerUser);
UserRouter.post('/login', loginUser);
UserRouter.post('/admin', adminLogin);

export default UserRouter;