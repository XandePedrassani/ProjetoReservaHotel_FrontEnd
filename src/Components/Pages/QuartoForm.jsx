import React, { useState } from 'react';

const QuartoForm = () => {
    const [ocupacaoMaxima, setOcupacaoMaxima] = useState('');
    const [ramal, setRamal] = useState('');
    const [descricao, setDescricao] = useState('');
    const [mensagem, setMensagem] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:8081/api/quartos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ocupacaoMaxima, ramal, descricao })
            });

            if (!response.ok) {
                throw new Error('Erro ao criar quarto');
            }

            const data = await response.json();
            console.log('Quarto criado:', data);
            setMensagem('Quarto cadastrado com sucesso!');
            setOcupacaoMaxima('');
            setRamal('');
            setDescricao('');
        } catch (error) {
            console.error('Erro ao criar quarto:', error);
            setMensagem('Erro ao cadastrar quarto');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Ocupação Máxima</label>
                    <input
                        type="number"
                        value={ocupacaoMaxima}
                        onChange={e => setOcupacaoMaxima(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Ramal</label>
                    <input
                        type="text"
                        value={ramal}
                        onChange={e => setRamal(e.target.value)}
                    />
                </div>
                <div>
                    <label>Descrição</label>
                    <textarea
                        value={descricao}
                        onChange={e => setDescricao(e.target.value)}
                    />
                </div>
                <button type="submit">Criar Quarto</button>
            </form>
            {mensagem && <p>{mensagem}</p>}
        </div>
    );
};

export default QuartoForm;