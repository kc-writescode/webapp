/**
 * BadgeUnlockNotification Component
 * Shows an animated notification when a new badge is unlocked
 */

import { useAchievements } from '@contexts/AchievementContext';
import { X, Award } from 'lucide-react';

const BadgeUnlockNotification = () => {
  const { newBadge, dismissNewBadge } = useAchievements();

  if (!newBadge) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto animate-fade-in"
        onClick={dismissNewBadge}
      />

      {/* Notification Card */}
      <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 border border-yellow-500/50 rounded-2xl p-8 shadow-2xl shadow-yellow-500/20 pointer-events-auto animate-badge-unlock max-w-sm w-full">
        {/* Close button */}
        <button
          onClick={dismissNewBadge}
          className="absolute top-4 right-4 p-1 hover:bg-slate-700 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>

        {/* Content */}
        <div className="text-center">
          {/* Trophy icon */}
          <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-yellow-500/20 rounded-full">
            <Award className="w-8 h-8 text-yellow-400" />
          </div>

          {/* Badge unlocked text */}
          <p className="text-yellow-400 text-sm font-medium uppercase tracking-wider mb-2">
            Badge Unlocked!
          </p>

          {/* Badge icon */}
          <div className="text-6xl mb-4 animate-bounce-slow">
            {newBadge.icon}
          </div>

          {/* Badge name */}
          <h3 className="text-2xl font-bold text-white mb-2">
            {newBadge.name}
          </h3>

          {/* Badge description */}
          <p className="text-slate-400">
            {newBadge.description}
          </p>

          {/* Dismiss button */}
          <button
            onClick={dismissNewBadge}
            className="mt-6 px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-medium rounded-lg transition-colors"
          >
            Awesome!
          </button>
        </div>

        {/* Confetti-like decorations */}
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-yellow-500 rounded-full animate-ping" />
        <div className="absolute -top-1 -right-3 w-3 h-3 bg-orange-500 rounded-full animate-ping delay-100" />
        <div className="absolute -bottom-2 left-1/4 w-3 h-3 bg-yellow-400 rounded-full animate-ping delay-200" />
        <div className="absolute -bottom-1 right-1/3 w-2 h-2 bg-orange-400 rounded-full animate-ping delay-300" />
      </div>
    </div>
  );
};

export default BadgeUnlockNotification;
