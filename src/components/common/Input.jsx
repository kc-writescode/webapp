/**
 * Input Component
 * Reusable input field with validation and error states
 */

import React, { forwardRef, useRef, useImperativeHandle } from 'react';

const Input = forwardRef(({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  helpText,
  icon: Icon,
  iconPosition = 'left',
  required = false,
  disabled = false,
  className = '',
  inputClassName = '',
  onIconClick,
  ...props
}, ref) => {
  const inputRef = useRef(null);

  // Forward the ref while also keeping our internal ref
  useImperativeHandle(ref, () => inputRef.current);

  const baseInputStyles = 'w-full bg-slate-900/50 border rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-500 transition-all duration-200 focus:outline-none focus:ring-2';

  const stateStyles = error
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50'
    : 'border-slate-700 focus:border-blue-500 focus:ring-blue-500/50';

  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';

  const iconClass = Icon ? (iconPosition === 'left' ? 'pl-11' : 'pr-11') : '';

  // Handle icon click - for date inputs, open the picker
  const handleIconClick = () => {
    if (onIconClick) {
      onIconClick();
    } else if (type === 'date' && inputRef.current) {
      inputRef.current.showPicker?.();
    }
  };

  const isClickableIcon = onIconClick || type === 'date';

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-slate-300 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && iconPosition === 'left' && (
          <div
            className={`absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 ${isClickableIcon ? 'cursor-pointer hover:text-slate-200 transition-colors' : ''}`}
            onClick={isClickableIcon ? handleIconClick : undefined}
          >
            <Icon size={20} />
          </div>
        )}

        <input
          ref={inputRef}
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`${baseInputStyles} ${stateStyles} ${disabledStyles} ${iconClass} ${inputClassName}`}
          {...props}
        />

        {Icon && iconPosition === 'right' && (
          <div
            className={`absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 ${isClickableIcon ? 'cursor-pointer hover:text-slate-200 transition-colors' : ''}`}
            onClick={isClickableIcon ? handleIconClick : undefined}
          >
            <Icon size={20} />
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1">
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}

      {helpText && !error && (
        <p className="mt-1.5 text-sm text-slate-400">
          {helpText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
