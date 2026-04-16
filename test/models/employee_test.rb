require "test_helper"

class EmployeeTest < ActiveSupport::TestCase
  test "valid employee is valid" do
    employee = employees(:one)
    assert employee.valid?
  end

  test "requires full_name job_title country department email and salary" do
    employee = Employee.new

    assert_not employee.valid?
    assert_includes employee.errors[:full_name], "can't be blank"
    assert_includes employee.errors[:job_title], "can't be blank"
    assert_includes employee.errors[:country], "can't be blank"
    assert_includes employee.errors[:department], "can't be blank"
    assert_includes employee.errors[:email], "can't be blank"
    assert_includes employee.errors[:salary], "can't be blank"
  end

  test "salary must be greater than zero" do
    employee = employees(:one)
    employee.salary = 0

    assert_not employee.valid?
    assert_includes employee.errors[:salary], "must be greater than 0"
  end

  test "email must be unique" do
    duplicate = employees(:one).dup
    duplicate.email = employees(:one).email.upcase

    assert_not duplicate.valid?
    assert_includes duplicate.errors[:email], "has already been taken"
  end
end
