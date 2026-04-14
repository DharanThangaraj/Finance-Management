const Table = ({ columns, data, renderRow }) => {
  return (
    <div className="overflow-x-auto rounded-[28px] border border-slate-200 bg-white/95 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
      <table className="min-w-full divide-y divide-slate-200 text-sm text-slate-700">
        <thead className="bg-slate-50 text-left text-slate-600">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-4 font-semibold">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">{data.map(renderRow)}</tbody>
      </table>
    </div>
  );
};

export default Table;
