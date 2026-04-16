module Api
  module V1
    class SalaryInsightsController < BaseController
      def show
        insights = SalaryInsightsService.new(country: params[:country]).execute
        render json: insights
      end
    end
  end
end
