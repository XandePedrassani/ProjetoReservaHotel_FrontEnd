import React, { useState, useEffect } from 'react';

function ReceitaList() {
    const [receitas, setReceitas] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentReceita, setCurrentReceita] = useState({
        id: '',
        nome: '',
        ingredientes: '',
        preparo: '',
        imagem: '',
        categoriaId: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('token');

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
        .catch((err) => console.log(err));
    }, []);

    const handleDelete = (id) => {
        const token = localStorage.getItem('token');

        fetch(`http://localhost:8081/api/receitas/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then((resp) => {
            if (!resp.ok) {
                throw new Error('Falha ao excluir receita');
            }
            setReceitas(receitas.filter((receita) => receita.id !== id));
        })
        .catch((err) => console.error(err));
    };

    const handleEditClick = (receita) => {
        setCurrentReceita(receita);
        setIsEditMode(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setCurrentReceita((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        fetch(`http://localhost:8081/api/receitas/${currentReceita.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(currentReceita)
        })
        .then((resp) => {
            if (!resp.ok) {
                throw new Error('Falha ao editar receita');
            }
            return resp.json();
        })
        .then((data) => {
            setReceitas(receitas.map((receita) => (receita.id === data.id ? data : receita)));
            setIsEditMode(false);
        })
        .catch((err) => console.error(err));
    };

    return (
        <>
            <h1>Listar Receitas </h1>
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Ingredientes</th>
                        <th>Preparo</th>
                        <th>Imagem</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {receitas.map((receita) => (
                        <tr key={receita.id}>
                            <td>{receita.nome}</td>
                            <td>{receita.ingredientes}</td>
                            <td>{receita.preparo}</td>
                            <td>{receita.imagem}</td>
                            <td>
                                <button onClick={() => handleEditClick(receita)}>Editar</button>
                                <button onClick={() => handleDelete(receita.id)}>Excluir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isEditMode && (
                <div className="modal">
                    <form onSubmit={handleEditSubmit}>
                        <div>
                            <label>Nome</label>
                            <input
                                type="text"
                                name="nome"
                                value={currentReceita.nome}
                                onChange={handleEditChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Ingredientes</label>
                            <textarea
                                name="ingredientes"
                                value={currentReceita.ingredientes}
                                onChange={handleEditChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Preparo</label>
                            <textarea
                                name="preparo"
                                value={currentReceita.preparo}
                                onChange={handleEditChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Imagem</label>
                            <input
                                type="text"
                                name="imagem"
                                value={currentReceita.imagem}
                                onChange={handleEditChange}
                            />
                        </div>
                        <div>
                            <label>Categoria ID</label>
                            <input
                                type="text"
                                name="categoriaId"
                                value={currentReceita.categoriaId}
                                onChange={handleEditChange}
                                required
                            />
                        </div>
                        <button type="submit">Salvar</button>
                        <button type="button" onClick={() => setIsEditMode(false)}>Cancelar</button>
                    </form>
                </div>
            )}
        </>
    );
}

export default ReceitaList;
