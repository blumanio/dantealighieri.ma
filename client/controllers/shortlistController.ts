import { Request, Response } from 'express';
import User from '../lib/models/User';
import { calculateLimits } from '../app/config/gamification';
import GamificationService from '../services/gamificationService';

export const addToShortlist = async (req: Request, res: Response) => {
    const { userId } = req.auth; // Assuming clerkId is attached from middleware
    const { universityId } = req.params;

    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const limits = calculateLimits(user);

    // Enforce the limit
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

    // Add to shortlist if not already present
    if (!user.shortlist.includes(universityId)) {
        user.shortlist.push(universityId);
        // We can even award XP for the first time a user shortlists something
        // await GamificationService.handleAction(user._id, 'SHORTLIST_UNIVERSITY');
        await user.save();
    }

    res.status(200).json({ success: true, shortlist: user.shortlist });
};