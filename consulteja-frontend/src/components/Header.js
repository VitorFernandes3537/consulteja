import React from "react";

function Header({ onOpenProductsModal }) {
  return (
    <header className="app-header py-3 mb-2 border-bottom bg-white shadow-sm">
      <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
        <div className="d-flex align-items-center gap-2">
          <img
            src="/assets/logo-icon-consulteja.png"
            alt="Logo ConsulteJá"
            className="logo-consulteja"
          />
          <div>
            <h1 className="h4 mb-0 fw-bold text-primary">ConsulteJá</h1>
            <p className="text-muted mb-0 small">
              Consulta rápida de produtos pelo código de barras.
            </p>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-light border-0 rounded-pill px-3 py-2 text-primary fw-semibold shadow-sm d-flex align-items-center gap-2"
          onClick={onOpenProductsModal}
        >
          <div className="d-flex align-items-center">
            <i className="bi bi-list-ul fs-5 me-2"></i>
          </div>
          <span>
            Lista todos os produtos
          </span>
        </button>
      </div>
    </header>
  );
}

export default Header;
