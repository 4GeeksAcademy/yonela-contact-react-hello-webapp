const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],

			agendas: [],
      		contacts: [],
			selectedAgenda: null,
			selectedContact: null,
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},
			loadSomeData: () => {
				/**
					fetch().then().then(data => setStore({ "foo": data.bar }))
				*/
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			},

			loadAgendas: async () => {
				try {
				  const response = await fetch("https://playground.4geeks.com/contact/agendas");
				  const data = await response.json();
				  setStore({ agendas: data });
				} catch (error) {
				  console.error("Error loading agendas:", error);
				}
			},
		
			  // Cargar detalles de una agenda específica
			loadAgendaDetails: async (agendaId) => {
				try {
				  const response = await fetch(`https://playground.4geeks.com/contact/agendas/${agendaId}`);
				  const data = await response.json();
				  setStore({ selectedAgenda: data });
				} catch (error) {
				  console.error("Error loading agenda details:", error);
				}
		    },
		
			// Cargar contactos de una agenda específica
			loadContacts: async (slug) => {
				const store = getStore();
				if (store.contacts[slug]) return; // Ya tenemos los contactos para este slug
			
				try {
					const response = await fetch(`https://playground.4geeks.com/contact/agendas/${slug}/contacts`);
					if (!response.ok) throw new Error('Failed to fetch contacts');
					const data = await response.json();
					setStore({ 
						contacts: {
							...store.contacts,
							[slug]: data // Guardamos todo el objeto recibido
						}
					});
				} catch (error) {
					console.error("Error loading contacts:", error);
				}
			},
		
			  // Seleccionar una agenda y cargar sus detalles y contactos
			setSelectedAgenda: async (agendaId) => {
				await getActions().loadAgendaDetails(agendaId);
				await getActions().loadContacts(agendaId);
			},
		
			  // Seleccionar un contacto
			setSelectedContact: (contact) => {
				setStore({ selectedContact: contact });
			},
		
			  // Agregar un nuevo contacto
			addContact: async (agendaId, contactData) => {
				try {
				  const response = await fetch(`https://playground.4geeks.com/contact/agendas/${agendaId}/contacts`, {
					method: 'POST',
					headers: {
					  'Content-Type': 'application/json',
					},
					body: JSON.stringify(contactData),
				  });
				  const newContact = await response.json();
				  const store = getStore();
				  setStore({ contacts: [...store.contacts, newContact] });
				} catch (error) {
				  console.error("Error adding contact:", error);
				}
			},
		

			// Actualizar un contacto
			updateContact: async (agendaId, contactId, contactData) => {
				try {
				const response = await fetch(`https://playground.4geeks.com/contact/agendas/${agendaId}/contacts/${contactId}`, {
					method: 'PUT',
					headers: {
					'Content-Type': 'application/json',
					},
					body: JSON.stringify(contactData),
				});
				const updatedContact = await response.json();
				const store = getStore();
				setStore({ 
					contacts: store.contacts.map(contact => 
					contact.id === contactId ? updatedContact : contact
					),
					selectedContact: updatedContact
				});
				} catch (error) {
				console.error("Error updating contact:", error);
				}
			},

			  // Eliminar un contacto
			deleteContact: async (agendaId, contactId) => {
				try {
				  await fetch(`https://playground.4geeks.com/contact/agendas/${agendaId}/contacts/${contactId}`, {
					method: 'DELETE',
				  });
				  const store = getStore();
				  setStore({ contacts: store.contacts.filter(contact => contact.id !== contactId) });
				} catch (error) {
				  console.error("Error deleting contact:", error);
				}
			},

			// Crear una nueva agenda
			createAgenda: async (agendaName) => {
				try {
					const slug = agendaName.toLowerCase().replace(/ /g, '-') + '-' + Date.now();
					console.log("Creating agenda with slug:", slug);
			
					const response = await fetch(`https://playground.4geeks.com/contact/agendas/${slug}`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ name: agendaName }),
					});
			
					console.log("Response status:", response.status);
					const responseData = await response.json();
					console.log("Response data:", responseData);
			
					if (!response.ok) {
						throw new Error(`Failed to create agenda: ${response.status} ${response.statusText}`);
					}
			
					const store = getStore();
					
					// Asegúrate de que store.agendas es un array antes de usar spread
					const updatedAgendas = Array.isArray(store.agendas) 
						? [...store.agendas, responseData]
						: [responseData];
			
					setStore({ agendas: updatedAgendas });
			
					console.log("Updated store:", getStore());
			
					return responseData;
				} catch (error) {
					console.error("Error creating agenda:", error);
					throw error;
				}
			},

		
			  // Actualizar una agenda
			updateAgenda: async (agendaId, agendaData) => {
				try {
				  const response = await fetch(`https://playground.4geeks.com/contact/agendas/${agendaId}`, {
					method: 'PUT',
					headers: {
					  'Content-Type': 'application/json',
					},
					body: JSON.stringify(agendaData),
				  });
				  const updatedAgenda = await response.json();
				  const store = getStore();
				  setStore({ 
					agendas: store.agendas.map(agenda => 
					  agenda.id === agendaId ? updatedAgenda : agenda
					),
					selectedAgenda: updatedAgenda
				  });
				} catch (error) {
				  console.error("Error updating agenda:", error);
				}
			},			
		}
	};
};

export default getState;
