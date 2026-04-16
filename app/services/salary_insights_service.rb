class SalaryInsightsService
  RANGE_DEFINITIONS = [
    { label: 'Under 40k', condition: 'salary < 40000' },
    { label: '40k-80k', condition: 'salary >= 40000 AND salary < 80000' },
    { label: '80k-120k', condition: 'salary >= 80000 AND salary < 120000' },
    { label: '120k-200k', condition: 'salary >= 120000 AND salary < 200000' },
    { label: '200k+', condition: 'salary >= 200000' }
  ].freeze

  def initialize(country: nil)
    @country = country
  end

  def execute
    Rails.cache.fetch(cache_key, expires_in: 5.minutes) do
      {
        country_summary: country_summary,
        job_title_average: job_title_average,
        top_paid_by_country: top_paid_by_country,
        salary_distribution: salary_distribution
      }
    end
  end

  private

  def cache_key
    ["salary_insights", @country.presence || 'all'].join('/')
  end

  def base_scope
    scope = Employee.all
    scope = scope.where(country: @country) if @country.present?
    scope
  end

  def country_summary
    Employee.group(:country)
      .select(
        :country,
        'MIN(salary) AS min_salary',
        'MAX(salary) AS max_salary',
        'AVG(salary) AS avg_salary',
        'COUNT(*) AS employee_count'
      )
      .order(:country)
      .map do |row|
        {
          country: row.country,
          min_salary: row.min_salary.to_f,
          max_salary: row.max_salary.to_f,
          avg_salary: row.avg_salary.to_f.round(2),
          employee_count: row.employee_count.to_i
        }
      end
  end

  def job_title_average
    scope = base_scope
    scope.group(:job_title)
      .select('job_title', 'AVG(salary) AS avg_salary')
      .order('avg_salary DESC')
      .map do |row|
        {
          job_title: row.job_title,
          avg_salary: row.avg_salary.to_f.round(2)
        }
      end
  end

  def top_paid_by_country
    ranked_sql = base_scope.select(
      'id',
      'full_name',
      'job_title',
      'country',
      'department',
      'email',
      'salary',
      'ROW_NUMBER() OVER (PARTITION BY country ORDER BY salary DESC) AS row_number'
    ).to_sql

    Employee.from("(#{ranked_sql}) AS ranked_employees")
      .select('ranked_employees.*')
      .where('row_number <= 5')
      .order('country ASC, salary DESC')
      .map do |row|
        {
          id: row.id,
          full_name: row.full_name,
          job_title: row.job_title,
          country: row.country,
          department: row.department,
          email: row.email,
          salary: row.salary.to_f
        }
      end
      .group_by { |row| row[:country] }
  end

  def salary_distribution
    rows = base_scope
      .select("CASE
        WHEN salary < 40000 THEN 'Under 40k'
        WHEN salary < 80000 THEN '40k-80k'
        WHEN salary < 120000 THEN '80k-120k'
        WHEN salary < 200000 THEN '120k-200k'
        ELSE '200k+'
      END AS range_label, COUNT(*) AS count")
      .group('range_label')
      .order('range_label')

    counts = rows.each_with_object({}) do |row, hash|
      hash[row.range_label] = row.count.to_i
    end

    RANGE_DEFINITIONS.map do |range_definition|
      {
        range: range_definition[:label],
        count: counts.fetch(range_definition[:label], 0)
      }
    end
  end
end
