import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { Context } from "../store/appContext";



const Book = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [newAgendaName, setNewAgendaName] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        actions.loadAgendas();
    }, []);

    const handleCreateAgenda = async (e) => {
        e.preventDefault();
        if (newAgendaName.trim() !== "") {
            try {
                const newAgenda = await actions.createAgenda(newAgendaName);
                console.log("New agenda created:", newAgenda);
                setNewAgendaName("");
                setError("");
                actions.loadAgendas();  // Recargar las agendas después de crear una nueva
            } catch (error) {
                console.error("Error in handleCreateAgenda:", error);
                setError(`Failed to create agenda: ${error.message}`);
            }
        }
    };

    return (
        <div className="container">
            <h2>Create New Agenda</h2>
            <form onSubmit={handleCreateAgenda}>
                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter new agenda name"
                        value={newAgendaName}
                        onChange={(e) => setNewAgendaName(e.target.value)}
                    />
                    <button className="btn btn-primary" type="submit">
                        Create Agenda
                    </button>
                </div>
            </form>
            {error && <div className="alert alert-danger">{error}</div>}

            <h3>Existing Agendas</h3>
            <ul className="list-group">
                {Array.isArray(store.agendas.agendas) && store.agendas.agendas.map((agenda) => (
                    <li key={agenda.id} className="list-group-item d-flex justify-content-between align-items-center">
                        {agenda.slug}
                        <Link to={`/contacts/${agenda.slug}`}  className="btn btn-info btn-sm">
                            View Details
                        </Link>
                    </li>
                ))}
            </ul>
            <br />
        </div>
    );
};

export default Book;