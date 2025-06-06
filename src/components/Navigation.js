import React from "react";
import { NavLink } from "react-router-dom";
import Logo from "./Logo";

const Navigation = () => {
    // Vérifie la présence d'un utilisateur connecté dans le localStorage
    const isAuthenticated = localStorage.getItem("user") ? true : false;

    // Fonction de déconnexion qui supprime le user et redirige vers l'accueil
    const handleLogout = () => {
        if (window.confirm("Êtes-vous certain de vouloir vous déconnecter?")) {
            localStorage.removeItem("user");
            window.location.assign('/');
        }
    };

    return (
        <header className="header" id="header">
            <div className="logo-container">
                <Logo />   
            </div>    
            <nav className="nav-menu" id="nav-menu">
                <NavLink exact to="/" activeClassName="active">
                    Séries Populaires
                </NavLink>
                <NavLink to="/categories" activeClassName="active">
                    Catégories
                </NavLink>
                <NavLink to="/search" activeClassName="active">
                    <img src="/icons/search.png" alt="Recherche" className="nav-icon" />
                    Recherche
                </NavLink>
                <NavLink to={isAuthenticated ? "/favorites" : "/login"} activeClassName={isAuthenticated ? "active" : "desactive"}>
                    <img src="/icons/favoris.png" alt="Favoris" className="nav-icon" />
                    Favoris
                </NavLink>
                {isAuthenticated ? (
                    // Si l'utilisateur est connecté, affiche Déconnexion
                    <span className="nav-name nav-name-logged" onClick={handleLogout}>
                        <img src="/icons/user2.png" alt="Déconnexion" className="nav-icon" />
                        Déconnexion
                    </span>
                ) : (
                    // Sinon, affiche le lien Connexion
                    <NavLink to="/login" activeClassName="active" className="nav-name nav-name-unlogged">
                        <img src="/icons/user.png" alt="Connexion" className="nav-icon" />
                        Connexion
                    </NavLink>
                )}
            </nav>
        </header>
    );
};

export default Navigation;
