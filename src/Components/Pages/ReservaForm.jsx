import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ReservaForm = () => {
  const [dtIn, setDtIn] = useState(null);
  const [dtOut, setDtOut] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const [clientes, setClientes] = useState([]);
  const [carregandoClientes, setCarregandoClientes] = useState(true);
  const [errorClientes, setErrorClientes] = useState(null);
  const [quartos, setQuartos] = useState([]);
  const [carregandoQuartos, setCarregandoQuartos] = useState(true);
  const [errorQuartos, setErrorQuartos] = useState(null);
  const [QuartoSelecionado, setQuartoSelecionado] = useState('');
  const [clienteSelecionado, setClienteSelecionado] = useState([]);
  const [reservedIntervals, setReservedIntervals] = useState([]);
  const [pagadorSelecionado, setPagadorSelecionado] = useState('');
  const [formErrors, setFormErrors] = useState({});

  // Buscar clientes e quartos ao carregar o componente
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
        setErrorClientes(error);
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
        setErrorQuartos(error);
      } finally {
        setCarregandoQuartos(false);
      }
    };

    fetchClientes();
    fetchQuartos();
  }, []);

  // Quando o quarto selecionado mudar, busca as reservas existentes para esse quarto
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (QuartoSelecionado) {
      fetch(`http://localhost:8081/api/reservas?quarto_id=${QuartoSelecionado}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => response.json())
        .then(data => {
          // Converte as datas para objetos Date
          const intervals = data.map(reserva => ({
            start: new Date(reserva.dtInicio),
            end: new Date(reserva.dtSaida)
          }));
          setReservedIntervals(intervals);
        })
        .catch(err => {
          console.error("Error fetching reservations for room:", err);
          setReservedIntervals([]);
        });
    } else {
      setReservedIntervals([]);
    }
  }, [QuartoSelecionado]);

  // Função para checar se uma data está disponível
  const isDateAvailable = (date) => {
    for (let interval of reservedIntervals) {
      if (date >= interval.start && date < interval.end) {
        return false;
      }
    }
    return true;
  };

  const validaDados = () => {
    let errors = {};
    let isValid = true;

    if (!dtIn) {
      errors.dtIn = "Data de entrada é obrigatória.";
      isValid = false;
    }

    if (!dtOut) {
      errors.dtOut = "Data de saída é obrigatória.";
      isValid = false;
    }

    if (!QuartoSelecionado) {
      errors.quarto = "Quarto é obrigatório.";
      isValid = false;
    }

    if (clienteSelecionado.length === 0 || clienteSelecionado.length > 3) {
      errors.clientes = "Pelo menos um e no máximo 3 clientes devem ser selecionados.";
      isValid = false;
    }

    if (!clienteSelecionado.includes(pagadorSelecionado)) {
      errors.pagador = "Cliente pagador deve estar incluso nos clientes selecionados.";
      isValid = false;
    }

    if (!pagadorSelecionado) {
      errors.pagador = "Pagador é obrigatório.";
      isValid = false;
    }

    if (!(dtIn instanceof Date) || !(dtOut instanceof Date)) {
      errors.dtIn = "Datas inválidas.";
      errors.dtOut = "Datas inválidas.";
      isValid = false;
    } else if (dtOut <= dtIn) {
      errors.dtOut = "Data de saída deve ser posterior à data de entrada.";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validaDados()) { 
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:8081/api/reservas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          dtInicio: dtIn.toISOString().split('T')[0],
          dtSaida: dtOut.toISOString().split('T')[0],
          quarto_id: parseInt(QuartoSelecionado),
          clientes: clienteSelecionado,
          pagador_id: parseInt(pagadorSelecionado)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || response.statusText);
      }

      const data = await response.json();
      setMensagem('Reserva criada com sucesso!');
      // Limpar o formulário após o sucesso
      setDtIn(null);
      setDtOut(null);
      setQuartoSelecionado('');
      setClienteSelecionado([]);
      setPagadorSelecionado('');
      setReservedIntervals([]);
    } catch (error) {
      console.error("Erro ao criar reserva:", error);
      setMensagem(`${error.message}`);
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
          <DatePicker
            selected={dtIn}
            onChange={(date) => setDtIn(date)}
            placeholderText="Selecione a data de entrada"
            dateFormat="yyyy-MM-dd"
            filterDate={isDateAvailable}
          />
          {formErrors.dtIn && <p className="error">{formErrors.dtIn}</p>}
        </div>
        <div>
          <label>Data Saída</label>
          <DatePicker
            selected={dtOut}
            onChange={(date) => setDtOut(date)}
            placeholderText="Selecione a data de saída"
            dateFormat="yyyy-MM-dd"
            minDate={dtIn ? new Date(dtIn.getTime() + 86400000) : new Date()}
            filterDate={isDateAvailable}
          />
          {formErrors.dtOut && <p className="error">{formErrors.dtOut}</p>}
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
          {formErrors.clientes && <p className="error">{formErrors.clientes}</p>}
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
          {formErrors.quarto && <p className="error">{formErrors.quarto}</p>}
        </div>
        <div>
          <label>Pagador:</label>
          {carregandoClientes ? (
            <p>Carregando clientes...</p>
          ) : errorClientes ? (
            <p style={{ color: 'red' }}>Erro ao carregar clientes: {errorClientes.message}</p>
          ) : (
            <select value={pagadorSelecionado} onChange={e => setPagadorSelecionado(e.target.value)} required>
              <option value="">Selecione um pagador</option>
              {clientes.map(cliente => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome}
                </option>
              ))}
            </select>
          )}
          {formErrors.pagador && <p className="error">{formErrors.pagador}</p>}
        </div>
        <button type="submit">Criar Reserva</button>
      </form>
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
};

export default ReservaForm;
