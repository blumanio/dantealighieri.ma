import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import User from '../lib/models/User';
import { calculateLimits } from '../app/config/gamification';

// Extend Request type
interface AuthenticatedRequest extends Request {
    auth: {
        userId: string;
    };
}

export const addToShortlist = async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.auth;
    const { universityId } = req.params;
    
    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const limits = calculateLimits(user);
    
    if (user.shortlist.length >= limits.shortlist) {
        return res.status(403).json({
            error: 'SHORTLIST_FULL',
            message: 'Your shortlist is full. Upgrade your plan or earn more XP to add more universities.',
            limits: {
                current: user.shortlist.length,
                max: limits.shortlist,
            }
        });
    }
    
    const universityObjectId = new ObjectId(universityId);
    
    if (!user.shortlist.includes(universityObjectId)) {
        user.shortlist.push(universityObjectId);
        await user.save();
    }
    
    res.status(200).json({ success: true, shortlist: user.shortlist });
};