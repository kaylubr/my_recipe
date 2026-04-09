const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-image" />
    <div className="skeleton-body">
      <div className="skeleton-line skeleton-line--title" />
      <div className="skeleton-line skeleton-line--short" />
      <div className="skeleton-button" />
    </div>
  </div>
)

const SkeletonGrid = ({ count = 8 }) => (
  <div className="recipe-grid">
    {Array.from({ length: count }, (_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
)

const SkeletonDetail = () => (
  <div className="detail-page">
    <div className="skeleton-line skeleton-line--back" />
    <div className="skeleton-detail-header">
      <div className="skeleton-line skeleton-line--heading" />
      <div className="skeleton-circle" />
    </div>
    <div className="skeleton-tags">
      <div className="skeleton-tag" />
      <div className="skeleton-tag" />
    </div>
    <div className="skeleton-detail-image" />
    <div className="skeleton-section">
      <div className="skeleton-line skeleton-line--section-title" />
      <div className="skeleton-ingredients">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="skeleton-ingredient" />
        ))}
      </div>
    </div>
    <div className="skeleton-section">
      <div className="skeleton-line skeleton-line--section-title" />
      <div className="skeleton-line skeleton-line--text" />
      <div className="skeleton-line skeleton-line--text" />
      <div className="skeleton-line skeleton-line--text" />
      <div className="skeleton-line skeleton-line--text skeleton-line--short" />
    </div>
  </div>
)

export { SkeletonCard, SkeletonGrid, SkeletonDetail }
