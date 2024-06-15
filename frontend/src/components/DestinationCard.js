import SeasonalInternationalCheck from "./SeasonalInternationalCheck";
import { CiLocationOn } from "react-icons/ci";
import { MdLocalAirport } from "react-icons/md";

const DestinationCard = ({
  _id,
  name,
  airport_code,
  airport_name,
  city,
  state,
  location,
}) => (
  <>
    <div className="width">
      <h4 className="card-title">
        {name} - ( {airport_code} )
      </h4>
    </div>
    <div className="width ps-lg-5">
      <p className="d-flex align-items-center">
        <b className="me-1 pb-1">
          <MdLocalAirport />
        </b>
        {airport_name}
      </p>

      <p>
        <b className="me-1 pb-2">
          <CiLocationOn />
        </b>
        {city}, {state}
      </p>
    </div>

    <SeasonalInternationalCheck
      destinationCategory={location}
      stringBooleanValue={"true"}
    />
  </>
);

export default DestinationCard;
