import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DisponibilidadeQuartos = () => {
  const [dtIn, setDtIn] = useState(null);
  const [dtOut, setDtOut] = useState(null);
  const [quartos, setQuartos] = useState([]);
  const [carregandoQuartos, setCarregandoQuartos] = useState(true);
  const [errorQuartos, setErrorQuartos] = useState(null);
  const [mostrarDisponiveis, setMostrarDisponiveis] = useState(false);

  const fetchQuartos = async () => {
    const token = localStorage.getItem("token");
    try {
      let url = "http://localhost:8081/api/ocupados";
      if (mostrarDisponiveis) {
        url = "http://localhost:8081/api/disponiveis";
      }
      if (dtIn && dtOut) {
        url += `?dtInicio=${dtIn.toISOString().split("T")[0]}&dtSaida=${dtOut
          .toISOString()
          .split("T")[0]}`;
      }
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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

  useEffect(() => {
    fetchQuartos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dtIn, dtOut, mostrarDisponiveis]);

  return (
    <div>
      <div>
        <label>Data Entrada</label>
        <DatePicker
          selected={dtIn}
          onChange={(date) => setDtIn(date)}
          placeholderText="Selecione a data de entrada"
          dateFormat="yyyy-MM-dd"
        />
      </div>
      <div>
        <label>Data Saída</label>
        <DatePicker
          selected={dtOut}
          onChange={(date) => setDtOut(date)}
          placeholderText="Selecione a data de saída"
          dateFormat="yyyy-MM-dd"
          minDate={dtIn ? new Date(dtIn.getTime() + 86400000) : new Date()}
        />
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={mostrarDisponiveis}
            onChange={() => setMostrarDisponiveis(!mostrarDisponiveis)}
          />
          Mostrar apenas quartos disponíveis
        </label>
      </div>

      {carregandoQuartos ? (
        <p>Carregando quartos...</p>
      ) : errorQuartos ? (
        <p style={{ color: "red" }}>Erro ao carregar quartos: {errorQuartos.message}</p>
      ) : (
        <table style={{ borderCollapse: "collapse", marginTop: "1rem" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Quarto</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Ocupado por</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Até</th>
            </tr>
          </thead>
          <tbody>
            {quartos.map((quarto) => {
              // Se quarto.dtSaida não existir, mostra '-' para evitar "Invalid Date"
              const dataSaida = quarto.dtSaida
                ? new Date(quarto.dtSaida).toLocaleDateString()
                : "-";

              return (
                <tr key={quarto.id} style={{ border: "1px solid #ccc" }}>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{quarto.descricao}</td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{quarto.ocupantes}</td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{dataSaida}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DisponibilidadeQuartos;
