/**
 * AchievementBadges Component
 * Displays user's earned badges and progress towards locked badges
 */

import { useState } from 'react';
import { useAchievements } from '@contexts/AchievementContext';
import { BADGE_CATEGORIES, getBadgesByCategory } from '@data/achievements';
import Card from '@components/common/Card';
import { Award, Lock, ChevronDown, ChevronUp } from 'lucide-react';

const categoryLabels = {
  [BADGE_CATEGORIES.GETTING_STARTED]: 'Getting Started',
  [BADGE_CATEGORIES.BUDGETING]: 'Budgeting',
  [BADGE_CATEGORIES.SAVINGS]: 'Savings',
  [BADGE_CATEGORIES.COMMUNITY]: 'Community',
  [BADGE_CATEGORIES.CONSISTENCY]: 'Consistency',
};

const BadgeItem = ({ badge, isUnlocked, progress }) => {
  return (
    <div
      className={`relative p-4 rounded-xl border transition-all duration-300 ${
        isUnlocked
          ? 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30 hover:border-yellow-500/50'
          : 'bg-slate-800/50 border-slate-700 opacity-60 hover:opacity-80'
      }`}
    >
      {/* Badge Icon */}
      <div className="flex items-start gap-3">
        <div
          className={`text-4xl ${isUnlocked ? '' : 'grayscale opacity-50'}`}
        >
          {badge.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className={`font-semibold ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
              {badge.name}
            </h4>
            {!isUnlocked && (
              <Lock className="w-3.5 h-3.5 text-slate-500" />
            )}
          </div>
          <p className="text-sm text-slate-400 mt-0.5">{badge.description}</p>

          {/* Progress bar for locked badges */}
          {!isUnlocked && progress && progress.target > 0 && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Progress</span>
                <span>{progress.current}/{progress.target}</span>
              </div>
              <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Unlocked indicator */}
      {isUnlocked && (
        <div className="absolute top-2 right-2">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

const CategorySection = ({ category, badges, unlockedBadges, getBadgeProgress }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const unlockedInCategory = badges.filter((b) => unlockedBadges.includes(b.id)).length;

  return (
    <div className="space-y-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-white">
            {categoryLabels[category]}
          </span>
          <span className="text-sm text-slate-400">
            {unlockedInCategory}/{badges.length}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {badges.map((badge) => (
            <BadgeItem
              key={badge.id}
              badge={badge}
              isUnlocked={unlockedBadges.includes(badge.id)}
              progress={getBadgeProgress(badge.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const AchievementBadges = () => {
  const { unlockedBadges, getUnlockedBadges, stats, getBadgeProgress } = useAchievements();

  const totalBadges = Object.values(BADGE_CATEGORIES).reduce(
    (sum, cat) => sum + getBadgesByCategory(cat).length,
    0
  );

  const progressPercentage = totalBadges > 0 ? (unlockedBadges.length / totalBadges) * 100 : 0;

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-yellow-500/20 rounded-lg">
            <Award className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Achievements</h3>
            <p className="text-sm text-slate-400">
              {unlockedBadges.length} of {totalBadges} badges unlocked
            </p>
          </div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-slate-400">Overall Progress</span>
          <span className="text-white font-medium">{progressPercentage.toFixed(0)}%</span>
        </div>
        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-slate-800/50 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">{stats.transactionCount}</div>
          <div className="text-xs text-slate-400">Transactions</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">{stats.goalCount}</div>
          <div className="text-xs text-slate-400">Goals Created</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">{stats.postCount}</div>
          <div className="text-xs text-slate-400">Posts</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-400">{stats.currentStreak}</div>
          <div className="text-xs text-slate-400">Day Streak</div>
        </div>
      </div>

      {/* Badge Categories */}
      <div className="space-y-4">
        {Object.values(BADGE_CATEGORIES).map((category) => (
          <CategorySection
            key={category}
            category={category}
            badges={getBadgesByCategory(category)}
            unlockedBadges={unlockedBadges}
            getBadgeProgress={getBadgeProgress}
          />
        ))}
      </div>
    </Card>
  );
};

export default AchievementBadges;
