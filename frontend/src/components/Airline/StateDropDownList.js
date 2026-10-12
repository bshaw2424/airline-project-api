const StateDropDownList = ({
  destinations = [],
  selectedState,
  setSelectedState,
}) => {
  const states = [
    ...new Set(
      destinations.map(destination => destination.state).filter(Boolean),
    ),
  ].sort((a, b) => a.localeCompare(b));

  return (
    <div className="my-3">
      <select
        className="form-select form-select-sm"
        value={selectedState}
        onChange={e => setSelectedState(e.target.value)}
        aria-label="Select a state"
      >
        <option value="">Select a state</option>

        {states.map(state => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </select>
    </div>
  );
};

export default StateDropDownList;
