const Card = ({ title, subtitle, children, className = '' }) => {
  return (
    <div className={`rounded-[28px] border border-slate-200 bg-white/95 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] ${className}`}>
      {(title || subtitle) && (
        <div className="mb-4 space-y-1">
          {title && <h2 className="text-xl font-semibold text-slate-950">{title}</h2>}
          {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
