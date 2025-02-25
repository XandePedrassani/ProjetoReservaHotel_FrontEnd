import React from "react";
import { Link } from "react-router-dom";

function Menu() {
    return (
        <nav className="navbar">
            <div className="container">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link to="/login" className="nav-link">Login</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/usuarios" className="nav-link">Usuario Listar</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/novo-usuario" className="nav-link">Usuario Cadastrar</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/novo-cliente" className="nav-link">Cliente Cadastrar</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/clientes" className="nav-link">Clientes</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/novo-quarto" className="nav-link">Quarto Cadastrar</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/quartos" className="nav-link">Quartos</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/nova-reserva" className="nav-link">Reserva Cadastrar</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/reservas" className="nav-link">Reservas</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/disponibilidade" className="nav-link">Disponibilidade De Quartos</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Menu;
