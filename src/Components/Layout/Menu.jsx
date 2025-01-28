import React from "react";
import { Link } from "react-router-dom";

function Menu() {
    return (
        <nav className="navbar">
            <div className="container">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link to="/" className="nav-link">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/login" className="nav-link">Login</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/categorias" className="nav-link">Categoria Listar</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/nova-categoria" className="nav-link">Categoria Cadastrar</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/receitas-categoria" className="nav-link">Receita Listar por Categoria</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/receitas" className="nav-link">Receita Listar</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/nova-receita" className="nav-link">Receita Cadastrar</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/usuarios" className="nav-link">Usuario Listar</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/novo-usuario" className="nav-link">Usuario Cadastrar</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Menu;
