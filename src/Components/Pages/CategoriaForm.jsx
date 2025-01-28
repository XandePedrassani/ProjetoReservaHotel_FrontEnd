import React, { useState } from 'react';

const CategoriaForm = () => {
    const [nome, setNome] = useState('');
    const [mensagem, setMensagem] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token'); // Obter token do localStorage

        try {
            const response = await fetch('http://localhost:8081/api/categorias', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Adicionar token aos cabeçalhos
                },
                body: JSON.stringify({ nome })
            });

            if (!response.ok) {
                throw new Error('Erro ao criar categoria');
            }

            const data = await response.json();
            console.log('Categoria criada:', data);
            setMensagem('Categoria cadastrada com sucesso!');
            // Limpar o campo de nome após a categoria ser cadastrada
            setNome('');
        } catch (error) {
            console.error('Erro ao criar categoria:', error);
            setMensagem('Erro ao cadastrar categoria');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nome</label>
                    <input type="text" value={nome} onChange={e => setNome(e.target.value)} />
                </div>
                <button type="submit">Criar Categoria</button>
            </form>
            {mensagem && <p>{mensagem}</p>}
        </div>
    );
};

export default CategoriaForm;
