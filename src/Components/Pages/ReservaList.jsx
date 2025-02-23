import React, { useState, useEffect } from 'react';

function ReservaList() {
    const [reservas, setReservas] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);

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
    }, []);

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
                        <th>ID</th>
                        <th>Data Entrada</th>
                        <th>Data Saída</th>
                        <th>Quarto</th>
                        <th>Clientes</th>
                        <th>Pagador</th>
                    </tr>
                </thead>
                <tbody>
                    {reservas.map(reserva => (
                        <tr key={reserva.id}>
                            <td>{reserva.id}</td>
                            <td>{new Date(reserva.dtInicio).toLocaleDateString()}</td>
                            <td>{new Date(reserva.dtSaida).toLocaleDateString()}</td>
                            <td>{reserva.quarto.descricao}</td>
                            <td>
                                {reserva.clientes.map(cliente => (
                                    <span key={cliente.id}>{cliente.nome}, </span>
                                ))}
                            </td>
                            <td>{reserva.pagador.nome}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ReservaList;