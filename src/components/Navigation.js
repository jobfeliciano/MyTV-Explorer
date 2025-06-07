import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import Logo from "./Logo";

const Navigation = () => {
    // Vérifie la présence d'un utilisateur connecté dans le localStorage
    const isAuthenticated = localStorage.getItem("user") ? true : false;

    // Fonction de déconnexion
    const handleLogout = () => {
        if (window.confirm("Êtes-vous certain de vouloir vous déconnecter?")) {
            localStorage.removeItem("user");
            window.location.assign('/');
        }
    };

    // Gestion du menu-toggle pour le responsive
    useEffect(() => {
        const menuToggle = document.getElementById("menu-toggle");
        const navMenu = document.getElementById("nav-menu");

        const toggleMenu = () => {
            navMenu.classList.toggle("active");
        };

        if (menuToggle) {
            menuToggle.addEventListener("click", toggleMenu);
        }

        return () => {
            if (menuToggle) {
                menuToggle.removeEventListener("click", toggleMenu);
            }
        };
    }, []);

    return (
        <header className="header" id="header">
            <div className="logo-container">
                <Logo />
            </div>

            {/* Menu toggle button pour mobile */}
            <div className="menu-toggle" id="menu-toggle">
                <span></span>
                <span></span>
                <span></span>
            </div>

            <nav className="nav-menu" id="nav-menu">
                <NavLink exact="true" to="/" className={({ isActive }) => isActive ? "active" : ""}>
                    Séries Populaires
                </NavLink>
                <NavLink to="/categories" className={({ isActive }) => isActive ? "active" : ""}>
                    Catégories
                </NavLink>
                <NavLink to="/search" className={({ isActive }) => isActive ? "active" : ""}>
                    <img src="/icons/search.png" alt="Recherche" className="nav-icon" />
                    Recherche
                </NavLink>
                <NavLink to={isAuthenticated ? "/favorites" : "/login"} className={({ isActive }) => isActive ? "active" : "desactive"}>
                    <img src="/icons/favoris.png" alt="Favoris" className="nav-icon" />
                    Favoris
                </NavLink>
                {isAuthenticated ? (
                    <span className="nav-name nav-name-logged" onClick={handleLogout}>
                        <img src="/icons/user2.png" alt="Déconnexion" className="nav-icon" />
                        Déconnexion
                    </span>
                ) : (
                    <NavLink to="/login" className={({ isActive }) => isActive ? "active" : "nav-name nav-name-unlogged"}>
                        <img src="/icons/user.png" alt="Connexion" className="nav-icon" />
                        Connexion
                    </NavLink>
                )}
            </nav>
        </header>
    );
};

export default Navigation;
