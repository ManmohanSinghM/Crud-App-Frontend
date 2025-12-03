import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import { SpeedInsights } from "@vercel/speed-insights/react";

// Components
import ModalForm from "./components/ModalForm.jsx";
import NavBar from "./components/NavBar.jsx";
import TableList from "./components/TableList.jsx";

// Supabase
import { supabase } from "./supabaseClient"; // Ensure you created this file!
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

// API URL (Switch these based on local vs production)
const API_URL = "https://crud-app-backend-n0wq.onrender.com/api/clients";
// const API_URL = "http://localhost:3000/api/clients";

function App() {
  // --- AUTH STATE ---
  const [session, setSession] = useState(null);

  // --- CRUD APP STATE ---
  const [clients, setClients] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [currentClient, setCurrentClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- 1. AUTHENTICATION EFFECT ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // --- 2. DATA FETCHING (Only runs if session exists) ---
  const fetchClients = async () => {
    if (!session) return; // Don't fetch if not logged in
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

  // Fetch data when the component mounts (or when session changes to valid)
  useEffect(() => {
    if (session) {
      fetchClients();
    }
  }, [session]);

  // Auto-clear error messages after 3s
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // --- 3. CRUD HANDLERS ---

  const handleOpen = (mode, client = null) => {
    setModalMode(mode);
    setCurrentClient(client);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setCurrentClient(null);
  };

  const handleSubmit = async (formData) => {
    const clientData = {
      ...formData,
      isactive: formData.status === "Active",
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

  // Filter clients
  const filteredClients = clients.filter(
    (client) =>
      client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.job?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- 4. VIEW LOGIC ---

  // VIEW A: NOT LOGGED IN -> Show Login Form
  if (!session) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "50px",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            width: "400px",
            padding: "40px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            backgroundColor: "#fff",
            height: "fit-content",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            Welcome Back
          </h2>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={['google']} // Add ['google'] here if you enable it later
          />
        </div>
      </div>
    );
  }

  // VIEW B: LOGGED IN -> Show CRUD App
  return (
    <>
      {/* Auth Header Bar */}
      <div
        style={{
          padding: "10px 20px",
          background: "#333",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>Logged in as: {session.user.email}</span>
        <button
          onClick={() => supabase.auth.signOut()}
          style={{
            padding: "5px 15px",
            cursor: "pointer",
            backgroundColor: "#ff4d4d",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Sign Out
        </button>
      </div>

      {/* Your Original App Content */}
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

      <SpeedInsights />
    </>
  );
}

export default App;