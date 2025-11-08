'use client';
// src/pages/pops/PopForm.jsx
import { useState } from "react";
//import "../../styles/popsform.css";
import "./popform.css";
//import { useApi } from "../../context/ApiContext";

function PopForm() {
//  const { apiBaseUrl } = useApi();

  const [formData, setFormData] = useState({
    pop_id: "",
    pop_name: "",
    pop_addr: "",
    rec_stat: "Active",
    inp_by: "admin",
  });

  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch POP when user leaves the pop_id field
  const handlePopIdBlur = async () => {
    if (!formData.pop_id) return;

    setIsLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/pops/${formData.pop_id}`);
      if (!res.ok) {
        setIsEdit(false);
        return;
      }
      const data = await res.json();
      setFormData({ ...data });
      setIsEdit(true);
    } catch (err) {
      console.error("Error fetching POP:", err);
      setIsEdit(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const method = isEdit ? "PUT" : "POST";
    const url = isEdit
      ? `${apiBaseUrl}/pops/${formData.pop_id}`
      : `${apiBaseUrl}/pops/`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert(isEdit ? "POP updated successfully!" : "POP created successfully!");
        if (!isEdit) handleClear(); // Only clear on new creation
      } else {
        const errorText = await res.text();
        console.error("Server error:", errorText);
        alert(`Error saving POP: ${res.status} ${res.statusText}`);
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Network error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!formData.pop_id) return;

    if (!window.confirm("Are you sure you want to delete this POP?")) return;

    setIsLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/pops/${formData.pop_id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("POP deleted successfully!");
        handleClear();
      } else {
        const errorText = await res.text();
        console.error("Delete error:", errorText);
        alert(`Error deleting POP: ${res.status} ${res.statusText}`);
      }
    } catch (err) {
      console.error("Error deleting POP:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      pop_id: "",
      pop_name: "",
      pop_addr: "",
      rec_stat: "Active",
      inp_by: "admin",
    });
    setIsEdit(false);
  };

  return (
    <form className="pop-form" onSubmit={handleSubmit}>
      <h2>{isEdit ? "Update POP" : "Create POP"}</h2>

      {/* Edit Mode Indicator */}
      {isEdit && (
        <div className="edit-indicator">
          Edit Mode - Modifying existing POP record
        </div>
      )}

      <div className="form-grid">
        {/* POP ID */}
        <div className="form-group">
          <label>
            <div className="label-text">
              POP ID
              <span className="required">*</span>
            </div>
            <div className="input-wrapper">
              <input
                type="number"
                name="pop_id"
                value={formData.pop_id}
                onChange={handleChange}
                onBlur={handlePopIdBlur}
                required
                placeholder="Enter POP ID"
              />
              {isLoading && <div className="loading-spinner"></div>}
            </div>
          </label>
        </div>

        {/* Record Status */}
        <div className="form-group">
          <label>
            <div className="label-text">Record Status</div>
            <select
              name="rec_stat"
              value={formData.rec_stat}
              onChange={handleChange}
            >
              <option value="Active">🟢 Active</option>
              <option value="Inactive">🟡 Inactive</option>
              <option value="Deleted">🔴 Deleted</option>
            </select>
          </label>
        </div>

        {/* POP Description */}
        <div className="form-group full-width">
          <label>
            <div className="label-text">
              POP Description
              <span className="required">*</span>
            </div>
            <input
              type="text"
              name="pop_name"
              value={formData.pop_name}
              onChange={handleChange}
              required
              placeholder="Enter POP description"
            />
          </label>
        </div>

        {/* POP Address */}
        <div className="form-group full-width">
          <label>
            <div className="label-text">POP Address</div>
            <textarea
              name="pop_addr"
              value={formData.pop_addr}
              onChange={handleChange}
              placeholder="Enter complete address of the POP"
              rows="3"
            />
          </label>
        </div>

        {/* Input By */}
        <div className="form-group full-width">
          <label>
            <div className="label-text">Input By</div>
            <input
              type="text"
              name="inp_by"
              value={formData.inp_by}
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </label>
        </div>
      </div>

      <div className="form-buttons">
        <button 
          type="submit" 
          className="btn-primary"
          disabled={isLoading}
        >
          <svg className="btn-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          {isLoading ? "Processing..." : (isEdit ? "Update" : "Save")}
        </button>

        <button 
          type="button" 
          onClick={handleClear}
          className="btn-primary"
//          disabled={isLoading}
        >
          <svg className="btn-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Clear-1
        </button>

        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            className="btn-danger"
            disabled={isLoading}
          >
            <svg className="btn-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            Delete
          </button>
        )}
      </div>
    </form>
  );
}

export default PopForm;