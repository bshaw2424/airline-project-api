import { useState } from "react";
import { FaMapMarkerAlt, FaPlus } from "react-icons/fa";
import api from "../api/axios";

const initialForm = {
  name: "",
  type: "city",
  city: "",
  state: "",
  country: "",
};

// Configure which location fields appear for each place type
const placeTypeFields = {
  city: ["state", "country"],
  state: ["country"],
  country: [],
  attraction: ["city", "state", "country"],
  other: ["city", "state", "country"],
};

const placeTypeExamples = {
  city: "e.g. Sedona",
  state: "e.g. Arizona",
  country: "e.g. Japan",
  attraction: "e.g. Grand Canyon National Park",
  other: "e.g. Scenic overlook",
};

export default function AddPlace({ collectionId, onPlaceAdded }) {
  const [form, setForm] = useState(initialForm);
  const [isOpen, setIsOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  // Fields displayed for the selected place type
  const visibleFields = placeTypeFields[form.type] || [];

  const handleChange = event => {
    const { name, value } = event.target;

    setForm(previous => {
      // When the type changes, clear location fields
      // that no longer apply.
      if (name === "type") {
        const allowedFields = placeTypeFields[value] || [];

        return {
          ...previous,
          type: value,
          city: allowedFields.includes("city") ? previous.city : "",
          state: allowedFields.includes("state") ? previous.state : "",
          country: allowedFields.includes("country") ? previous.country : "",
        };
      }

      return {
        ...previous,
        [name]: value,
      };
    });

    setError("");
  };

  const handleSubmit = async event => {
    event.preventDefault();

    if (adding) return;

    const name = form.name.trim();

    if (!name) {
      setError("Place name is required.");
      return;
    }

    setAdding(true);
    setError("");

    try {
      const response = await api.post(
        `/api/collections/${collectionId}/places`,
        {
          name,
          type: form.type,
          city: form.city.trim(),
          state: form.state.trim(),
          country: form.country.trim(),
        },
      );

      onPlaceAdded(response.data.collection);

      setForm(initialForm);
      setIsOpen(false);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to add place. Please try again.",
      );
    } finally {
      setAdding(false);
    }
  };

  const handleCancel = () => {
    setForm(initialForm);
    setError("");
    setIsOpen(false);
  };

  return (
    <section className="card shadow-sm rounded-3 mb-4">
      <div className="card-body p-3 p-md-4">
        {/* Header */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div>
            <h2 className="h5 mb-2">
              <FaMapMarkerAlt className="text-primary me-2" />
              Add a Custom Place
            </h2>

            <p className="text-muted small mb-0">
              Save a city, state, country, attraction, or somewhere you want to
              visit.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-outline-primary d-flex align-items-center gap-2"
            onClick={() => {
              if (isOpen) {
                handleCancel();
              } else {
                setIsOpen(true);
              }
            }}
            disabled={adding}
            aria-expanded={isOpen}
            aria-controls="addPlaceForm"
          >
            <FaPlus />
            {isOpen ? "Close" : "Add Place"}
          </button>
        </div>

        {/* Expandable form */}
        {isOpen && (
          <form
            id="addPlaceForm"
            onSubmit={handleSubmit}
            className="border-top mt-4 pt-4"
          >
            <div className="row g-3">
              {/* Place name */}
              <div className="col-12 col-md-6">
                <label
                  htmlFor="customPlaceName"
                  className="form-label fw-semibold"
                >
                  Place Name
                </label>

                <input
                  id="customPlaceName"
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder={placeTypeExamples[form.type]}
                  value={form.name}
                  onChange={handleChange}
                  maxLength={120}
                  disabled={adding}
                  required
                />
              </div>

              {/* Place type */}
              <div className="col-12 col-md-6">
                <label
                  htmlFor="customPlaceType"
                  className="form-label fw-semibold"
                >
                  Place Type
                </label>

                <select
                  id="customPlaceType"
                  name="type"
                  className="form-select"
                  value={form.type}
                  onChange={handleChange}
                  disabled={adding}
                  required
                >
                  <option value="city">City / Town</option>
                  <option value="state">State / Region</option>
                  <option value="country">Country</option>
                  <option value="attraction">Attraction</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* City */}
              {visibleFields.includes("city") && (
                <div className="col-12 col-md-4">
                  <label htmlFor="customPlaceCity" className="form-label">
                    City (optional)
                  </label>

                  <input
                    id="customPlaceCity"
                    type="text"
                    name="city"
                    className="form-control"
                    placeholder="e.g. Flagstaff"
                    value={form.city}
                    onChange={handleChange}
                    maxLength={120}
                    disabled={adding}
                  />
                </div>
              )}

              {/* State / Region */}
              {visibleFields.includes("state") && (
                <div className="col-12 col-md-4">
                  <label htmlFor="customPlaceState" className="form-label">
                    State / Region (optional)
                  </label>

                  <input
                    id="customPlaceState"
                    type="text"
                    name="state"
                    className="form-control"
                    placeholder="e.g. Arizona"
                    value={form.state}
                    onChange={handleChange}
                    maxLength={120}
                    disabled={adding}
                  />
                </div>
              )}

              {/* Country */}
              {visibleFields.includes("country") && (
                <div className="col-12 col-md-4">
                  <label htmlFor="customPlaceCountry" className="form-label">
                    Country (optional)
                  </label>

                  <input
                    id="customPlaceCountry"
                    type="text"
                    name="country"
                    className="form-control"
                    placeholder="e.g. United States"
                    value={form.country}
                    onChange={handleChange}
                    maxLength={120}
                    disabled={adding}
                  />
                </div>
              )}
            </div>

            {/* Form errors */}
            {error && (
              <div className="alert alert-danger mt-3" role="alert">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="d-flex flex-wrap gap-2 mt-4">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={adding}
              >
                {adding ? "Adding Place..." : "Save Place"}
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleCancel}
                disabled={adding}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
