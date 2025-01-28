import React, { useState, useEffect } from 'react';

function CategoriaList() {
    const [categorias, setCategorias] = useState([]);
    const [editandoCategoria, setEditandoCategoria] = useState(null);
    const [nomeCategoriaEditada, setNomeCategoriaEditada] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');

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
        .catch((err) => console.log(err));
    }, []);

    const handleDelete = (id) => {
        const token = localStorage.getItem('token');

        fetch(`http://localhost:8081/api/categorias/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then((resp) => {
            if (!resp.ok) {
                throw new Error('Falha ao excluir categoria');
            }
            setCategorias(categorias.filter((categoria) => categoria.id !== id));
        })
        .catch((err) => console.error(err));
    };

    const handleEdit = (id, nome) => {
        setEditandoCategoria(id);
        setNomeCategoriaEditada(nome);
    };

    const cancelarEdicao = () => {
        setEditandoCategoria(null);
        setNomeCategoriaEditada('');
    };

    const salvarEdicao = (id) => {
        const token = localStorage.getItem('token');

        fetch(`http://localhost:8081/api/categorias/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ nome: nomeCategoriaEditada })
        })
        .then((resp) => {
            if (!resp.ok) {
                throw new Error('Falha ao editar categoria');
            }
            setEditandoCategoria(null);
        })
        .catch((err) => console.error(err));
    };

    return (
        <>
            <h1>Listar Categorias </h1>
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {categorias.map((categoria) => (
                        <tr key={categoria.id}>
                            <td>
                                {editandoCategoria === categoria.id ? (
                                    <input
                                        type="text"
                                        value={nomeCategoriaEditada}
                                        onChange={(e) => setNomeCategoriaEditada(e.target.value)}
                                    />
                                ) : (
                                    categoria.nome
                                )}
                            </td>
                            <td>
                                {editandoCategoria === categoria.id ? (
                                    <>
                                        <button onClick={() => salvarEdicao(categoria.id)}>Salvar</button>
                                        <button onClick={cancelarEdicao}>Cancelar</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => handleEdit(categoria.id, categoria.nome)}>Editar</button>
                                        <button onClick={() => handleDelete(categoria.id)}>Excluir</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default CategoriaList;
