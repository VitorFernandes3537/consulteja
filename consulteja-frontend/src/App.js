import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import ProductCard from './components/ProductCard';
import HistoryList from './components/HistoryList';
import NewProductForm from './components/NewProductForm';
import ProductsModal from "./components/ProductsModal";


const API_BASE_URL = 'https://consulteja.onrender.com';

function App() {
  const [codigo, setCodigo] = useState('');
  const [produto, setProduto] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [produtosLista, setProdutosLista] = useState([]);
  const [modalProdutosAberto, setModalProdutosAberto] = useState(false);


  // Carrega histórico do localStorage
  useEffect(() => {
    const salvo = localStorage.getItem('historicoConsulteJa');
    if (salvo) {
      setHistorico(JSON.parse(salvo));
    }
  }, []);

  // Salva histórico
  useEffect(() => {
    localStorage.setItem('historicoConsulteJa', JSON.stringify(historico));
  }, [historico]);

  // Carrega todos os produtos (admin opcional)
  useEffect(() => {
    async function fetchProdutos() {
      try {
        const resp = await fetch(`${API_BASE_URL}/produtos`);
        const data = await resp.json();
        setProdutosLista(data);
      } catch (e) {
        console.error(e);
      }
    }
    fetchProdutos();
  }, []);

  async function handleSearch() {
    if (!codigo.trim()) return;

    setLoading(true);
    setErro('');
    setProduto(null);

    try {
      const resp = await fetch(
        `${API_BASE_URL}/produtos?codigo=${encodeURIComponent(codigo.trim())}`
      );
      if (!resp.ok) {
        if (resp.status === 404) {
          setErro('Produto não encontrado.');
        } else {
          setErro('Erro ao consultar produto.');
        }
        setLoading(false);
        return;
      }
      const data = await resp.json();
      setProduto(data);

      const novoRegistro = {
        codigo: data.codigo,
        nome: data.nome,
        consultadoEm: new Date().toLocaleString('pt-BR'),
      };

      setHistorico(prev => {
        const semDuplicados = prev.filter(item => item.codigo !== data.codigo);
        const atualizado = [novoRegistro, ...semDuplicados];
        return atualizado.slice(0, 10);
      });
    } catch (e) {
      console.error(e);
      setErro('Falha na comunicação com a API.');
    } finally {
      setLoading(false);
    }
  }

  function handleSelecionarHistorico(item) {
    setCodigo(item.codigo);
    setTimeout(() => {
      handleSearch();
    }, 0);
  }

  function handleProdutoCriado(novoProduto) {
    setProdutosLista(prev => [...prev, novoProduto]);
  }

  return (
    <div className="app-wrapper">
      <Header onOpenProductsModal={() => setModalProdutosAberto(true)} />

      <main className="container py-4">
        <div className="row g-4">
          <div className="col-12 col-lg-7">
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">
                <SearchForm
                  codigo={codigo}
                  setCodigo={setCodigo}
                  onSearch={handleSearch}
                  loading={loading}
                />

                {erro && (
                  <div className="alert alert-danger mt-3" role="alert">
                    {erro}
                  </div>
                )}

                {produto && (
                  <div className="mt-4">
                    <ProductCard produto={produto} />
                  </div>
                )}

                {!produto && !erro && !loading && (
                  <p className="text-muted mt-3">
                    Digite ou escaneie um código de barras e clique em{' '}
                    <strong>Consultar</strong>.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-5">
            <HistoryList
              historico={historico}
              onSelect={handleSelecionarHistorico}
            />

            <NewProductForm
              apiBaseUrl={API_BASE_URL}
              onProdutoCriado={handleProdutoCriado}
            />
          </div>
        </div>

        {produtosLista.length > 0 && (
          <section className="mt-5">
            <h2 className="h5 mb-3">Produtos cadastrados (admin)</h2>
            <div className="table-responsive">
              <table className="table table-sm align-middle">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Nome</th>
                    <th className="d-none d-md-table-cell">Preço</th>
                  </tr>
                </thead>
                <tbody>
                  {produtosLista.map(p => (
                    <tr key={p.codigo}>
                      <td>{p.codigo}</td>
                      <td>{p.nome}</td>
                      <td className="d-none d-md-table-cell">
                        R${' '}
                        {Number(p.preco).toFixed(2).replace('.', ',')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
      <footer className="app-footer text-center py-3">
        <small className="text-muted">ConsulteJá • Projeto Final React Vitor Fernandes</small>
      </footer>
      <ProductsModal
        open={modalProdutosAberto}
        onClose={() => setModalProdutosAberto(false)}
        produtos={produtosLista}
      />
    </div>
  );
}

export default App;
