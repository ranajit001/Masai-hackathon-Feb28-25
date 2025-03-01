import express from 'express';

import {  register,login,sendResetEmail, newPassget,newPassPost } from '../controllers/user.controller.js';

const UserRouter = express.Router();

UserRouter.post('/register',register);
UserRouter.post('/login',login);
UserRouter.post('/forgot_password',sendResetEmail);
UserRouter.get('/reset_password/:token',newPassget);
UserRouter.post('/reset_password/:token',newPassPost);

export default UserRouter