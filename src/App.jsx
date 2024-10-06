import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const apiURL = "https://jsonplaceholder.typicode.com/users";
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [currentContactId, setCurrentContactId] = useState(null);

  // Fetch contacts from API
  useEffect(() => {
    axios
      .get(apiURL)
      .then((response) => setContacts(response.data))
      .catch((error) => console.error("Error fetching contacts:", error));
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle selecting a contact for editing
  const handleEditClick = (contact) => {
    setIsEditing(true);
    setCurrentContactId(contact.id);
    setFormData({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
    });
  };

  // Add a new contact (dummy)
  const handleAddContact = () => {
    axios
      .post(apiURL, formData)
      .then((response) => {
        // COntact wont add empty Criteria
        if (
          formData.name.length <= 3 ||
          formData.email.length <= 3 ||
          formData.phone.length <= 3
        )
          return;
        setContacts([...contacts, response.data]); // Add to local state
        setFormData({ name: "", email: "", phone: "" }); // Reset form
      })
      .catch((error) => console.error("Error adding contact:", error));
  };

  // Update a contact (dummy)
  const handleUpdateContact = () => {
    axios
      .put(`${apiURL}/${currentContactId}`, formData)
      .then((response) => {
        setContacts(
          contacts.map((contact) =>
            contact.id === currentContactId
              ? { ...contact, ...formData }
              : contact
          )
        );
        setIsEditing(false);
        // Once done with Update, set SetIsEditing will be false
        setCurrentContactId(null);
        setFormData({ name: "", email: "", phone: "" });
      })
      .catch((error) => {
        console.error("Error updating contact:", error);

        setContacts(
          contacts.map((contact) =>
            contact.id === currentContactId
              ? { ...contact, ...formData }
              : contact
          )
        );
        setIsEditing(false);
        setCurrentContactId(null);
        setFormData({ name: "", email: "", phone: "" });
        // Reset form after update
      });
  };

  // Delete a contact (dummy)
  const handleDeleteContact = (id) => {
    axios
      .delete(`${apiURL}/${id}`)
      .then(() => setContacts(contacts.filter((contact) => contact.id !== id)))
      .catch((error) => console.error("Error deleting contact:", error));
  };

  return (
    <div className="container mx-auto mt-8 max-w-screen-lg">
      <h1 className="text-3xl font-bold mb-4">Contact List</h1>

      <div className="mb-4">
        <input
          className="border px-2 py-1 mr-2 outline-none"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Name"
        />
        <input
          className="border px-2 py-1 mr-2 outline-none"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email"
        />
        <input
          className="border px-2 py-1 outline-none"
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="Phone"
        />
        <button
          className={`ml-2 px-4 py-2 ${
            isEditing ? "bg-yellow-500" : "bg-green-500"
          } text-[#040f23] rounded-md hover:bg-green-600 text-sm font-semibold`}
          onClick={isEditing ? handleUpdateContact : handleAddContact}
        >
          {isEditing ? "Update Contact" : "Add Contact"}
        </button>
      </div>

      <ul>
        {contacts.map((contact) => (
          <li key={contact.id} className="border-b py-2">
            <div className="flex justify-between">
              <span>
                {contact.name} - {contact.email} - {contact.phone}
              </span>
              <div>
                <button
                  className="bg-yellow-500 text-white px-4 py-1 mr-2"
                  onClick={() => handleEditClick(contact)}
                >
                  Update
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-1"
                  onClick={() => handleDeleteContact(contact.id)}
                  // We will capture the id form contacts
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
