import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middlewares/auth';
import { User } from '../models/User';

const router = Router();

// Apply auth middleware to all auth endpoints
router.use(authenticate);

// GET /api/v1/auth/me - Get current authenticated user profile
router.get('/me', (req: AuthRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'User not authenticated' });
    return;
  }

  res.status(200).json({
    success: true,
    data: {
      id: req.user._id,
      firebaseUid: req.user.firebaseUid,
      name: req.user.name,
      email: req.user.email,
      phoneNumber: req.user.phoneNumber,
      photoURL: req.user.photoURL,
      role: req.user.role,
      isBlocked: req.user.isBlocked,
      createdAt: req.user.createdAt,
    },
  });
});

// POST /api/v1/auth/sync - Update / synchronize profile details
router.post('/sync', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'User not authenticated' });
      return;
    }

    const { name, phoneNumber, photoURL } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found in database' });
      return;
    }

    if (name) user.name = name;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (photoURL !== undefined) user.photoURL = photoURL;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile synchronized successfully',
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message,
    });
  }
});

export default router;
