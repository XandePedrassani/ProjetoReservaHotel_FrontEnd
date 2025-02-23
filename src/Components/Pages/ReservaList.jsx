import React, { useState, useEffect } from 'react';

function ReservaList() {
    const [reservas, setReservas] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);

    const [clientes, setClientes] = useState([]);
    const [carregandoClientes, setCarregandoClientes] = useState(true)
    const [errorClientes, setErrorClientes] = useState(null);
    const [pagadorSelecionadoEditando, setPagadorSelecionadoEditando] = useState('');

    const [editandoReserva, setEditandoReserva] = useState(null);


    useEffect(() => {
        const token = localStorage.getItem('token');

        fetch('http://localhost:8081/api/reservas', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(resp => {
            if (!resp.ok) {
                throw new Error('Falha ao obter reservas');
            }
            return resp.json();
        })
        .then(data => setReservas(data))
        .catch(err => setErro(err))
        .finally(() => setCarregando(false));

        const fetchClientes = async () => {
            try {
                const response = await fetch('http://localhost:8081/api/clientes', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`${response.status} - ${errorData?.message || response.statusText}`);
                }
                const data = await response.json();
                setClientes(data);
            } catch (error) {
                console.error("Error fetching clientes:", error);
                setErrorClientes(error); // Store the error object
            } finally {
                setCarregandoClientes(false);
            }
        };
        fetchClientes();
    }, []);

    const handleDelete = (id) => {
        const token = localStorage.getItem('token');

        fetch(`http://localhost:8081/api/reservas/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then((resp) => {
            if (!resp.ok) {
                throw new Error('Falha ao excluir reserva');
            }
            setReservas(reservas.filter((reserva) => reserva.id !== id));
        })
        .catch((err) => console.error(err));
    };

    const handleEdit = (id, dtInicio, dtSaida, quarto, clientes, pagador) => {
        setEditandoReserva(id)
        setPagadorSelecionadoEditando(pagador)
    };

    // Função para cancelar a edição
    const cancelarEdicao = () => {
        setEditandoReserva(null)
        setPagadorSelecionadoEditando('')
    };

    const salvarEdicao = (id) => {
        const token = localStorage.getItem('token');
    
        fetch(`http://localhost:8081/api/reservas/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                pagador_id: parseInt(pagadorSelecionadoEditando)
            })
        })
        .then((resp) => {
            if (!resp.ok) {
                throw new Error('Falha ao editar reserva');
            }
            setEditandoReserva(null);
            const token = localStorage.getItem('token');

            fetch('http://localhost:8081/api/reservas', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(resp => {
                if (!resp.ok) {
                    throw new Error('Falha ao obter reservas');
                }
                return resp.json();
            })
            .then(data => setReservas(data))
            .catch(err => setErro(err))
            .finally(() => setCarregando(false));

        })
        .catch((err) => console.error(err));
    };

    if (carregando) {
        return <p>Carregando reservas...</p>;
    }

    if (erro) {
        return <p>Erro ao carregar reservas: {erro.message}</p>;
    }

    return (
        <div>
            <h1>Lista de Reservas</h1>
            <table>
                <thead>
                    <tr>
                        <th>Data Entrada</th>
                        <th>Data Saída</th>
                        <th>Quarto</th>
                        <th>Clientes</th>
                        <th>Pagador</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {reservas.map((reserva) => (
                        <tr key={reserva.id}>
                            <td>{new Date(reserva.dtInicio).toLocaleDateString()}</td>
                            <td>{new Date(reserva.dtSaida).toLocaleDateString()}</td>
                            <td>{reserva.quarto.descricao}</td>
                            <td>
                                {reserva.clientes.map(cliente => (
                                    <span key={cliente.id}>{cliente.nome}, </span>
                                ))}
                            </td>

                            <td>
                                {editandoReserva === reserva.id ? (
                                <select value={pagadorSelecionadoEditando} onChange={e => setPagadorSelecionadoEditando(e.target.value)} required>
                                    <option value="">Selecione um pagador</option>
                                    {clientes.map(cliente => (
                                        <option key={cliente.id} value={cliente.id}>
                                            {cliente.nome}
                                        </option>
                                    ))}
                                </select>
                                ) : (
                                    reserva.pagador.nome
                                )}
                            </td>

                            <td>
                                {editandoReserva === reserva.id ? (
                                    <>
                                        <button onClick={() => salvarEdicao(reserva.id)}>Salvar</button>
                                        <button onClick={cancelarEdicao}>Cancelar</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => handleEdit(reserva.id, reserva.dtInicio, reserva.dtSaida, reserva.quarto.descricao, reserva.clientes, reserva.pagador.id)}>
                                            Editar
                                        </button>
                                        <button onClick={() => handleDelete(reserva.id)}>Excluir</button>
                                    </>
                                )}
                            </td>                            
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ReservaList;