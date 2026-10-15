import { useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { FaCheck, FaFolder, FaFolderPlus, FaPlus } from "react-icons/fa";

import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function AddToCollection({ destination }) {
  const { isLoggedIn, loading: authLoading } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const airportCode = destination?.airport_code;

  const handleOpen = async () => {
    setIsOpen(true);
    setError("");
    setSuccess("");

    if (!isLoggedIn) return;

    setLoading(true);

    try {
      const response = await api.get("/api/collections");
      setCollections(response.data.collections || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load your collections.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setError("");
    setSuccess("");
  };

  const handleAdd = async collectionId => {
    if (!airportCode || savingId) return;

    setSavingId(collectionId);
    setError("");
    setSuccess("");

    try {
      const response = await api.post(
        `/api/collections/${collectionId}/destinations`,
        { airportCode },
      );

      const updatedCollection = response.data.collection;

      setCollections(previous =>
        previous.map(collection =>
          collection._id === collectionId ? updatedCollection : collection,
        ),
      );

      setSuccess(`Destination added to ${updatedCollection.name}.`);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to add destination.");
    } finally {
      setSavingId(null);
    }
  };

  if (!airportCode) return null;

  return (
    <>
      <button
        type="button"
        className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-2"
        onClick={handleOpen}
        disabled={authLoading}
        aria-label={`Add ${destination.name || airportCode} to a collection`}
      >
        <FaFolderPlus />
        <span>Collection</span>
      </button>

      {isOpen &&
        createPortal(
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`collection-modal-${airportCode}`}
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onMouseDown={event => {
              if (event.target === event.currentTarget) {
                handleClose();
              }
            }}
          >
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header">
                  <h2
                    className="modal-title fs-5"
                    id={`collection-modal-${airportCode}`}
                  >
                    Add {destination.name || airportCode} to Collection
                  </h2>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleClose}
                    aria-label="Close"
                  />
                </div>

                <div className="modal-body">
                  {!isLoggedIn ? (
                    <div>
                      <p className="text-muted">
                        Log in to save destinations to collections.
                      </p>

                      <Link
                        to="/login"
                        className="btn btn-primary"
                        onClick={handleClose}
                      >
                        Log In
                      </Link>
                    </div>
                  ) : loading ? (
                    <div className="text-center py-4">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">
                          Loading collections...
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      {error && (
                        <div className="alert alert-danger" role="alert">
                          {error}
                        </div>
                      )}

                      {success && (
                        <div className="alert alert-success" role="status">
                          {success}
                        </div>
                      )}

                      {collections.length === 0 ? (
                        <div className="text-center py-3">
                          <FaFolder size={30} className="text-secondary mb-3" />

                          <p className="text-muted">
                            You haven't created any collections yet.
                          </p>

                          <Link
                            to="/collections"
                            className="btn btn-outline-primary"
                            onClick={handleClose}
                          >
                            Create a Collection
                          </Link>
                        </div>
                      ) : (
                        <div className="d-flex flex-column gap-2">
                          {collections.map(collection => {
                            const alreadyAdded =
                              collection.destinations?.includes(airportCode);

                            return (
                              <div
                                key={collection._id}
                                className="d-flex justify-content-between align-items-center gap-3 border rounded-3 p-3"
                              >
                                <div className="d-flex align-items-center gap-2 flex-grow-1">
                                  <FaFolder className="text-secondary flex-shrink-0" />

                                  <span className="text-break">
                                    {collection.name}
                                  </span>
                                </div>

                                <button
                                  type="button"
                                  className={`btn btn-sm ${
                                    alreadyAdded
                                      ? "btn-outline-secondary"
                                      : "btn-outline-primary"
                                  }`}
                                  disabled={alreadyAdded || Boolean(savingId)}
                                  onClick={() => handleAdd(collection._id)}
                                  aria-label={
                                    alreadyAdded
                                      ? `Already saved to ${collection.name}`
                                      : `Add to ${collection.name}`
                                  }
                                >
                                  {savingId === collection._id ? (
                                    <span
                                      className="spinner-border spinner-border-sm"
                                      aria-hidden="true"
                                    />
                                  ) : alreadyAdded ? (
                                    <FaCheck />
                                  ) : (
                                    <FaPlus />
                                  )}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleClose}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
