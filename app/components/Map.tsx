import { useState, useRef } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  Autocomplete,
  Polyline,
} from "@react-google-maps/api";
import { Button, useMantineTheme } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";


const Map = ({ transitRoute, driveRoute, isTransit }) => {
  // console.log("polyline: ", polyline.routeData);
  // console.log("polyline ", routes["routes"][0]["polyline"]["encodedPolyline"]);
  const theme = useMantineTheme();


  const [selectedPlace, setSelectedPlace] = useState(null);
  const [searchLngLat, setSearchLngLat] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const autocompleteRef = useRef(null);
  const [address, setAddress] = useState("");

  // load script for google map
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places", "geometry"],
  });

  if (!isLoaded) return <div>Loading....</div>;

  // static lat and lng
  const center = { lat:1.3239107341487706, lng: 103.92612789328764 };

  // handle place change on search
  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    setSelectedPlace(place);
    setSearchLngLat({
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    });
    setCurrentLocation(null);
  };

  // get current location
  const handleGetLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSelectedPlace(null);
          setSearchLngLat(null);
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };
  const handleBackButtonClick = () => {
    // window.location.href = `/itinerary`;
    const currentUrl = window.location.href;
    const lastSlashIndex = currentUrl.lastIndexOf('/');
    const newUrl = currentUrl.substring(0, lastSlashIndex);
    window.location.href = newUrl;
  };

  // on map load
  const onMapLoad = (map) => {
    const controlDiv = document.createElement("div");
    const controlUI = document.createElement("div");
    controlUI.innerHTML = "Get Location";
    controlUI.style.backgroundColor = "white";
    controlUI.style.color = "black";
    controlUI.style.border = "2px solid #ccc";
    controlUI.style.borderRadius = "3px";
    controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
    controlUI.style.cursor = "pointer";
    controlUI.style.marginBottom = "22px";
    controlUI.style.textAlign = "center";
    controlUI.style.width = "100%";
    controlUI.style.padding = "8px 0";
    controlUI.addEventListener("click", handleGetLocationClick);
    controlDiv.appendChild(controlUI);

    // const centerControl = new window.google.maps.ControlPosition(
    //   window.google.maps.ControlPosition.TOP_CENTER,
    //   0,
    //   10
    // );

    map.controls[window.google.maps.ControlPosition.TOP_CENTER].push(
      controlDiv
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
      }}
    >
      {/* search component  */}
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '20px', marginTop: '20px'}}>
        <Button onClick={handleBackButtonClick} leftSection={<IconArrowLeft size={14} />} variant="default" style={{ backgroundColor: theme.colors['forest-green'][2], color: 'white' }}>
          Back
        </Button>
        <div style={{width: '1100px'}}></div>
        {/* <Autocomplete
          className="rounded-lg pt-8"
          onLoad={(autocomplete) => {
            console.log("Autocomplete loaded:", autocomplete);
            autocompleteRef.current = autocomplete;
          }}
          onPlaceChanged={handlePlaceChanged}
          options={{ fields: ["address_components", "geometry", "name"] }}
        >
          <input type="text" placeholder="Search for a location" />
        </Autocomplete> */}
      </div>
      <GoogleMap
        zoom={currentLocation || selectedPlace ? 18 : 12}
        center={currentLocation || searchLngLat || center}
        mapContainerClassName="map"
        mapContainerStyle={{ width: "80%", height: "600px", margin: "auto" }}
        onLoad={onMapLoad}
      >

      {/* map component  */}
        <Polyline
          path={isTransit ? google.maps.geometry.encoding.decodePath(
            transitRoute["routes"][0]["polyline"]["encodedPolyline"]) : google.maps.geometry.encoding.decodePath(
              driveRoute["routes"][0]["polyline"]["encodedPolyline"]
          )}
          options={isTransit?{
            strokeColor: "#097969",
            strokeOpacity: 1.0,
            strokeWeight: 4,
          }:{
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 2,
          }}
        />
        {selectedPlace && <Marker position={searchLngLat} />}
        {currentLocation && <Marker position={currentLocation} />}
      </GoogleMap>
    </div>
  );
};

export default Map;
