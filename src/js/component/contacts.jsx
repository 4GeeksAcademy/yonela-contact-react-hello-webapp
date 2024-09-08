import React, { useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { Context } from "../store/appContext";
import { Pencil, Trash2 } from "lucide-react";
import "../../styles/contact.css";

const Contact = () => {
  const { slug } = useParams();
  const { store, actions } = useContext(Context);

  useEffect(() => {
    if (!store.contacts[slug]) {
      actions.loadContacts(slug);
    }
  }, [slug, actions, store.contacts]);

  const contacts = store.contacts[slug]?.contacts || [];

  return (
    <div className="contact-list-container">
      <div className="contact-list-header">
        <h2 className="contact-list-title">Contactos para Agenda: {slug}</h2>
        <button className="add-contact-button">
          Añadir nuevo contacto
        </button>
      </div>
      {contacts.length > 0 ? (
        <div className="contact-list">
          {contacts.map((contact) => (
            <div key={contact.id} className="contact-card">
              <img
                src={contact.photo || "/api/placeholder/100/100"}
                alt={contact.name}
                className="contact-photo"
              />
              <div className="contact-info">
                <h3 className="contact-name">{contact.name}</h3>
                <p className="contact-detail">
                  <span className="contact-icon">📍</span>
                  {contact.address}
                </p>
                <p className="contact-detail">
                  <span className="contact-icon">📞</span>
                  {contact.phone}
                </p>
                <p className="contact-detail">
                  <span className="contact-icon">✉️</span>
                  {contact.email}
                </p>
              </div>
              <div className="contact-actions">
                <button className="edit-button">
                  <Pencil size={20} />
                </button>
                <button className="delete-button">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-contacts-message">No se encontraron contactos para esta agenda.</p>
      )}
      <Link to="/book" className="back-button">
        Volver a Agendas
      </Link>
    </div>
  );
};

export default Contact;
