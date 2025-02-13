import React, { useState, useEffect } from 'react';

function ClienteList() {
    const [clientes, setClientes] = useState([]);
    const [editandoCliente, setEditandoCliente] = useState(null);
    const [nomeClienteEditado, setNomeClienteEditado] = useState('');
    const [emailClienteEditado, setEmailClienteEditado] = useState('');
    const [telefoneClienteEditado, setTelefoneClienteEditado] = useState('');
    const [enderecoClienteEditado, setEnderecoClienteEditado] = useState('');
    const [cpfClienteEditado, setCpfClienteEditado] = useState('');

    // Buscar clientes ao carregar o componente
    useEffect(() => {
        const token = localStorage.getItem('token');

        fetch('http://localhost:8081/api/clientes', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then((resp) => {
            if (!resp.ok) {
                throw new Error('Falha ao obter clientes');
            }
            return resp.json();
        })
        .then((data) => setClientes(data))
        .catch((err) => console.log(err));
    }, []);

    // Função para deletar um cliente
    const handleDelete = (id) => {
        const token = localStorage.getItem('token');

        fetch(`http://localhost:8081/api/clientes/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then((resp) => {
            if (!resp.ok) {
                throw new Error('Falha ao excluir cliente');
            }
            setClientes(clientes.filter((cliente) => cliente.id !== id));
        })
        .catch((err) => console.error(err));
    };

    // Função para iniciar a edição de um cliente
    const handleEdit = (id, nome, email, telefone, endereco, cpf) => {
        setEditandoCliente(id);
        setNomeClienteEditado(nome);
        setEmailClienteEditado(email);
        setTelefoneClienteEditado(telefone);
        setEnderecoClienteEditado(endereco);
        setCpfClienteEditado(cpf);
    };

    // Função para cancelar a edição
    const cancelarEdicao = () => {
        setEditandoCliente(null);
        setNomeClienteEditado('');
        setEmailClienteEditado('');
        setTelefoneClienteEditado('');
        setEnderecoClienteEditado('');
        setCpfClienteEditado('');
    };

    // Função para salvar a edição de um cliente
    const salvarEdicao = (id) => {
        const token = localStorage.getItem('token');
    
        fetch(`http://localhost:8081/api/clientes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                nome: nomeClienteEditado,
                email: emailClienteEditado,
                telefone: telefoneClienteEditado,
                endereco: enderecoClienteEditado,
                cpf: cpfClienteEditado
            })
        })
        .then((resp) => {
            if (!resp.ok) {
                throw new Error('Falha ao editar cliente');
            }
            setEditandoCliente(null);
            // Atualizar a lista de clientes após a edição
            setClientes(clientes.map((cliente) =>
                cliente.id === id
                    ? {
                          ...cliente,
                          nome: nomeClienteEditado,
                          email: emailClienteEditado,
                          telefone: telefoneClienteEditado,
                          endereco: enderecoClienteEditado,
                          cpf: cpfClienteEditado
                      }
                    : cliente
            )); // Fechando o parêntese e a chave corretamente
        })
        .catch((err) => console.error(err));
    };

    return (
        <>
            <h1>Listar Clientes</h1>
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Telefone</th>
                        <th>Endereço</th>
                        <th>CPF</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {clientes.map((cliente) => (
                        <tr key={cliente.id}>
                            <td>
                                {editandoCliente === cliente.id ? (
                                    <input
                                        type="text"
                                        value={nomeClienteEditado}
                                        onChange={(e) => setNomeClienteEditado(e.target.value)}
                                    />
                                ) : (
                                    cliente.nome
                                )}
                            </td>
                            <td>
                                {editandoCliente === cliente.id ? (
                                    <input
                                        type="email"
                                        value={emailClienteEditado}
                                        onChange={(e) => setEmailClienteEditado(e.target.value)}
                                    />
                                ) : (
                                    cliente.email
                                )}
                            </td>
                            <td>
                                {editandoCliente === cliente.id ? (
                                    <input
                                        type="text"
                                        value={telefoneClienteEditado}
                                        onChange={(e) => setTelefoneClienteEditado(e.target.value)}
                                    />
                                ) : (
                                    cliente.telefone
                                )}
                            </td>
                            <td>
                                {editandoCliente === cliente.id ? (
                                    <input
                                        type="text"
                                        value={enderecoClienteEditado}
                                        onChange={(e) => setEnderecoClienteEditado(e.target.value)}
                                    />
                                ) : (
                                    cliente.endereco
                                )}
                            </td>
                            <td>
                                {editandoCliente === cliente.id ? (
                                    <input
                                        type="text"
                                        value={cpfClienteEditado}
                                        onChange={(e) => setCpfClienteEditado(e.target.value)}
                                    />
                                ) : (
                                    cliente.cpf
                                )}
                            </td>
                            <td>
                                {editandoCliente === cliente.id ? (
                                    <>
                                        <button onClick={() => salvarEdicao(cliente.id)}>Salvar</button>
                                        <button onClick={cancelarEdicao}>Cancelar</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => handleEdit(cliente.id, cliente.nome, cliente.email, cliente.telefone, cliente.endereco, cliente.cpf)}>
                                            Editar
                                        </button>
                                        <button onClick={() => handleDelete(cliente.id)}>Excluir</button>
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

export default ClienteList;