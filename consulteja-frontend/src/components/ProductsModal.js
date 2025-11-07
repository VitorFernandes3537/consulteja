import React from "react";

function ProductsModal({ open, onClose, produtos }) {
  if (!open) return null;

  return (
    <div className="modal-backdrop-custom" onClick={onClose}>
      <div
        className="modal-card-custom"
        onClick={e => e.stopPropagation()} // não fecha ao clicar dentro
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h5 mb-0">Produtos cadastrados</h2>
          <button
            type="button"
            className="btn-close"
            aria-label="Fechar"
            onClick={onClose}
          ></button>
        </div>

        {(!produtos || produtos.length === 0) ? (
          <p className="text-muted mb-0">Nenhum produto cadastrado ainda.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Imagem</th>
                  <th>Código</th>
                  <th>Nome</th>
                  <th className="d-none d-md-table-cell">Descrição</th>
                  <th>Preço</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map(p => (
                  <tr key={p.codigo}>
                    <td>
                      <div className="lista-img-wrapper">
                        <img
                          src={p.imagemUrl}
                          alt={p.nome}
                          className="lista-img"
                        />
                      </div>
                    </td>
                    <td>{p.codigo}</td>
                    <td>{p.nome}</td>
                    <td
                      className="d-none d-md-table-cell text-truncate"
                      style={{ maxWidth: "260px" }}
                    >
                      {p.descricao}
                    </td>
                    <td>
                      R$ {Number(p.preco).toFixed(2).replace(".", ",")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductsModal;
