const Loader = ({ text = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center gap-3 rounded-[24px] border border-slate-200 bg-white/95 px-6 py-5 text-slate-700 shadow-sm">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700"></div>
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
};

export default Loader;
