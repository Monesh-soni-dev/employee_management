export default function SalaryInsights({ insights, country, onCountryChange }) {
  const countries = ['', 'United States', 'Canada', 'United Kingdom', 'Germany', 'India', 'Mexico', 'Australia'];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Salary Insights</h2>
          <p className="text-sm text-slate-500">Aggregated reports for countries and roles.</p>
        </div>
        <select
          value={country}
          onChange={(event) => onCountryChange(event.target.value)}
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-sky-500 focus:outline-none"
        >
          {countries.map((option) => (
            <option key={option} value={option}>
              {option || 'All countries'}
            </option>
          ))}
        </select>
      </div>

      {!insights ? (
        <div className="rounded-3xl bg-slate-50 p-6 text-center text-slate-500">Loading insights...</div>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Job Title Averages</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {insights.job_title_average.slice(0, 5).map((item) => (
                  <li key={item.job_title} className="flex justify-between">
                    <span>{item.job_title}</span>
                    <strong>${item.avg_salary.toLocaleString()}</strong>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Salary Distribution</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {insights.salary_distribution.map((range) => (
                  <li key={range.range} className="flex justify-between">
                    <span>{range.range}</span>
                    <strong>{range.count}</strong>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Top Paid Employees by Country</h3>
            {Object.entries(insights.top_paid_by_country).map(([countryKey, employees]) => (
              <div key={countryKey} className="mb-4">
                <h4 className="text-sm font-semibold">{countryKey}</h4>
                <ul className="mt-2 space-y-2 text-sm text-slate-700">
                  {employees.map((employee) => (
                    <li key={employee.id} className="flex justify-between rounded-2xl bg-white px-3 py-2 shadow-sm">
                      <span>{employee.full_name} — {employee.job_title}</span>
                      <strong>${employee.salary.toLocaleString()}</strong>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
