import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary: 'bg-gold-400 hover:bg-gold-300 text-ink-900 shadow-lg shadow-gold-400/20',
  secondary: 'bg-ink-900 hover:bg-ink-800 text-white',
  outline: 'border-2 border-ink-900 text-ink-900 hover:bg-ink-900 hover:text-white',
  ghost: 'text-ink-900 hover:bg-ink-50',
};

const SIZES = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

/**
 * Universal tugma — `to` berilsa Link, `href` berilsa <a>, aks holda <button>.
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  isLoading = false,
  className = '',
  ...props
}) {
  const baseClasses = `inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

  const content = (
    <>
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={baseClasses}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={baseClasses} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return (
    <button className={baseClasses} disabled={isLoading} {...props}>
      {content}
    </button>
  );
}
