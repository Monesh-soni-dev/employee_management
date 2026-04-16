class EmployeeSerializer
  def initialize(employee)
    @employee = employee
  end

  def as_json(*_args)
    {
      id: @employee.id,
      full_name: @employee.full_name,
      email: @employee.email,
      job_title: @employee.job_title,
      department: @employee.department,
      country: @employee.country,
      salary: @employee.salary.to_f,
      created_at: @employee.created_at.iso8601,
      updated_at: @employee.updated_at.iso8601
    }
  end
end
