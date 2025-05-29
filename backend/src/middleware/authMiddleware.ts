import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { AuthRequest } from '../types';

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token;
    let userEmail;

    // Check for JWT token first
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    // Check for email header (temporary for NextAuth integration)
    if (req.headers['x-user-email']) {
      userEmail = req.headers['x-user-email'] as string;
    }

    if (!token && !userEmail) {
      res.status(401).json({
        success: false,
        error: 'Not authorized, no token or email'
      });
      return;
    }

    try {
      let user;
      
      if (token) {
        // JWT token authentication
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        user = await User.findById(decoded.id).select('-password');
      } else if (userEmail) {
        // Email-based authentication (for NextAuth integration)
        user = await User.findOne({ email: userEmail }).select('-password');
        if (!user) {
          // Create user if doesn't exist (for Google OAuth users)
          user = await User.create({
            email: userEmail,
            name: userEmail.split('@')[0], // Use email prefix as name initially
            provider: 'google'
          });
        }
      }
      
      if (!user) {
        res.status(401).json({
          success: false,
          error: 'Not authorized, user not found'
        });
        return;
      }

      req.user = {
        id: (user._id as any).toString(),
        email: user.email,
        name: user.name
      };

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({
        success: false,
        error: 'Not authorized, authentication failed'
      });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server error in auth middleware'
    });
    return;
  }
};

export const optional = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token;
    let userEmail;

    // Check for JWT token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    // Check for email header (for NextAuth integration)
    if (req.headers['x-user-email']) {
      userEmail = req.headers['x-user-email'] as string;
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        const user = await User.findById(decoded.id).select('-password');
        if (user) {
          req.user = {
            id: (user._id as any).toString(),
            email: user.email,
            name: user.name
          };
        }
      } catch (error) {
        // Token is invalid but we continue anyway since auth is optional
        console.log('Invalid token in optional auth middleware:', error);
      }
    } else if (userEmail) {
      try {
        // Email-based authentication (for NextAuth integration)
        let user = await User.findOne({ email: userEmail }).select('-password');
        if (!user) {
          // Create user if doesn't exist (for Google OAuth users)
          user = await User.create({
            email: userEmail,
            name: userEmail.split('@')[0], // Use email prefix as name initially
            provider: 'google'
          });
        }
        
        req.user = {
          id: (user._id as any).toString(),
          email: user.email,
          name: user.name
        };
      } catch (error) {
        console.log('Failed to authenticate with email in optional middleware:', error);
      }
    }

    next();
  } catch (error) {
    console.error(error);
    next();
  }
};
