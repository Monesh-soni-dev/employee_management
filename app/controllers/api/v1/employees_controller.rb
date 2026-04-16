module Api
  module V1
    class EmployeesController < BaseController
      def index
        results = EmployeeSearchService.new(search_params).results

        render json: {
          employees: results.employees.map { |employee| EmployeeSerializer.new(employee).as_json },
          meta: {
            page: results.page,
            per_page: results.per_page,
            total_count: results.total_count
          }
        }
      end

      def show
        render json: EmployeeSerializer.new(employee).as_json
      end

      def create
        employee = Employee.create!(employee_params)
        render json: EmployeeSerializer.new(employee).as_json, status: :created
      end

      def update
        employee.update!(employee_params)
        render json: EmployeeSerializer.new(employee).as_json
      end

      def destroy
        employee.destroy
        head :no_content
      end

      private

      def employee
        @employee ||= Employee.find(params[:id])
      end

      def employee_params
        params.require(:employee).permit(:full_name, :job_title, :country, :salary, :email, :department)
      end

      def search_params
        params.permit(:search, :country, :page, :per_page)
      end
    end
  end
end
