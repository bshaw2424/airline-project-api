import { useState } from "react";
import api from "../api/axios";

export default function CreateTrip({ onTripCreated }) {
  const [formData, setFormData] = useState({
    name: "",
    destinationCode: "",
    startDate: "",
    endDate: "",
    notes: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = e => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    setSaving(true);
    setError("");

    try {
      const response = await api.post("/api/trips", {
        ...formData,
        destinationCode: formData.destinationCode.trim().toUpperCase(),
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
      });

      onTripCreated(response.data.trip);
    } catch (error) {
      console.error("Unable to create trip:", error);

      setError(
        error.response?.data?.error ||
          "Unable to create your trip. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="tripName" className="form-label">
          Trip Name *
        </label>
        <input
          type="text"
          id="tripName"
          name="name"
          className="form-control"
          value={formData.name}
          onChange={handleChange}
          maxLength={100}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="destinationCode" className="form-label">
          Destination Airport Code *
        </label>
        <input
          type="text"
          id="destinationCode"
          name="destinationCode"
          className="form-control"
          placeholder="e.g. SAN"
          value={formData.destinationCode}
          onChange={handleChange}
          maxLength={3}
          required
        />
      </div>

      <div className="row g-3 mb-3">
        <div className="col-12 col-md-6">
          <label htmlFor="startDate" className="form-label">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            className="form-control"
            value={formData.startDate}
            onChange={handleChange}
          />
        </div>

        <div className="col-12 col-md-6">
          <label htmlFor="endDate" className="form-label">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            className="form-control"
            min={formData.startDate || undefined}
            value={formData.endDate}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="tripNotes" className="form-label">
          Notes
        </label>
        <textarea
          id="tripNotes"
          name="notes"
          className="form-control"
          rows={3}
          maxLength={1000}
          value={formData.notes}
          onChange={handleChange}
          placeholder="Anything you'd like to remember about this trip..."
        />
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <button type="submit" className="btn btn-primary" disabled={saving}>
        {saving ? "Saving..." : "Save Trip"}
      </button>
    </form>
  );
}
