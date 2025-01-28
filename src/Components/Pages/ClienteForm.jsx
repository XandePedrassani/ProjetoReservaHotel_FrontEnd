import React, { useState } from 'react';

const ClienteForm = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [endereco, setEndereco] = useState('');
    const [cpf, setCpf] = useState('');
    const [mensagem, setMensagem] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token'); // Obter token do localStorage

        try {
            const response = await fetch('http://localhost:8081/api/clientes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Adicionar token aos cabeçalhos
                },
                body: JSON.stringify({ nome, email, telefone, endereco, cpf })
            });

            if (!response.ok) {
                throw new Error('Erro ao criar cliente');
            }

            const data = await response.json();
            console.log('Cliente criado:', data);
            setMensagem('Cliente cadastrado com sucesso!');
            // Limpar os campos após o cliente ser cadastrado
            setNome('');
            setEmail('');
            setTelefone('');
            setEndereco('');
            setCpf('');
        } catch (error) {
            console.error('Erro ao criar cliente:', error);
            setMensagem('Erro ao cadastrar cliente');
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
                    <label>Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Telefone</label>
                    <input type="text" value={telefone} onChange={e => setTelefone(e.target.value)} />
                </div>
                <div>
                    <label>Endereço</label>
                    <input type="text" value={endereco} onChange={e => setEndereco(e.target.value)} />
                </div>
                <div>
                    <label>CPF</label>
                    <input type="text" value={cpf} onChange={e => setCpf(e.target.value)} required />
                </div>
                <button type="submit">Criar Cliente</button>
            </form>
            {mensagem && <p>{mensagem}</p>}
        </div>
    );
};

export default ClienteForm;
