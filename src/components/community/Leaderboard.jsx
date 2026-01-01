/**
 * Leaderboard Component
 * Shows top contributors by upvotes and posts
 */

import { useMemo } from 'react';
import { useCommunity } from '@contexts/CommunityContext';
import { Crown, Medal, ThumbsUp } from 'lucide-react';
import Card from '@components/common/Card';

const Leaderboard = () => {
  const { posts } = useCommunity();

  // Calculate engagement score for each user based on their posts
  const topContributors = useMemo(() => {
    const userStats = {};

    posts.forEach((post) => {
      const userId = post.userId;
      if (!userStats[userId]) {
        userStats[userId] = {
          userId,
          username: post.username,
          avatar: post.avatar,
          postCount: 0,
          totalUpvotes: 0,
        };
      }

      userStats[userId].postCount += 1;
      userStats[userId].totalUpvotes += post.upvotes;
    });

    // Sort by total upvotes (then by post count if same)
    return Object.values(userStats)
      .sort((a, b) => {
        if (b.totalUpvotes !== a.totalUpvotes) return b.totalUpvotes - a.totalUpvotes;
        return b.postCount - a.postCount;
      })
      .slice(0, 5);
  }, [posts]);

  if (topContributors.length === 0) {
    return null;
  }

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <Crown className="w-4 h-4 text-yellow-400" />;
      case 1:
        return <Medal className="w-4 h-4 text-slate-300" />;
      case 2:
        return <Medal className="w-4 h-4 text-amber-600" />;
      default:
        return <span className="w-4 h-4 text-center text-xs text-slate-500">{index + 1}</span>;
    }
  };

  const getRankStyle = (index) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30';
      case 1:
        return 'bg-slate-800/50 border-slate-500/30';
      case 2:
        return 'bg-gradient-to-r from-amber-700/20 to-amber-600/20 border-amber-600/30';
      default:
        return 'bg-slate-800/30 border-slate-700';
    }
  };

  return (
    <Card title="Top Contributors" icon={Crown}>
      <div className="space-y-2">
        {topContributors.map((contributor, index) => (
          <div
            key={contributor.userId}
            className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all ${getRankStyle(index)}`}
          >
            {/* Rank */}
            <div className="flex-shrink-0 w-6 flex justify-center">
              {getRankIcon(index)}
            </div>

            {/* Avatar */}
            <img
              src={contributor.avatar}
              alt={contributor.username}
              className="w-8 h-8 rounded-full flex-shrink-0"
            />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {contributor.username}
              </p>
              <p className="text-xs text-slate-400">
                {contributor.postCount} post{contributor.postCount !== 1 && 's'}
              </p>
            </div>

            {/* Upvotes */}
            <div className="flex items-center gap-1 text-green-400">
              <ThumbsUp className="w-3.5 h-3.5" />
              <span className="text-sm font-bold">{contributor.totalUpvotes}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default Leaderboard;
