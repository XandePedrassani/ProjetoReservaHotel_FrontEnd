import React, { useState, useEffect } from 'react';

function UsuarioList() {
  const [usuarios, setUsuarios] = useState([]);
  const [editandoUsuario, setEditandoUsuario] = useState(null);
  const [loginUsuarioEditado, setLoginUsuarioEditado] = useState('');
  const [senhaUsuarioEditada, setSenhaUsuarioEditada] = useState('');
  const [tipoUsuarioEditado, setTipoUsuarioEditado] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('http://localhost:8081/api/usuarios', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error('Falha ao obter usuários');
        }
        return resp.json();
      })
      .then((data) => setUsuarios(data))
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    const token = localStorage.getItem('token');

    fetch(`http://localhost:8081/api/usuarios/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error('Falha ao excluir usuário');
        }
        setUsuarios(usuarios.filter((usuario) => usuario.id !== id));
      })
      .catch((err) => console.error(err));
  };

  const handleEdit = (id, login, senha, tipo) => {
    setEditandoUsuario(id);
    setLoginUsuarioEditado(login);
    setSenhaUsuarioEditada(senha);
    setTipoUsuarioEditado(tipo);
  };

  const cancelarEdicao = () => {
    setEditandoUsuario(null);
    setLoginUsuarioEditado('');
    setSenhaUsuarioEditada('');
    setTipoUsuarioEditado('');
  };

  const salvarEdicao = (id) => {
    const token = localStorage.getItem('token');

    fetch(`http://localhost:8081/api/usuarios/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        login: loginUsuarioEditado, 
        senha: senhaUsuarioEditada, 
        tipo: tipoUsuarioEditado 
      })
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error('Falha ao editar usuário');
        }
        setEditandoUsuario(null);
        // Atualiza a lista de usuários localmente
        setUsuarios(usuarios.map(usuario =>
          usuario.id === id 
            ? { ...usuario, login: loginUsuarioEditado, senha: senhaUsuarioEditada, tipo: tipoUsuarioEditado }
            : usuario
        ));
      })
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <h1>Listar Usuários</h1>
      <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '1rem' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Login</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Senha</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Tipo</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                {editandoUsuario === usuario.id ? (
                  <input
                    type="text"
                    value={loginUsuarioEditado}
                    onChange={(e) => setLoginUsuarioEditado(e.target.value)}
                  />
                ) : (
                  usuario.login
                )}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                {editandoUsuario === usuario.id ? (
                  <input
                    type="password"
                    value={senhaUsuarioEditada}
                    onChange={(e) => setSenhaUsuarioEditada(e.target.value)}
                  />
                ) : (
                  usuario.senha
                )}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                {editandoUsuario === usuario.id ? (
                  <input
                    type="number"
                    value={tipoUsuarioEditado}
                    onChange={(e) => setTipoUsuarioEditado(e.target.value)}
                  />
                ) : (
                  usuario.tipo
                )}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                {editandoUsuario === usuario.id ? (
                  <>
                    <button onClick={() => salvarEdicao(usuario.id)}>Salvar</button>
                    <button onClick={cancelarEdicao}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(usuario.id, usuario.login, usuario.senha, usuario.tipo)}>
                      Editar
                    </button>
                    <button onClick={() => handleDelete(usuario.id)}>Excluir</button>
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

export default UsuarioList;
