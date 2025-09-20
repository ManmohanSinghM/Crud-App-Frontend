import { useState, useEffect } from "react";
import "./App.css";
import ModalForm from "./components/ModalForm.jsx";
import NavBar from "./components/NavBar.jsx";
import TableList from "./components/TableList.jsx";
import axios from "axios";
import { SpeedInsights } from "@vercel/speed-insights/react"; // <-- 1. Import

const API_URL = "https://crud-app-backend-n0wq.onrender.com/api/clients";

function App() {
  const [clients, setClients] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [currentClient, setCurrentClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all clients
  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setClients(response.data);
    } catch (err) {
      setError("Error fetching clients: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Auto-clear error messages after 3s
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Open modal
  const handleOpen = (mode, client = null) => {
    setModalMode(mode);
    setCurrentClient(client);
    setIsOpen(true);
  };

  // Close modal
  const handleClose = () => {
    setIsOpen(false);
    setCurrentClient(null);
  };

  // Add or edit client
  const handleSubmit = async (formData) => {
    const clientData = {
      ...formData,
      isactive: formData.status === "Active", // Map status to boolean
    };

    try {
      setLoading(true);

      if (modalMode === "add") {
        const response = await axios.post(API_URL, clientData);
        setClients((prev) => [...prev, response.data]);
      } else if (modalMode === "edit" && currentClient) {
        const response = await axios.put(
          `${API_URL}/${currentClient.id}`,
          clientData
        );
        setClients((prev) =>
          prev.map((client) =>
            client.id === currentClient.id ? response.data : client
          )
        );
      }
    } catch (err) {
      setError("Error saving client: " + err.message);
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  // Delete client
  const handleDelete = async (clientId) => {
    if (!window.confirm("Are you sure you want to delete this client?")) return;

    try {
      setLoading(true);
      await axios.delete(`${API_URL}/${clientId}`);
      setClients((prev) => prev.filter((client) => client.id !== clientId));
    } catch (err) {
      setError("Error deleting client: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle active status
  const handleToggleStatus = async (clientToToggle) => {
    try {
      const updatedData = {
        ...clientToToggle,
        isactive: !clientToToggle.isactive,
      };
      const response = await axios.put(
        `${API_URL}/${clientToToggle.id}`,
        updatedData
      );
      setClients((prev) =>
        prev.map((client) =>
          client.id === clientToToggle.id ? response.data : client
        )
      );
    } catch (err) {
      setError("Error toggling status: " + err.message);
    }
  };

  // Filter clients by search term
  const filteredClients = clients.filter(
    (client) =>
      client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.job?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {error && <div className="alert alert-error shadow-lg">{error}</div>}
      {loading && <div className="loading loading-spinner text-primary"></div>}

      <NavBar onOpen={() => handleOpen("add")} onSearch={setSearchTerm} />

      <TableList
        clients={filteredClients}
        onEdit={(client) => handleOpen("edit", client)}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />

      <ModalForm
        isOpen={isOpen}
        mode={modalMode}
        clientData={currentClient}
        onSubmit={handleSubmit}
        onClose={handleClose}
      />
      
      <SpeedInsights /> {/* <-- 2. Add the component here */}
    </>
  );
}

export default App;