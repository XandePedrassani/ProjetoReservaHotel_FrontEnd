import React, { useState, useEffect } from 'react';

const ReceitaListByCategoria = () => {
    const [categorias, setCategorias] = useState([]);
    const [categoriaId, setCategoriaId] = useState('');
    const [receitas, setReceitas] = useState([]);
    const [mensagem, setMensagem] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');

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

    const handleCategoriaChange = (e) => {
        const selectedCategoriaId = e.target.value;
        setCategoriaId(selectedCategoriaId);
        const token = localStorage.getItem('token');

        // Fetch receitas by categoria
        fetch(`http://localhost:8081/api/categorias/${selectedCategoriaId}/receitas`, {
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
        .catch((err) => {
            console.error(err);
            setMensagem('Erro ao buscar receitas');
        });
    };

    return (
        <div>
            <h2>Selecione uma Categoria</h2>
            <div>
                <label>Categoria</label>
                <select value={categoriaId} onChange={handleCategoriaChange} required>
                    <option value="">Selecione uma categoria</option>
                    {categorias.map((categoria) => (
                        <option key={categoria.id} value={categoria.id}>
                            {categoria.nome}
                        </option>
                    ))}
                </select>
            </div>

            {mensagem && <p>{mensagem}</p>}

            <h2>Receitas por Categoria</h2>
            {receitas.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Ingredientes</th>
                            <th>Preparo</th>
                            <th>Imagem</th>
                        </tr>
                    </thead>
                    <tbody>
                        {receitas.map((receita) => (
                            <tr key={receita.id}>
                                <td>{receita.nome}</td>
                                <td>{receita.ingredientes}</td>
                                <td>{receita.preparo}</td>
                                <td>{receita.imagem}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Nenhuma receita encontrada para essa categoria.</p>
            )}
        </div>
    );
};

export default ReceitaListByCategoria;
