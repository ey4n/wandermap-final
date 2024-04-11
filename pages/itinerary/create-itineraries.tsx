import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import CreateItineraryForm from "../../components/CreateItineraryForm";
import { useMantineTheme, Burger, ScrollArea, Title } from "@mantine/core";
import Navlink from "../../components/Navlink";
import { useDisclosure } from "@mantine/hooks";
import SearchCategory from "../../components/SearchCategory";
import { Category, Attraction, User } from "@prisma/client";

interface CreateItineraryProps { 
  initialAttractions: Attraction[];
  currentUser: User;
}

const CreateItinerary: React.FC<CreateItineraryProps> = ({
  initialAttractions,
  currentUser,
}) => {
  const [isClient, setIsClient] = useState(false);
  const theme = useMantineTheme();
  const [opened, { toggle }] = useDisclosure();
  const [selectedCategory, setSelectedCategory] = useState<Category[]>([]);
  const [attractions, setAttractions] = useState<Attraction[]>([]);

  useEffect(() => {
    const updateAttractions = () => {
      let baseAttractions = initialAttractions;

      if (selectedCategory.length > 0) {
        const categoriesArray = Array.isArray(selectedCategory)
          ? selectedCategory
          : [selectedCategory];

        baseAttractions = baseAttractions.filter((attraction) => {
          return categoriesArray.some((cat) => {
            console.log("Checking: ", attraction.category, " against ", cat);
            return attraction.category.includes(cat);
          });
        });
      }

      setAttractions(baseAttractions);
      console.log("categoriesArray: ", selectedCategory);
      console.log("filteredAttractions: ", baseAttractions);
    };

    updateAttractions();
  }, [selectedCategory, initialAttractions]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const handleCategoryChange = (selected: Category[]) => {
    setSelectedCategory(selected);
  };

  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          height: "100vh",
          backgroundColor: theme.colors["pastel-purple"][1],
        }}
      >
        <Burger
          opened={opened}
          onClick={toggle}
          aria-label="Toggle navigation"
        />
        {opened && (
          <div
            style={{
              height: "100%",
              backgroundColor: theme.colors["pastel-purple"][1],
              flex: 1,
            }}
          >
            <Navlink></Navlink>
          </div>
        )}
      </div>
      <div style={{ flex: 3 }}>
          <Title
            order={2}
            size="h1"
            style={{ fontFamily: 'Greycliff CF, var(--mantine-font-family)', color: 'black', margin: '20px'}}
            fw={900}
            ta="center"
          >
            Create An Itinerary
          </Title>
        <ScrollArea h={"90vh"}>
        <div style={{marginLeft: '200px', marginRight: '200px'}}>
          <SearchCategory onSelectedChange={handleCategoryChange} />
        </div>
          <CreateItineraryForm
            key={attractions.length}
            attractions={attractions}
            currentUser={currentUser}
          />
        </ScrollArea>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/get-all-attractions`
  );
  const initialAttractions = await res.json();
  const session = await getSession({ req: context.req });

  if (!session || !session.user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      initialAttractions,
      currentUser: session.user,
    },
  };
};

export default CreateItinerary;