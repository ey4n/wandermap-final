import React, { useEffect, useState } from "react";
import { GetServerSideProps, NextPage } from "next";
import { Itinerary, Category } from "@prisma/client";
import ItineraryCard from "../../components/ItineraryCard";
import { MantineProvider, Burger, useMantineTheme, Button, Title, ScrollArea, Center } from "@mantine/core";
import SearchCategory from "../../components/SearchCategory";
import Navlink from "../../components/Navlink";
import { useDisclosure } from "@mantine/hooks";
import { initialize } from "next/dist/server/lib/render-server";

interface BrowseProps {
  initialItineraries: Itinerary[];
}

export async function getServerSideProps(){
  console.log("loading")
  const res = await fetch("http://localhost:3000/api/published-itineraries");
  const itineraries: Itinerary[] = await res.json();
  return {
    props: {
      initialItineraries: itineraries,
    },
  };
};

// const getItineraries = async () => {
//   console.log("called");
//   try {
// 		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/published-itineraries`);
// 		const data = await res.json();
// 		console.log(data);
//     return {
//       props: {
//         initialItineraries: data,
//       }
//     }
// 	} catch (err) {
// 		console.log(err);
// 	}
// }

const Browse: NextPage<BrowseProps> = ({ initialItineraries }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category[]>([]);
  const [itineraries, setItineraries] = useState<Itinerary[]>(initialItineraries);
  const [opened, { toggle }] = useDisclosure();
  const theme = useMantineTheme();
  

  useEffect(() => {

    const updateItineraries = () => {
      if (selectedCategory.length === 0) {
        // Reset itineraries to initialItineraries
        setItineraries(initialItineraries);
      } else {
      const categoriesArray = Array.isArray(selectedCategory) ? selectedCategory : [selectedCategory];
      const filteredItineraries = itineraries.filter((itinerary) => {
        return categoriesArray.every(cat => itinerary.category.includes(cat));
      });
      setItineraries(filteredItineraries);
    }
    };

    updateItineraries();
  }, [selectedCategory]);

  const handleCategoryChange = (selected: Category[]) => { // Update to handle array
    setSelectedCategory(selected);
    console.log('selectedCategory:', selected);
    console.log('length of selectedCategory: ', selected.length);
    console.log('category',Category);
  };

  const sortItineraries = (criteria: string) => {
    let sortedItineraries: Itinerary[] = [];

    switch (criteria) {
      case "upvotes":
        sortedItineraries = [...itineraries].sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
        break;
      case "recent":
        sortedItineraries = [...itineraries].sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
        break;
      case "cheapest":
        sortedItineraries = [...itineraries].sort((a, b) => (a.budget || 0) - (b.budget || 0));
        break;
      default:
        sortedItineraries = itineraries;
        break;
    }

    setItineraries(sortedItineraries);
  };
  return (
    <MantineProvider>
      <div style={{ display: "flex" }}>
        <div style={{backgroundColor: theme.colors['pastel-purple'][1]}}>
          <Burger opened={opened} onClick={toggle} aria-label="Toggle navigation" />
            {opened && (<div style={{height: '100%', backgroundColor: theme.colors['pastel-purple'][1], flex: 1}}>
              <Navlink></Navlink>
            </div>)}
        </div>
        <div style={{ flex: 3 }}>
        <Title style={{margin: '20px'}}>
          Browse all itineraries
        </Title>
          <div>
            <div style={{ margin: "20px" }}>
              <SearchCategory onSelectedChange={handleCategoryChange} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-evenly', margin: '10px' }}>
              <Button onClick={() => sortItineraries("upvotes")} radius="md" style={{ marginRight: "10px", backgroundColor: theme.colors['forest-green'][2]}}>
                Sort by Upvotes
              </Button>
              <Button onClick={() => sortItineraries("recent")} radius="md" style={{ marginRight: "10px", backgroundColor: theme.colors['forest-green'][2]}}>
                Sort by Recent
              </Button>
              <Button onClick={() => sortItineraries("cheapest")} radius="md" style={{ marginRight: "10px", backgroundColor: theme.colors['forest-green'][2]}}>
                Sort by Cheapest
              </Button>
            </div>
            <ScrollArea h={'100vh'}>
            <div style={{ display: "flex", flexWrap: "wrap", marginLeft: "10px", marginRight: "10px" }}>
              {/* {itineraries.map((itinerary) => (
      <ItineraryCard key={itinerary.id} itinerary={itinerary} />
    ))} */}
  { selectedCategory.length === 0 ? (
    // Display all itineraries
    itineraries.map((itinerary) => (
      <>
      <ItineraryCard key={itinerary.id} itinerary={itinerary}/>
      {/* <div>HIHIHH</div> */}
    </>
    ))
  ) : ( 
    // Filter and display itineraries based on selected categories (existing logic)
    itineraries.filter((itinerary) =>
      itinerary.category.some((cat) => selectedCategory.includes(cat))
    ).length > 0 ? (
      itineraries.filter((itinerary) =>
        itinerary.category.some((cat) => selectedCategory.includes(cat))
      ).map((itinerary) => (
        <ItineraryCard key={itinerary.id} itinerary={itinerary} />
      ))
    ) : (
      <Title order={3} style={{textAlign: 'center'}}>
        No itinerary found
      </Title>
    )
  )}
</div>

              {/* <div style={{ display: "flex", flexWrap: "wrap", marginLeft: "10px", marginRight: "10px" }}>
                { itineraries.filter((itinerary) =>
                  selectedCategory.length === 0 ||
                  itinerary.category.some((cat) => selectedCategory.includes(cat))
                ).length > 0 ? (
                  itineraries.filter((itinerary) =>
                    selectedCategory.length === 0 ||
                    itinerary.category.some((cat) => selectedCategory.includes(cat))
                  ).map((itinerary) => (
                    <ItineraryCard key={itinerary.id} itinerary={itinerary} />
                  ))
                ) : ( 
                  <Title order={3} style={{textAlign: 'center'}}> 
                    No itinerary found
                  </Title> 
            )}
              </div> */}
            </ScrollArea>
          </div>
        </div>
      </div>
    </MantineProvider>
  );
};



export default Browse;

