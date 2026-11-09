import { Request, Response, NextFunction } from 'express';
import { getAuth } from '../config/firebase';
import { User, IUser } from '../models/User';

// Extend Express Request type to include user
export interface AuthRequest extends Request {
  user?: IUser;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Authorization header missing or invalid format (Bearer <token> required)',
      });
      return;
    }

    const token = authHeader.split('Bearer ')[1].trim();
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Token is missing',
      });
      return;
    }

    // Verify token with Firebase Admin
    let decodedToken;
    try {
      decodedToken = await getAuth().verifyIdToken(token);
    } catch (err: any) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired Firebase ID token',
        error: err.message,
      });
      return;
    }

    const { uid, email, name, picture, phone_number } = decodedToken;

    // Find or auto-provision user in MongoDB
    let user = await User.findOne({ firebaseUid: uid });
    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        email: email || `${uid}@customer.maha`,
        name: name || 'Customer',
        photoURL: picture || '',
        phoneNumber: phone_number || '',
        role: 'user',
        isBlocked: false,
        notificationTokens: [],
      });
      console.log(`👤 Created new MongoDB user profile for UID: ${uid}`);
    }

    if (user.isBlocked) {
      res.status(403).json({
        success: false,
        message: 'Account is blocked. Please contact Maha Dairy support.',
      });
      return;
    }

    req.user = user;
    next();
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Authentication internal error',
      error: error.message,
    });
  }
};
