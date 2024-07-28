import { useEffect } from "react";
import { envVars } from "../config/envVars";
import axios from "axios";

interface AddressComponent {
  types: string[];
}

const HomePage = () => {
  const cityNames = ["Belgrade", "Subotica", "Novi Sad", "Zagreb", "Sarajevo"];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getAddress, addressForbidden);
    } else {
      console.log("Geolocation is not supported.");
    }
  }, []);

  const getAddress = async (location: GeolocationPosition) => {
    const { latitude, longitude } = location.coords;
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${envVars.API_KEY}`
      );
      const data = await response.data;

      if (data.results && data.results.length > 0) {
        const cityComponent = data.results[0].address_components.find(
          (component: AddressComponent) => component.types.includes("locality")
        );

        if (cityComponent) {
          console.log(cityComponent.long_name);
        } else {
          console.log("City not found");
        }
      } else {
        console.log("No results found");
      }
    } catch (error) {
      console.error("Error fetching city:", error);
    }
  };

  const addressForbidden = () => console.log("We got rejected!");

  return (
    <div className="flex justify-center items-start">
      <form>
        <select>
          {cityNames.map((city, index) => (
            <option key={index} value={city}>
              {city}
            </option>
          ))}
        </select>
        <button className="border border-black rounded-md mx-2 p-2">
          Submit
        </button>
      </form>
    </div>
  );
};

export default HomePage;
