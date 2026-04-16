import { useEffect, useState } from 'react';

const initialState = {
  full_name: '',
  job_title: '',
  country: '',
  department: '',
  email: '',
  salary: '',
};

export default function EmployeeForm({ employee, onCancel, onSubmit }) {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (employee) {
      setForm({
        full_name: employee.full_name,
        job_title: employee.job_title,
        country: employee.country,
        department: employee.department,
        email: employee.email,
        salary: employee.salary,
      });
    } else {
      setForm(initialState);
    }
  }, [employee]);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = { ...form, salary: Number(form.salary) };

    if (employee) {
      onSubmit(employee.id, payload);
    } else {
      onSubmit(payload);
    }
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{employee ? 'Edit Employee' : 'Add Employee'}</h2>
          <p className="text-sm text-slate-500">Complete all required fields and save.</p>
        </div>
        <button className="text-sm text-slate-500 hover:text-slate-800" onClick={onCancel}>
          Cancel
        </button>
      </div>

      <form className="grid gap-4" onSubmit={handleSubmit}>
        {['full_name', 'job_title', 'country', 'department', 'email', 'salary'].map((field) => (
          <label key={field} className="block text-sm text-slate-700">
            <span className="mb-2 block font-medium">{field.replace('_', ' ').toUpperCase()}</span>
            <input
              type={field === 'salary' ? 'number' : 'text'}
              step={field === 'salary' ? '0.01' : undefined}
              value={form[field]}
              onChange={(event) => handleChange(field, event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-sky-500 focus:outline-none"
              required
            />
          </label>
        ))}

        <button className="mt-3 rounded-2xl bg-sky-600 px-5 py-3 font-semibold text-white hover:bg-sky-700">
          Save Employee
        </button>
      </form>
    </div>
  );
}
