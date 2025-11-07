import React from 'react';

function HistoryList({ historico, onSelect }) {
  return (
    <div className="card border-0 shadow-sm rounded-4 mb-4">
      <div className="card-body p-3 p-md-4">
        <h2 className="h6 fw-bold mb-3">Histórico de consultas</h2>
        {historico.length === 0 && (
          <p className="text-muted mb-0">
            Nenhuma consulta realizada ainda.
          </p>
        )}
        {historico.length > 0 && (
          <ul className="list-group list-group-flush history-list">
            {historico.map(item => (
              <li
                key={item.codigo}
                className="list-group-item d-flex flex-column align-items-start history-item"
                onClick={() => onSelect(item)}
              >
                <div className="d-flex w-100 justify-content-between align-items-center">
                  <strong>{item.nome}</strong>
                  <span className="text-primary small fw-semibold">
                    {item.codigo}
                  </span>
                </div>
                <small className="text-muted">
                  Consultado em {item.consultadoEm}
                </small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default HistoryList;
