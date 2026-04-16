require 'ostruct'

class EmployeeSearchService
  DEFAULT_PER_PAGE = 25
  MAX_PER_PAGE = 100

  def initialize(params = {})
    @params = params.to_h.deep_symbolize_keys
  end

  def results
    scoped = Employee.all
    scoped = scoped.search(@params[:search])
    scoped = scoped.by_country(@params[:country])
    total = scoped.count
    scoped = scoped.ordered.paginated(page: page, per_page: per_page)

    OpenStruct.new(
      employees: scoped,
      total_count: total,
      page: page,
      per_page: per_page
    )
  end

  private

  def page
    [@params[:page].to_i, 1].max
  end

  def per_page
    per_page_value = @params[:per_page].to_i.nonzero? || DEFAULT_PER_PAGE
    [[per_page_value, 1].max, MAX_PER_PAGE].min
  end
end
