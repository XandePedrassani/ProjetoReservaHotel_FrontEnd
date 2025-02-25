import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from 'react';
import Home from './Components/Pages/Home'
import UsuarioList from './Components/Pages/UsuarioList';
import UsuarioForm from './Components/Pages/UsuarioForm';
import ClienteForm from './Components/Pages/ClienteForm';
import LoginForm from './Components/Pages/LoginForm';
import ClienteList from './Components/Pages/ClienteList';
import QuartoForm from './Components/Pages/QuartoForm';
import QuartoList from './Components/Pages/QuartoList';
import ReservaForm from './Components/Pages/ReservaForm';
import DisponibilidadeQuartos from './Components/Pages/DisponibilidadeQuartos';

import Menu from './Components/Layout/Menu'
import ReservaList from './Components/Pages/ReservaList';

function App() {
  return (
    <>
    <Router>
      <Menu />
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/usuarios" element={<UsuarioList />} />
          <Route path="/novo-usuario" element={<UsuarioForm />} />
          <Route path="/novo-cliente" element={<ClienteForm />} />
          <Route path="/clientes" element={<ClienteList />} />
          <Route path="/novo-quarto" element={<QuartoForm />} />
          <Route path="/quartos" element={<QuartoList />} />
          <Route path="/nova-reserva" element={<ReservaForm />} />
          <Route path="/reservas" element={<ReservaList />} />
          <Route path="/disponibilidade" element={<DisponibilidadeQuartos />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
