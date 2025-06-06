import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const UserInscription = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation simple
    if (form.password !== form.confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas");
      return;
    }
    // Envoi des données à la base de données locale
    axios
      .post("https://mytv-jsonserver-production.up.railway.app/users", {
        username: form.username,
        email: form.email,
        password: form.password,
        favorites: []  
      })
      .then(() => {
        setMessage("Inscription réussie !");
        // Réinitialisation du formulaire
        setForm({
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
      })
      .catch((error) => {
        console.error(error);
        setMessage("Erreur lors de l'inscription");
      });
  };

  return (
    <div className="inscription-page">
      <h1>Inscription</h1>
      {message && <p className="message">{message}</p>}
      <form className="inscription-form" onSubmit={handleSubmit}>
        <label htmlFor="username">Nom d'utilisateur :</label>
        <input
          type="text"
          id="username"
          name="username"
          value={form.username}
          onChange={handleChange}
          required
        />

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

        <label htmlFor="confirmPassword">Confirmez le mot de passe :</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type="submit">S'inscrire</button>
      </form>
      <p className="login-link">
       Déjà inscrit ? <Link to="/login">Connectez-vous ici</Link>.
      </p>
    </div>
  );
};

export default UserInscription;
