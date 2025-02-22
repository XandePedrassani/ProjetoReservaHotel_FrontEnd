import React, { useEffect, useState } from "react";
import Select from 'react-select';
const ReservaForm = () => {
    const [dtIn, setDtIn] = useState('');
    const [dtOut, setDtOut] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [clientes, setClientes] = useState([]);
    const [carregandoClientes, setCarregandoClientes] = useState(true)
    const [errorClientes, setErrorClientes] = useState(null);
    const [quartos, setQuartos] = useState([]);
    const [carregandoQuartos, setCarregandoQuartos] = useState(true)
    const [errorQuartos, setErrorQuartos] = useState(null);
    const [QuartoSelecionado, setQuartoSelecionado] = useState('');
    const [clienteSelecionado, setClienteSelecionado] = useState([]);


    // Buscar clientes/quartos ao carregar o componente
    useEffect(() => {
        const token = localStorage.getItem('token');
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

        const fetchQuartos = async () => {
            try {
                const response = await fetch('http://localhost:8081/api/quartos', {
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
                setQuartos(data);
            } catch (error) {
                console.error("Error fetching quartos:", error);
                setErrorQuartos(error); // Store the error object
            } finally {
                setCarregandoQuartos(false);
            }
        };

        fetchClientes();
        fetchQuartos();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:8081/api/reservas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    dtInicio: dtIn,
                    dtSaida: dtOut,
                    quarto_id: parseInt(QuartoSelecionado),
                    clientes: clienteSelecionado
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`${response.status} - ${errorData?.message || response.statusText}`);
            }

            const data = await response.json();
            setMensagem('Reserva criada com sucesso!');
            // Limpar o formulário após o sucesso (opcional)
            setDtIn('');
            setDtOut('');
            setQuartoSelecionado('');
            setClienteSelecionado([]);

        } catch (error) {
            console.error("Error creating reserva:", error);
            setMensagem(`Erro ao criar reserva: ${error.message}`); // Exibe a mensagem de erro
        }
    };

    const handleClientSelect = (event) => {
        const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
        setClienteSelecionado(selectedOptions);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Data Entrada</label>
                    <input type="date" value={dtIn} onChange={e => setDtIn(e.target.value)} required />
                </div>
                <div>
                    <label>Data Saída</label>
                    <input type="date" value={dtOut} onChange={e => setDtOut(e.target.value)} required />
                </div>
                <div>
                    <label>Clientes</label>
                    {carregandoClientes ? (
                        <p>Carregando clientes...</p>
                    ) : errorClientes ? (
                        <p style={{ color: 'red' }}>Erro ao carregar clientes: {errorClientes.message}</p>
                    ) : (
                        <select multiple value={clienteSelecionado} onChange={handleClientSelect} required>
                            {clientes.map(cliente => (
                                <option key={cliente.id} value={cliente.id}>
                                    {cliente.nome}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
                <div>
                    <label>Quarto</label>
                    {carregandoQuartos ? (
                        <p>Carregando quartos...</p>
                    ) : errorQuartos ? (
                        <p style={{ color: 'red' }}>Erro ao carregar quartos: {errorQuartos.message}</p>
                    ) : (
                        <select value={QuartoSelecionado} onChange={e => setQuartoSelecionado(e.target.value)} required>
                            <option value="">Selecione um quarto</option>
                            {quartos.map(quarto => (
                                <option key={quarto.id} value={quarto.id}>
                                    {quarto.descricao}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
                <button type="submit">Criar Reserva</button>
            </form>
            {mensagem && <p>{mensagem}</p>}
        </div>
    );    
}

export default ReservaForm;
