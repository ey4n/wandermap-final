import React, { useState } from 'react';
import { MantineProvider, useMantineTheme, Title, Button, Burger, ScrollArea } from '@mantine/core';
import { getSession } from 'next-auth/react';
import ItineraryCard from '../../components/ItineraryCard';
import OwnItineraryCard from '../../components/OwnItineraryCard';
import { useDisclosure } from "@mantine/hooks";
import Navlink from "../../components/Navlink";

const BrowseUserItineraries = ({ currentUser, itineraries, savedItineraries }) => {
  const theme = useMantineTheme();
//   const [showPublished, setShowPublished] = useState(true);
//   const [showDrafts, setShowDrafts] = useState(false);
//   const [showBookmarked, setShowBookmarked] = useState(false);
  const [opened, { toggle }] = useDisclosure();

  console.log("itineraries: ", itineraries)
  console.log("saved itineraries: ", savedItineraries[0]);

  return (
    <MantineProvider>
      <div style={{ display: 'flex' }}>
        {/* <Navbar />
         */}
         <div style={{  backgroundColor: theme.colors["pastel-purple"][1] }}>
          <Burger opened={opened} onClick={toggle} aria-label="Toggle navigation" />
          {opened && (
            <div style={{ backgroundColor: theme.colors["pastel-purple"][1], flex: 1 }}>
              <Navlink></Navlink>
            </div>
          )}
        </div>
        <div style={{ flex: 1, flexDirection: 'column' }}>
        <Title style={{margin: '20px'}}>
          Browse your bookmarked itineraries
        </Title>
        <ScrollArea h='90vh'>
          <div
            style={{
              minHeight: '100vh',
              display: 'flex',
              flexWrap: 'wrap',
              marginLeft: '10px',
              marginRight: '10px',
            }}
          >
            {/* {itineraries.map((itinerary) => (
                <div key={itinerary.id}>
                  { itinerary.isPublished && <ItineraryCard itinerary={itinerary} />}
                  {!itinerary.isPublished && <OwnItineraryCard itinerary={itinerary} />}
                </div>
              ))} */}
            { savedItineraries.length > 0 ? (
                savedItineraries.map((itinerary) => (
                  <div key={itinerary.itinerary.id}>
                    <ItineraryCard itinerary={itinerary.itinerary} />
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center' }}>No saved itineraries found</div> 
              )
            }
          </div>
        </ScrollArea>
        </div>
      </div>
    </MantineProvider>
  );
};

export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  if (!session || !session.user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  try {
    const [itinerariesRes, savedItinerariesRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user-itineraries`, {
        headers: {
          Cookie: context.req.headers.cookie || '',
        },
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/get-saved-itineraries`, {
        headers: {
          Cookie: context.req.headers.cookie || '',
        },
      }),
    ]);


    const [itineraries, savedItineraries] = await Promise.all([
      itinerariesRes.ok ? itinerariesRes.json() : [],
      savedItinerariesRes.ok ? savedItinerariesRes.json() : [],
    ]);

    return {
      props: {
        currentUser: session.user,
        itineraries,
        savedItineraries,
      },
    };
  } catch (error) {
    console.error('Error fetching itineraries:', error);
    return {
      notFound: true,
    };
  }
};

export default BrowseUserItineraries;
