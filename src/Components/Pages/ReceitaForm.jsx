import React, { useState, useEffect } from 'react';

const ReceitaForm = () => {
    const [nome, setNome] = useState('');
    const [ingredientes, setIngredientes] = useState('');
    const [preparo, setPreparo] = useState('');
    const [imagem, setImagem] = useState('');
    const [categoriaId, setCategoriaId] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [receitas, setReceitas] = useState([]);
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');

        // Fetch receitas
        fetch('http://localhost:8081/api/receitas', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then((resp) => {
            if (!resp.ok) {
                throw new Error('Falha ao obter receitas');
            }
            return resp.json();
        })
        .then((data) => setReceitas(data))
        .catch((err) => console.error(err));

        // Fetch categorias
        fetch('http://localhost:8081/api/categorias', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then((resp) => {
            if (!resp.ok) {
                throw new Error('Falha ao obter categorias');
            }
            return resp.json();
        })
        .then((data) => setCategorias(data))
        .catch((err) => console.error(err));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:8081/api/receitas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ nome, ingredientes, preparo, imagem, categoriaId })
            });

            if (!response.ok) {
                throw new Error('Erro ao criar receita');
            }

            const data = await response.json();
            console.log('Receita criada:', data);
            setMensagem('Receita cadastrada com sucesso!');
            // Limpar os campos do formulário após a receita ser cadastrada
            setNome('');
            setIngredientes('');
            setPreparo('');
            setImagem('');
            setCategoriaId('');
            // Atualizar a lista de receitas
            setReceitas([...receitas, data]);
        } catch (error) {
            console.error('Erro ao criar receita:', error);
            setMensagem('Erro ao cadastrar receita');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nome</label>
                    <input type="text" value={nome} onChange={e => setNome(e.target.value)} required />
                </div>
                <div>
                    <label>Ingredientes</label>
                    <textarea value={ingredientes} onChange={e => setIngredientes(e.target.value)} required />
                </div>
                <div>
                    <label>Preparo</label>
                    <textarea value={preparo} onChange={e => setPreparo(e.target.value)} required />
                </div>
                <div>
                    <label>Imagem</label>
                    <input type="text" value={imagem} onChange={e => setImagem(e.target.value)} />
                </div>
                <div>
                    <label>Categoria</label>
                    <select value={categoriaId} onChange={e => setCategoriaId(e.target.value)} required>
                        <option value="">Selecione uma categoria</option>
                        {categorias.map((categoria) => (
                            <option key={categoria.id} value={categoria.id}>
                                {categoria.nome}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit">Criar Receita</button>
            </form>
            {mensagem && <p>{mensagem}</p>}

            <h2>Receitas Cadastradas</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Ingredientes</th>
                        <th>Preparo</th>
                        <th>Imagem</th>
                        <th>Categoria ID</th>
                    </tr>
                </thead>
                <tbody>
                    {receitas.map((receita) => (
                        <tr key={receita.id}>
                            <td>{receita.nome}</td>
                            <td>{receita.ingredientes}</td>
                            <td>{receita.preparo}</td>
                            <td>{receita.imagem}</td>
                            <td>{receita.categoriaId}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReceitaForm;
