import { ActionType, actions } from '@/app/config/gamification';
import { gamification } from '@/app/utils/analytics';

/**
 * Triggers a gamification action on the backend and fires the matching GA4 event.
 * Fire-and-forget — does not block UI.
 */
export const triggerGamificationAction = (action: ActionType): void => {
  fetch('/api/user/actions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action }),
  })
    .then(async (response) => {
      if (!response.ok) {
        console.error(`Gamification action '${action}' failed.`);
        return;
      }

      const data = await response.json();

      // ── Fire GA4 xp_gained event ─────────────────────────────────────
      if (data.xpGained && data.newXpTotal !== undefined) {
        gamification.xpGained({
          action,
          xp_gained: data.xpGained,
          new_xp_total: data.newXpTotal,
        });

        // ── Detect level-up ──────────────────────────────────────────
        const xpPerLevel = 1000;
        const oldLevel = Math.floor((data.newXpTotal - data.xpGained) / xpPerLevel) + 1;
        const newLevel = Math.floor(data.newXpTotal / xpPerLevel) + 1;

        if (newLevel > oldLevel) {
          gamification.levelUp({
            old_level: oldLevel,
            new_level: newLevel,
            xp: data.newXpTotal,
          });
        }

        // ── Detect feature unlocks ───────────────────────────────────
        const unlockThresholds: Record<number, string> = {
          500: 'SHORTLIST_SLOT_1',
          750: 'TRACKING_SLOT_1',
          1000: 'SHORTLIST_SLOT_2',
        };

        const prevXp = data.newXpTotal - data.xpGained;
        for (const [threshold, featureName] of Object.entries(unlockThresholds)) {
          const t = Number(threshold);
          if (prevXp < t && data.newXpTotal >= t) {
            gamification.featureUnlocked({
              feature_name: featureName,
              xp_at_unlock: data.newXpTotal,
            });
          }
        }
      }
    })
    .catch((error) => {
      console.error(`Error triggering gamification action '${action}':`, error);
    });
};
