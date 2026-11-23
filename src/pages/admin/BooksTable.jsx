// BooksTable — таблиця всіх книг з кнопкою «Видалити» (tpl-admin-row з лабораторної).
// Сама нічого не завантажує й не видаляє: отримує books і повідомляє батька через onDelete.
export default function BooksTable({ books, onDelete }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Назва</th>
            <th scope="col">Автор</th>
            <th scope="col">ISBN</th>
            <th scope="col" className="table__num">Ціна, грн</th>
            <th scope="col"><span className="visually-hidden">Дії</span></th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book.id}>
              <td className="admin-row__title">{book.title}</td>
              <td className="admin-row__author">{book.author}</td>
              <td className="admin-row__isbn">{book.isbn}</td>
              <td className="table__num admin-row__price">{Number(book.price).toFixed(2)}</td>
              <td className="table__actions">
                <button className="btn btn--danger btn--sm" type="button" aria-label={`Видалити «${book.title}»`}
                  onClick={() => onDelete(book)}>
                  Видалити
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
