import { useState, useEffect } from "react";

export default function ModalForm({ isOpen, onClose, onSubmit, mode, clientData }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    job: "",
    rate: "",
    status: "Inactive", // Dropdown uses string
  });

  // Prefill form when editing OR reset when adding new
  useEffect(() => {
    if (mode === "edit" && clientData) {
      setFormData({
        name: clientData.name || "",
        email: clientData.email || "",
        job: clientData.job || "",
        rate: clientData.rate || "",
        status: clientData.isactive ? "Active" : "Inactive", // boolean → string
      });
    } else {
      setFormData({
        name: "",
        email: "",
        job: "",
        rate: "",
        status: "Inactive",
      });
    }
  }, [isOpen, mode, clientData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Submit form data
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Send form data to parent (App.jsx)
  };

  if (!isOpen) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          ✕
        </button>

        {/* Title */}
        <h3 className="font-bold text-lg mb-4">
          {mode === "edit" ? "Edit Client" : "Add New Client"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Full Name</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* Email */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email Address</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* Job */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Job Title</span>
            </label>
            <input
              type="text"
              name="job"
              value={formData.job}
              onChange={handleChange}
              placeholder="Job Title"
              className="input input-bordered w-full"
            />
          </div>

          {/* Rate & Status */}
          <div className="flex gap-4">
            <div className="form-control w-1/2">
              <label className="label">
                <span className="label-text">Rate ($)</span>
              </label>
              <input
                type="number"
                name="rate"
                value={formData.rate}
                onChange={handleChange}
                placeholder="Rate"
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control w-1/2">
              <label className="label">
                <span className="label-text">Status</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="modal-action">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {mode === "edit" ? "Save Changes" : "Add Client"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
