import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const UserConnexion = () => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Recherche d'un utilisateur par email
      const response = await axios.get(`http://localhost:3005/users?email=${form.email}`);
      if (response.data.length > 0) {
        // L'utilisateur existe
        const user = response.data[0];
        if (user.password === form.password) {
          // Enregistrer le user dans le localStorage (pour être utilisé dans d’autres pages)
          localStorage.setItem("user", JSON.stringify({ id: user.id, email: user.email, favorites:user.favorites}));
          window.location.assign('/');
        } else {
          setMessage("Mot de passe incorrect !");
        }
      } else {
        setMessage("Crédentiels incorrects! Entrez des identifiants valides");
      }
    } catch (error) {
      console.error(error);
      setMessage("Erreur lors de la connexion");
    }
  };

  return (
    <div className="connexion-page">
      <h1>Connexion</h1>
      {message && <p className="message">{message}</p>}
      <form className="connexion-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email :</label>
        <input
          type="email"
          id="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Mot de passe :</label>
        <input
          type="password"
          id="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Se connecter</button>
      </form>
      <p className="register-link">
        Vous n'avez pas de compte ? <Link to="/inscription">Inscrivez-vous ici</Link>.
      </p>
    </div>
  );
};

export default UserConnexion;
