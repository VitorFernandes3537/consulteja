import React from 'react';

function SearchForm({ codigo, setCodigo, onSearch, loading }) {
  function handleSubmit(e) {
    e.preventDefault();
    onSearch();
  }

  return (
    <form onSubmit={handleSubmit}>
      <label className="form-label fw-semibold">Código de barras</label>
      <div className="input-group input-group-lg mb-2">
        <input
          type="text"
          className="form-control"
          placeholder="Digite ou escaneie o código..."
          value={codigo}
          onChange={e => setCodigo(e.target.value)}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Consultando...' : 'Consultar'}
        </button>
      </div>
      <div className="form-text">
        Compatível com leitores de código de barras que “digitam” direto no campo.
      </div>
    </form>
  );
}

export default SearchForm;
