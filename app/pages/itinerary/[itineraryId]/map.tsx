"use client";
import Map from "../../../components/Map";
import React from "react";
import { getRoute } from "../../api/get-route";
import getItinerary from "../../api/select-itinerary-by-id";
import { useState, useEffect } from "react";
import RouteSteps from "../../../components/RouteSteps";
import { Button } from "@mantine/core";
import { isContext } from "vm";
import { useRouter } from 'next/router'; 
import { GetServerSideProps } from "next";



const ItineraryMap = ({itinerary}) => {
  const [transitRoute, setTransitRoute] = useState(null);
  const [driveRoute, setDriveRoute] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [isTransit, setIsTransit] = useState(true);
  console.log("itinerary passed in: ", itinerary)

  const fetchAttractionsAndRoutes = async () => {

    setLoading(true); 
    try {
    
        const itineraryAttractions = itinerary.attractions;
        const attractionDetailsPromises = itinerary.attractions.map(async (attraction) => {
            const attractionResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/get-attraction-by-id?attractionId=${attraction.attractionId}`);
            return attractionResponse.json();
          });
        
        const attractionsData = await Promise.all(attractionDetailsPromises);
        console.log("attractionsData: ", attractionsData);

      if (attractionsData && attractionsData.length >= 2) {
        const originAttraction = {
          location: {
            latLng: {
              latitude: attractionsData[0].latitude,
              longitude: attractionsData[0].longitude,
            },
          }
        };
        const destinationAttraction = {
          location: {
            latLng: {
              latitude: attractionsData[1].latitude,
              longitude: attractionsData[1].longitude,
            },
          }
        };
        setOrigin(originAttraction);
        setDestination(destinationAttraction);

        // Now we fetch the routes
        await fetchTransitRoute(originAttraction, destinationAttraction);
        await fetchDriveRoute(originAttraction, destinationAttraction);
      }
    } catch (error) {
      console.error("failed to fetch attractions or routes", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  // Fetches the transit route
  const fetchTransitRoute = async (origin, destination) => {
    try {
      console.log("fetching transit route...");
      const transitRequestBody = {
        origin,
        destination,
        travelMode: "TRANSIT",
        transitPreferences: {
          allowedTravelModes: ["BUS", "SUBWAY", "TRAIN", "LIGHT_RAIL", "RAIL"],
        },
      };
      const transitRouteData = await getRoute(transitRequestBody);
      console.log("transit route data received:", transitRouteData);
      setTransitRoute(transitRouteData);
    } catch (error) {
      console.error("failed to fetch transit route", error);
    }
  };

  // Fetches the drive route
  const fetchDriveRoute = async (origin, destination) => {
    try {
      console.log("fetching drive route...");
      const driveRequestBody = {
        origin,
        destination,
        travelMode: "DRIVE",
      };
      const driveRouteData = await getRoute(driveRequestBody);
      console.log("drive route data received:", driveRouteData);
      setDriveRoute(driveRouteData);
    } catch (error) {
      console.error("failed to fetch drive route", error);
    }
  };

  useEffect(() => {
    fetchAttractionsAndRoutes();
  }, []);

  if (loading) {
    return <div>Loading map...</div>;
  }
  return (
    <div>
      <Map
        transitRoute={transitRoute}
        driveRoute={driveRoute}
        isTransit={isTransit}
      />
      <div className="p-4">
        <Button
          className="border-lg bg-red-400 mr-4"
          color="#ff5c5c"
          onClick={() => setIsTransit(false)}
        >
          drive
        </Button>
        <Button className="bg-blue-300" onClick={() => setIsTransit(true)}> public transport </Button>
      </div>
      {isTransit && <RouteSteps route={transitRoute} />}
      {!isTransit && <RouteSteps route={driveRoute} />}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { itineraryId } = context.params;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/select-itinerary-by-id?itineraryId=${itineraryId}`);
    const itinerary = await res.json();

    return {
      props: {
        itinerary,
      },
    };
  };



export default ItineraryMap;
