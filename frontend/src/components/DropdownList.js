import { getCitiesDestinationsList } from "../Utilities";

export default function DropdownList({ airlineArray, userInputTarget }) {
  return <div>{getCitiesDestinationsList(airlineArray, userInputTarget)}</div>;
}
