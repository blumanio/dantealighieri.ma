// import User from '../lib/models/User';
// import { actions, unlocks } from '../app/config/gamification';

// class GamificationService {
//     public static async handleAction(userId: string, actionType: keyof typeof actions) {
//         const user = await User.findById(userId);
//         if (!user) throw new Error('User not found');

//         const action = actions[actionType];
//         if (!action) return user;

//         // 1. Award XP
//         const oldXp = user.xp;
//         user.xp += action.xp;

//         // 2. Check for new unlocks
//         this.checkForUnlocks(user, oldXp);  

//         await user.save();
//         return user;
//     }

//     private static checkForUnlocks(user: any, oldXp: number) {
//         // Check for shortlist slot unlocks
//         if (user.xp >= unlocks.SHORTLIST_SLOT_1.xp && oldXp < unlocks.SHORTLIST_SLOT_1.xp) {
//             user.unlockedFeatures.extraShortlistSlots += unlocks.SHORTLIST_SLOT_1.slots;
//         }
//         if (user.xp >= unlocks.SHORTLIST_SLOT_2.xp && oldXp < unlocks.SHORTLIST_SLOT_2.xp) {
//             user.unlockedFeatures.extraShortlistSlots += unlocks.SHORTLIST_SLOT_2.slots;
//         }
//         // ... add more unlock checks here (e.g., for tracking slots)
//     }
// }

// export default GamificationService;

import { ActionType } from "@/app/config/gamification";

/**
 * Triggers a gamification action on the backend.
 * This is a "fire-and-forget" function for simplicity.
 * @param action - The type of action to record (e.g., 'LIKE_POST').
 */
export const triggerGamificationAction = (action: ActionType): void => {
    fetch('/api/user/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
    })
        .then(response => {
            if (!response.ok) {
                console.error(`Gamification action '${action}' failed.`);
            }
            // You can optionally handle the response here if needed
        })
        .catch(error => {
            console.error(`Error triggering gamification action '${action}':`, error);
        });
};