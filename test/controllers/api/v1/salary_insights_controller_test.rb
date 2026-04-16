require "test_helper"

class Api::V1::SalaryInsightsControllerTest < ActionDispatch::IntegrationTest
  test "should return salary insights" do
    get api_v1_salary_insights_url
    assert_response :success
    body = JSON.parse(response.body)

    assert body.key?("country_summary")
    assert body.key?("job_title_average")
    assert body.key?("top_paid_by_country")
    assert body.key?("salary_distribution")
  end

  test "should filter salary insights by country" do
    get api_v1_salary_insights_url, params: { country: employees(:one).country }
    assert_response :success
    body = JSON.parse(response.body)

    assert body["job_title_average"].all? { |item| item.key?("job_title") }
  end
end
