function Cards({ children, id }) {
  return (
    <article
      className="card d-flex flex-sm-column flex-md-row align-items-center  pt-3 px-4 px-lg-5 mb-4 list-flex"
      key={id}
      style={{ outline: "1px solid #f4f4f4" }}
    >
      {children}
    </article>
  );
}

export default Cards;
