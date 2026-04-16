import { useEffect, useState } from 'react';

const countries = ['', 'United States', 'Canada', 'United Kingdom', 'Germany', 'India', 'Mexico', 'Australia'];

export default function EmployeeTable({
  employees,
  meta,
  loading,
  onEdit,
  onDelete,
  onSearch,
  onCountryFilter,
  onPageChange,
  search,
  country,
}) {
  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const onSubmitSearch = (event) => {
    event.preventDefault();
    onSearch(localSearch.trim());
  };

  const totalPages = Math.max(1, Math.ceil(meta.total_count / meta.per_page));

  return (
    <div className="space-y-4">
      <form className="grid gap-4 md:grid-cols-[1.4fr_0.8fr]" onSubmit={onSubmitSearch}>
        <input
          type="text"
          value={localSearch}
          onChange={(event) => setLocalSearch(event.target.value)}
          placeholder="Search name, job title, country"
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-sky-500 focus:outline-none"
        />
        <select
          value={country}
          onChange={(event) => onCountryFilter(event.target.value)}
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-sky-500 focus:outline-none"
        >
          {countries.map((option) => (
            <option key={option} value={option}>
              {option || 'All countries'}
            </option>
          ))}
        </select>
      </form>

      <div className="overflow-hidden rounded-3xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 bg-white text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 font-semibold text-slate-600">Name</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Job Title</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Country</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Department</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Salary</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-slate-500">
                  Loading employees...
                </td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-slate-500">
                  No employees found.
                </td>
              </tr>
            ) : (
              employees.map((employee) => (
                <tr key={employee.id}>
                  <td className="px-4 py-4">{employee.full_name}</td>
                  <td className="px-4 py-4">{employee.job_title}</td>
                  <td className="px-4 py-4">{employee.country}</td>
                  <td className="px-4 py-4">{employee.department}</td>
                  <td className="px-4 py-4">${employee.salary.toLocaleString()}</td>
                  <td className="px-4 py-4 space-x-2">
                    <button
                      className="rounded-lg border border-slate-200 px-3 py-1 text-sm text-slate-700 hover:bg-slate-100"
                      onClick={() => onEdit(employee)}
                    >
                      Edit
                    </button>
                    <button
                      className="rounded-lg bg-rose-500 px-3 py-1 text-sm text-white hover:bg-rose-600"
                      onClick={() => onDelete(employee.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>
          Page {meta.page} of {totalPages} · {meta.total_count} employees
        </span>

        <div className="flex items-center gap-2">
          <button
            disabled={meta.page <= 1}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => onPageChange(Math.max(1, meta.page - 1))}
          >
            Previous
          </button>
          <button
            disabled={meta.page >= totalPages}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => onPageChange(Math.min(totalPages, meta.page + 1))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
