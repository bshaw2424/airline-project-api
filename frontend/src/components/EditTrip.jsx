import { useState } from "react";
import api from "../api/axios";

export default function EditTrip({ trip, onTripUpdated }) {
  const [formData, setFormData] = useState({
    name: trip.name || "",
    destinationCode: trip.destinationCode || "",
    startDate: trip.startDate?.slice(0, 10) || "",
    endDate: trip.endDate?.slice(0, 10) || "",
    notes: trip.notes || "",
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
      const response = await api.put(`/api/trips/${trip._id}`, {
        ...formData,
        destinationCode: formData.destinationCode.trim().toUpperCase(),
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
      });

      onTripUpdated(response.data.trip);
    } catch (error) {
      console.error("Unable to update trip:", error);

      setError(
        error.response?.data?.error ||
          "Unable to update your trip. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="editTripName" className="form-label">
          Trip Name *
        </label>
        <input
          type="text"
          id="editTripName"
          name="name"
          className="form-control"
          value={formData.name}
          onChange={handleChange}
          maxLength={100}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="editDestinationCode" className="form-label">
          Destination Airport Code *
        </label>
        <input
          type="text"
          id="editDestinationCode"
          name="destinationCode"
          className="form-control"
          value={formData.destinationCode}
          onChange={handleChange}
          maxLength={3}
          required
        />
      </div>

      <div className="row g-3 mb-3">
        <div className="col-12 col-md-6">
          <label htmlFor="editStartDate" className="form-label">
            Start Date
          </label>
          <input
            type="date"
            id="editStartDate"
            name="startDate"
            className="form-control"
            value={formData.startDate}
            onChange={handleChange}
          />
        </div>

        <div className="col-12 col-md-6">
          <label htmlFor="editEndDate" className="form-label">
            End Date
          </label>
          <input
            type="date"
            id="editEndDate"
            name="endDate"
            className="form-control"
            min={formData.startDate || undefined}
            value={formData.endDate}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="editTripNotes" className="form-label">
          Notes
        </label>
        <textarea
          id="editTripNotes"
          name="notes"
          className="form-control"
          rows={3}
          maxLength={1000}
          value={formData.notes}
          onChange={handleChange}
        />
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <button type="submit" className="btn btn-primary" disabled={saving}>
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
