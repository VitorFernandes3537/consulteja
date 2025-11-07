import React, { useState } from 'react';

function NewProductForm({ apiBaseUrl, onProdutoCriado }) {
    const [codigo, setCodigo] = useState('');
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [preco, setPreco] = useState('');
    const [imagemUrl, setImagemUrl] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState('success');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setMensagem('');
        setLoading(true);

        try {
            const resp = await fetch(`${apiBaseUrl}/produtos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    codigo,
                    nome,
                    descricao,
                    preco,
                    imagemUrl,
                }),
            });

            const data = await resp.json();

            if (!resp.ok) {
                setTipoMensagem('danger');
                setMensagem(data.mensagem || 'Erro ao cadastrar produto.');
            } else {
                setTipoMensagem('success');
                setMensagem('Produto cadastrado com sucesso!');
                onProdutoCriado(data);
                setCodigo('');
                setNome('');
                setDescricao('');
                setPreco('');
                setImagemUrl('');
            }
        } catch (e) {
            console.error(e);
            setTipoMensagem('danger');
            setMensagem('Falha na comunicação com a API.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-3 p-md-4">
                <h2 className="h6 fw-bold mb-3">Admin • Cadastrar produto</h2>
                <form onSubmit={handleSubmit} className="new-product-form">
                    <div className="mb-2">
                        <label className="form-label">Código de barras</label>
                        <input
                            className="form-control form-control-sm"
                            value={codigo}
                            onChange={e => setCodigo(e.target.value)}
                        />
                    </div>
                    <div className="mb-2">
                        <label className="form-label">Nome</label>
                        <input
                            className="form-control form-control-sm"
                            value={nome}
                            onChange={e => setNome(e.target.value)}
                        />
                    </div>
                    <div className="mb-2">
                        <label className="form-label">Descrição</label>
                        <textarea
                            className="form-control form-control-sm"
                            rows="2"
                            value={descricao}
                            onChange={e => setDescricao(e.target.value)}
                        />
                    </div>
                    <div className="mb-2">
                        <label className="form-label">Preço (R$)</label>
                        <input
                            type="number"
                            step="0.01"
                            className="form-control form-control-sm"
                            value={preco}
                            onChange={e => setPreco(e.target.value)}
                            placeholder="Digite apenas números ex:(15 → R$15,00) ou com vírgulas"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">
                            URL da imagem (opcional)
                        </label>
                        <input
                            className="form-control form-control-sm"
                            value={imagemUrl}
                            onChange={e => setImagemUrl(e.target.value)}
                            placeholder="Ex: cafe.webp ou https://..."
                        />
                        <small className="text-muted">
                            Se informar apenas o nome (ex: <strong>cafe.webp</strong>), a imagem será buscada em <code>/assets</code>.
                        </small>
                    </div>
                    <button
                        type="submit"
                        className="btn btn-outline-primary btn-sm w-100"
                        disabled={loading}
                    >
                        {loading ? 'Salvando...' : 'Cadastrar produto'}
                    </button>
                </form>

                {mensagem && (
                    <div className={`alert alert-${tipoMensagem} mt-3 mb-0`} role="alert">
                        {mensagem}
                    </div>
                )}
            </div>
        </div>
    );
}

export default NewProductForm;
