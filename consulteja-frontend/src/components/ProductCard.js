import React from 'react';

function ProductCard({ produto }) {
  return (
    <div className="card border-0 shadow-sm rounded-4 produto-card">
      <div className="row g-0">
        <div className="col-12 col-md-5">
          <div className="produto-img-wrapper">
            <img
              src={produto.imagemUrl}
              alt={produto.nome}
              className="img-fluid produto-img rounded-start-4"
            />
          </div>
        </div>
        <div className="col-12 col-md-7">
          <div className="card-body">
            <span className="badge bg-secondary-subtle text-secondary mb-2">
              Código: {produto.codigo}
            </span>
            <h2 className="h5 fw-bold">{produto.nome}</h2>
            <p className="text-muted mb-3">{produto.descricao}</p>
            <p className="h4 text-success fw-bold mb-0">
              R$ {Number(produto.preco).toFixed(2).replace('.', ',')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
