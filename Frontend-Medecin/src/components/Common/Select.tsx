import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  helperText,
  options,
  placeholder = 'Sélectionner...',
  className = '',
  id,
  ...props
}, ref) => {
  const { colors } = useTheme();
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = `${selectId}-error`;
  const helperId = `${selectId}-helper`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium mb-1.5"
          style={{ color: colors.text.secondary }}
        >
          {label}
          {props.required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={`
            w-full px-4 py-2.5 pr-10 rounded-lg border
            transition-all duration-200 appearance-none cursor-pointer
            focus:outline-none focus:ring-2 focus:border-transparent
            disabled:cursor-not-allowed
            ${className}
          `}
          style={{
            backgroundColor: colors.bg.secondary,
            color: colors.text.primary,
            borderColor: error ? '#EF4444' : colors.border.default
          }}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
          style={{ color: colors.text.muted }}
          aria-hidden="true"
        />
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={helperId} className="mt-1.5 text-sm" style={{ color: colors.text.muted }}>
          {helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;

