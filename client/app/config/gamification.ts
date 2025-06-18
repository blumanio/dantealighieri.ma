export const actions = {
    // Exploration
    FAVORITE_UNIVERSITY: { xp: 10 },
    TRACK_UNIVERSITY: { xp: 25 },
    // Community
    CREATE_COMMUNITY_POST: { xp: 20 },
    CREATE_COMMUNITY_COMMENT: { xp: 15 },
    // Major Milestones
    UPLOAD_DOCUMENT: { xp: 100 },
    // Community Engagement
    LIKE_POST: { xp: 2 },       // Rewarding low-effort engagement
    BOOKMARK_POST: { xp: 5 },   // Higher intent than a like

    // University & Course Exploration
    VIEW_COURSE_DETAIL: { xp: 5 },

    // Major Milestones
};

export const unlocks = {
    // XP thresholds for unlocking features
    SHORTLIST_SLOT_1: { xp: 500, slots: 1 },
    SHORTLIST_SLOT_2: { xp: 1000, slots: 1 },
    TRACKING_SLOT_1: { xp: 750, slots: 2 },
};

export const tierLimits = {
    Viaggiatore: { shortlist: 3, tracking: 3 },
    Esploratore: { shortlist: 10, tracking: 10 },
    Maestro: { shortlist: Infinity, tracking: Infinity },
};

// Helper function to calculate total allowed slots for a user
export const calculateLimits = (user:any) => {
    const baseLimit = tierLimits[user.tier];
    const unlockedBonus = user.unlockedFeatures;

    return {
        shortlist: baseLimit.shortlist + unlockedBonus.extraShortlistSlots,
        tracking: baseLimit.tracking + unlockedBonus.extraTrackingSlots,
    };
};


export type ActionType = keyof typeof actions;
