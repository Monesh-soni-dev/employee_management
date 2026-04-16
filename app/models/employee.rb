class Employee < ApplicationRecord
  validates :full_name, :job_title, :country, :department, :email, :salary, presence: true
  validates :email, uniqueness: { case_sensitive: false }
  validates :salary, numericality: { greater_than: 0 }

  scope :search, ->(term) {
    where(
      "LOWER(full_name) LIKE :term OR LOWER(job_title) LIKE :term OR LOWER(country) LIKE :term",
      term: "%#{term.to_s.downcase}%"
    ) if term.present?
  }
  scope :by_country, ->(country) { where(country: country) if country.present? }
  scope :ordered, -> { order(:full_name) }

  after_commit :clear_salary_insights_cache

  def self.paginated(page:, per_page:)
    page = [page.to_i, 1].max
    per_page = [[per_page.to_i, 1].max, 100].min
    offset((page - 1) * per_page).limit(per_page)
  end

  private

  def clear_salary_insights_cache
    Rails.cache.delete_matched('salary_insights/*')
  end
end
