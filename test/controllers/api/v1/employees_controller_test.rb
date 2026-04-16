require "test_helper"

class Api::V1::EmployeesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @employee = employees(:one)
  end

  test "should get index" do
    get api_v1_employees_url
    assert_response :success
    body = JSON.parse(response.body)
    assert body["employees"].is_a?(Array)
    assert_equal 2, body["meta"]["total_count"]
  end

  test "should search employees" do
    get api_v1_employees_url, params: { search: "Jane" }
    assert_response :success
    assert_equal "Jane Doe", JSON.parse(response.body)["employees"].first["full_name"]
  end

  test "should create employee" do
    employee_params = {
      employee: {
        full_name: "New User",
        job_title: "QA Engineer",
        country: "Canada",
        salary: 72000,
        email: "new.user@example.com",
        department: "Quality"
      }
    }

    assert_difference("Employee.count", 1) do
      post api_v1_employees_url, params: employee_params, as: :json
    end

    assert_response :created
    assert_equal "New User", JSON.parse(response.body)["full_name"]
  end

  test "should update employee" do
    patch api_v1_employee_url(@employee), params: {
      employee: { job_title: "Senior Engineer" }
    }, as: :json

    assert_response :success
    assert_equal "Senior Engineer", JSON.parse(response.body)["job_title"]
  end

  test "should destroy employee" do
    assert_difference("Employee.count", -1) do
      delete api_v1_employee_url(@employee), as: :json
    end

    assert_response :no_content
  end
end
