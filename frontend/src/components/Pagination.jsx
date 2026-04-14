const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  for (let page = 1; page <= totalPages; page += 1) {
    pages.push(page);
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm">
      <button
        type="button"
        className="rounded-2xl px-3 py-2 transition hover:bg-slate-200"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        Prev
      </button>
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          className={`rounded-2xl px-3 py-2 transition ${page === currentPage ? 'bg-slate-900 text-white' : 'hover:bg-slate-200'}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        className="rounded-2xl px-3 py-2 transition hover:bg-slate-200"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
