import React, { useState, useEffect } from 'react';

function QuartoList() {
  const [quartos, setQuartos] = useState([]);
  const [editandoQuarto, setEditandoQuarto] = useState(null);
  const [ocupacaoMaximaEditada, setOcupacaoMaximaEditada] = useState('');
  const [ramalEditado, setRamalEditado] = useState('');
  const [descricaoEditada, setDescricaoEditada] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('http://localhost:8081/api/quartos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error('Falha ao obter quartos');
        }
        return resp.json();
      })
      .then((data) => setQuartos(data))
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    const token = localStorage.getItem('token');

    fetch(`http://localhost:8081/api/quartos/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error('Falha ao excluir quarto');
        }
        setQuartos(quartos.filter((quarto) => quarto.id !== id));
      })
      .catch((err) => console.error(err));
  };

  const handleEdit = (id, ocupacaoMaxima, ramal, descricao) => {
    setEditandoQuarto(id);
    setOcupacaoMaximaEditada(ocupacaoMaxima);
    setRamalEditado(ramal);
    setDescricaoEditada(descricao);
  };

  const cancelarEdicao = () => {
    setEditandoQuarto(null);
    setOcupacaoMaximaEditada('');
    setRamalEditado('');
    setDescricaoEditada('');
  };

  const salvarEdicao = (id) => {
    const token = localStorage.getItem('token');

    fetch(`http://localhost:8081/api/quartos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        ocupacaoMaxima: ocupacaoMaximaEditada,
        ramal: ramalEditado,
        descricao: descricaoEditada
      })
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error('Falha ao editar quarto');
        }
        setEditandoQuarto(null);
        setQuartos(quartos.map((quarto) =>
          quarto.id === id
            ? {
                ...quarto,
                ocupacaoMaxima: ocupacaoMaximaEditada,
                ramal: ramalEditado,
                descricao: descricaoEditada
              }
            : quarto
        ));
      })
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <h1>Listar Quartos</h1>
      <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '1rem' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Ocupação Máxima</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Ramal</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Descrição</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {quartos.map((quarto) => (
            <tr key={quarto.id}>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                {editandoQuarto === quarto.id ? (
                  <input
                    type="number"
                    value={ocupacaoMaximaEditada}
                    onChange={(e) => setOcupacaoMaximaEditada(e.target.value)}
                  />
                ) : (
                  quarto.ocupacaoMaxima
                )}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                {editandoQuarto === quarto.id ? (
                  <input
                    type="text"
                    value={ramalEditado}
                    onChange={(e) => setRamalEditado(e.target.value)}
                  />
                ) : (
                  quarto.ramal
                )}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                {editandoQuarto === quarto.id ? (
                  <textarea
                    value={descricaoEditada}
                    onChange={(e) => setDescricaoEditada(e.target.value)}
                  />
                ) : (
                  quarto.descricao
                )}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                {editandoQuarto === quarto.id ? (
                  <>
                    <button onClick={() => salvarEdicao(quarto.id)}>Salvar</button>
                    <button onClick={cancelarEdicao}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() =>
                        handleEdit(quarto.id, quarto.ocupacaoMaxima, quarto.ramal, quarto.descricao)
                      }
                    >
                      Editar
                    </button>
                    <button onClick={() => handleDelete(quarto.id)}>Excluir</button>
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

export default QuartoList;
