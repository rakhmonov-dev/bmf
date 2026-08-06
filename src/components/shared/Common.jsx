export function SectionHeading({ eyebrow, title, subtitle, align = 'center' }) {
  const alignClass = align === 'left' ? 'text-left items-start' : 'text-center items-center';

  return (
    <div className={`flex flex-col ${alignClass} mb-14 md:mb-16`}>
      {eyebrow && (
        <span className="text-gold-600 text-xs font-semibold uppercase tracking-widest mb-3">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-display font-semibold text-ink-900 text-balance max-w-2xl">
        {title}
      </h2>
      {subtitle && (
        <p className="text-slate-500 mt-4 max-w-xl text-balance leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}

export function LoadingSpinner({ label = 'Yuklanmoqda...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div className="w-8 h-8 border-3 border-ink-100 border-t-gold-400 rounded-full animate-spin" />
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && <Icon className="w-10 h-10 text-slate-300 mb-4" />}
      <p className="font-medium text-slate-600">{title}</p>
      {description && <p className="text-sm text-slate-400 mt-1 max-w-sm">{description}</p>}
    </div>
  );
}
