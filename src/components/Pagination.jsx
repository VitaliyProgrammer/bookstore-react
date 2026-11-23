// Pagination — кнопки сторінок каталогу (renderPagination з лабораторної).
// page рахується з 0, як у Spring Pageable, а людині показуємо з 1.
export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return (
    <nav className="pagination" aria-label="Сторінки каталогу">
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          type="button"
          className={i === page ? "pagination__link pagination__link--current" : "pagination__link"}
          aria-current={i === page ? "page" : undefined}
          onClick={() => onChange(i)}
        >
          {i + 1}
        </button>
      ))}
    </nav>
  );
}
