import { useEffect, useState } from 'react';
import {
  createEmployee,
  deleteEmployee,
  fetchEmployees,
  fetchSalaryInsights,
  updateEmployee,
} from './api/employeeApi';
import EmployeeForm from './components/EmployeeForm';
import EmployeeTable from './components/EmployeeTable';
import SalaryInsights from './components/SalaryInsights';

const DEFAULT_PER_PAGE = 25;

function App() {
  const [employees, setEmployees] = useState([]);
  const [meta, setMeta] = useState({ total_count: 0, page: 1, per_page: DEFAULT_PER_PAGE });
  const [filters, setFilters] = useState({ search: '', country: '' });
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editing, setEditing] = useState(false);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadEmployees = async (options = {}) => {
    setLoading(true);
    const currentFilters = options.filters || filters;
    const params = {
      page: options.page || meta.page,
      per_page: options.per_page || meta.per_page,
      search: currentFilters.search,
      country: currentFilters.country,
    };

    const response = await fetchEmployees(params);
    setEmployees(response.employees);
    setMeta(response.meta);
    setLoading(false);
  };

  const loadInsights = async (country = '') => {
    const response = await fetchSalaryInsights(country);
    setInsights(response);
  };

  useEffect(() => {
    loadEmployees({ page: 1 });
    loadInsights(filters.country);
  }, [filters.country]);

  const handleSearchChange = async (value) => {
    const nextFilters = { ...filters, search: value };
    setFilters(nextFilters);
    await loadEmployees({ page: 1, filters: nextFilters });
  };

  const handleCountryFilter = async (value) => {
    const nextFilters = { ...filters, country: value };
    setFilters(nextFilters);
    await loadEmployees({ page: 1, filters: nextFilters });
    await loadInsights(value);
  };

  const handlePageChange = (page) => {
    loadEmployees({ page });
  };

  const handleCreate = async (payload) => {
    try {
      await createEmployee(payload);
      setEditing(false);
      setSelectedEmployee(null);
      await loadEmployees({ page: 1 });
      await loadInsights(filters.country);
    } catch (error) {
      alert(error.response?.data?.errors?.join(', ') || 'Failed to create employee');
    }
  };

  const handleUpdate = async (id, payload) => {
    try {
      await updateEmployee(id, payload);
      setEditing(false);
      setSelectedEmployee(null);
      await loadEmployees();
      await loadInsights(filters.country);
    } catch (error) {
      alert(error.response?.data?.errors?.join(', ') || 'Failed to update employee');
    }
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setEditing(true);
  };

  const handleDelete = async (id) => {
    await deleteEmployee(id);
    await loadEmployees();
    await loadInsights(filters.country);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold">Salary Management Tool</h1>
          <p className="mt-2 text-slate-600">Manage employees, search, paginate, and review salary insights.</p>
        </header>

        <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-soft">
              <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-2">
                  <h2 className="text-xl font-semibold">Employees</h2>
                  <p className="text-sm text-slate-500">Search by name, job title, or country.</p>
                </div>
                <button
                  className="rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
                  onClick={() => {
                    setSelectedEmployee(null);
                    setEditing(true);
                  }}
                >
                  Add Employee
                </button>
              </div>

              <EmployeeTable
                employees={employees}
                meta={meta}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSearch={handleSearchChange}
                onCountryFilter={handleCountryFilter}
                onPageChange={handlePageChange}
                search={filters.search}
                country={filters.country}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-soft">
              <SalaryInsights
                insights={insights}
                country={filters.country}
                onCountryChange={handleCountryFilter}
              />
            </div>

            {editing && (
              <div className="rounded-3xl bg-white p-6 shadow-soft">
                <EmployeeForm
                  employee={selectedEmployee}
                  onCancel={() => {
                    setSelectedEmployee(null);
                    setEditing(false);
                  }}
                  onSubmit={selectedEmployee ? handleUpdate : handleCreate}
                />
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
