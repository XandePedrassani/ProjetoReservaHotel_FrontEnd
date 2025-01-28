import React, { useState } from 'react';

const UsuarioForm = () => {
    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');
    const [tipo, setTipo] = useState('');
    const [mensagem, setMensagem] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token'); // Obter token do localStorage

        try {
            const response = await fetch('http://localhost:8081/api/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Adicionar token aos cabeçalhos
                },
                body: JSON.stringify({ login, senha, tipo })
            });

            if (!response.ok) {
                throw new Error('Erro ao criar usuário');
            }

            const data = await response.json();
            console.log('Usuário criado:', data);
            setMensagem('Usuário cadastrado com sucesso!');
            // Limpar os campos após o usuário ser cadastrado
            setLogin('');
            setSenha('');
            setTipo('');
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            setMensagem('Erro ao cadastrar usuário');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Login</label>
                    <input type="text" value={login} onChange={e => setLogin(e.target.value)} required />
                </div>
                <div>
                    <label>Senha</label>
                    <input type="password" value={senha} onChange={e => setSenha(e.target.value)} required />
                </div>
                <div>
                    <label>Tipo</label>
                    <input type="number" value={tipo} onChange={e => setTipo(e.target.value)} required />
                </div>
                <button type="submit">Criar Usuário</button>
            </form>
            {mensagem && <p>{mensagem}</p>}
        </div>
    );
};

export default UsuarioForm;
