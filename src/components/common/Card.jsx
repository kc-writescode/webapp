/**
 * Card Component
 * Reusable card container with glassmorphism effect
 */

import React from 'react';

const Card = ({
  children,
  title,
  subtitle,
  icon: Icon,
  action,
  variant = 'default',
  padding = 'default',
  hover = false,
  className = '',
  ...props
}) => {
  const variants = {
    default: 'bg-slate-800/50 backdrop-blur-sm border border-slate-700',
    glass: 'bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-md border border-slate-700/50',
    gradient: 'bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-sm border border-blue-700/30',
    solid: 'bg-slate-800 border border-slate-700',
  };

  const paddings = {
    none: '',
    sm: 'p-3',
    default: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  const hoverClass = hover ? 'hover:shadow-xl hover:border-blue-500/50 transition-all duration-300 cursor-pointer' : '';

  const variantClass = variants[variant] || variants.default;
  const paddingClass = paddings[padding] || paddings.default;

  return (
    <div
      className={`rounded-xl shadow-lg ${variantClass} ${paddingClass} ${hoverClass} ${className}`}
      {...props}
    >
      {(title || subtitle || Icon || action) && (
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            {Icon && (
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Icon size={24} className="text-blue-400" />
              </div>
            )}
            <div className="flex-1">
              {title && (
                <h3 className="text-lg sm:text-xl font-bold text-slate-100">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm text-slate-400 mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {action && (
            <div className="ml-4">
              {action}
            </div>
          )}
        </div>
      )}
      <div>
        {children}
      </div>
    </div>
  );
};

export default Card;
