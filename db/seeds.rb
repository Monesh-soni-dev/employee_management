puts "Seeding employees..."

first_names = File.read(Rails.root.join('db', 'seeds', 'first_names.txt')).split("\n").map(&:strip).reject(&:blank?)
last_names = File.read(Rails.root.join('db', 'seeds', 'last_names.txt')).split("\n").map(&:strip).reject(&:blank?)

job_titles = [
  'Software Engineer',
  'Product Manager',
  'Data Analyst',
  'Sales Executive',
  'HR Specialist',
  'Operations Lead',
  'Finance Analyst',
  'Customer Success Manager',
  'DevOps Engineer',
  'UX Designer'
]

countries = [
  'United States',
  'Canada',
  'United Kingdom',
  'Germany',
  'India',
  'Mexico',
  'Australia',
  'Brazil'
]

departments = ['Engineering', 'Product', 'Finance', 'Sales', 'People Ops', 'Operations', 'Customer Success', 'Design']

Employee.delete_all

employees = []
seeded_at = Time.current

10_000.times do |index|
  first_name = first_names.sample
  last_name = last_names.sample
  full_name = "#{first_name} #{last_name}"
  email = "#{first_name.downcase}.#{last_name.downcase}.#{index}@example.com"
  salary = (35_000 + rand * 185_000).round(2)

  employees << {
    full_name: full_name,
    job_title: job_titles.sample,
    country: countries.sample,
    department: departments.sample,
    email: email,
    salary: salary,
    created_at: seeded_at,
    updated_at: seeded_at
  }
end

employees.each_slice(1000) do |batch|
  Employee.insert_all(batch)
end

puts "Seeded #{Employee.count} employees."
