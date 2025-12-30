/**
 * GoalProgress Component
 * Visual progress bar for savings goals
 */

const GoalProgress = ({
  currentAmount,
  targetAmount,
  size = 'md',
  showLabels = true,
  animated = true,
}) => {
  const progress = Math.min((currentAmount / targetAmount) * 100, 100);

  // Determine color based on progress
  const getProgressColor = () => {
    if (progress >= 100) return 'from-green-500 to-green-400';
    if (progress >= 75) return 'from-blue-500 to-blue-400';
    if (progress >= 50) return 'from-yellow-500 to-yellow-400';
    return 'from-red-500 to-red-400';
  };

  const getBgColor = () => {
    if (progress >= 100) return 'bg-green-500/20';
    if (progress >= 75) return 'bg-blue-500/20';
    if (progress >= 50) return 'bg-yellow-500/20';
    return 'bg-red-500/20';
  };

  // Size configurations
  const heights = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className={`relative w-full ${heights[size]} ${getBgColor()} rounded-full overflow-hidden`}>
        <div
          className={`h-full bg-gradient-to-r ${getProgressColor()} rounded-full ${
            animated ? 'transition-all duration-500 ease-out' : ''
          } ${progress >= 95 && progress < 100 && animated ? 'animate-pulse' : ''}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Labels */}
      {showLabels && (
        <div className={`flex items-center justify-between mt-1 ${textSizes[size]}`}>
          <span className="text-slate-400">
            {progress.toFixed(1)}%
          </span>
          {progress >= 100 && (
            <span className="text-green-400 font-semibold">✓ Goal Achieved!</span>
          )}
        </div>
      )}
    </div>
  );
};

export default GoalProgress;
