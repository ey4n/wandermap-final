import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Attraction, Itinerary, Category } from "@prisma/client";
import {
  Burger,
  Button,
  TextInput,
  Textarea,
  Title,
  rem,
  useMantineTheme,
  Notification,
  Text,
  ScrollArea,
} from "@mantine/core";
import { IconGripVertical } from "@tabler/icons-react";
import Navlink from "../../../components/Navlink";
import { useDisclosure } from "@mantine/hooks";
import SearchCategory from "../../../components/SearchCategory";

const EditItinerary: React.FC = () => {
  const router = useRouter();
  const { itineraryId } = router.query;
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [selectedAttractions, setSelectedAttractions] = useState<string[]>([]);
  const [orderedAttractions, setOrderedAttractions] = useState<Attraction[]>(
    []
  );
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const theme = useMantineTheme();
  const [opened, { toggle }] = useDisclosure();

  const [confirmation, setConfirmation] = useState<string>("");

  const [remainingCharsTitle, setRemainingCharsTitle] = useState(50);
  const [remainingCharsDesc, setRemainingCharsDesc] = useState(250);

  const [selectedCategory, setSelectedCategory] = useState<Category[]>([]);
  const [initialAttractions, setInitialAttractions] = useState<Attraction[]>(
    []
  );

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

      setOrderedAttractions(baseAttractions);
      console.log("categoriesArray: ", selectedCategory);
      console.log("filteredAttractions: ", baseAttractions);
    };

    updateAttractions();
  }, [selectedCategory, initialAttractions]);

  const fetchAttractionDetails = async (attractionId) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/get-attraction-by-id?attractionId=${attractionId}`
    );
    const data = await res.json();
    return data;
  };

  useEffect(() => {
    const fetchItineraryDetails = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/select-itinerary-by-id?itineraryId=${itineraryId}`
        );
        const data = await res.json();
        setItinerary(data);
        setTitle(data.title);
        setDesc(data.desc);

        const res2 = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/get-all-attractions`
        );
        const data2 = await res2.json();
        setInitialAttractions(data2);
      } finally {
        setIsLoading(false);
      }
    };

    if (itineraryId) {
      fetchItineraryDetails();
    }
  }, [itineraryId]);

  if (isLoading) {
    return <div>Loading itinerary details...</div>;
  }

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const attractionId = event.target.value;
    if (event.target.checked) {
      setSelectedAttractions([...selectedAttractions, attractionId]);
    } else {
      setSelectedAttractions(
        selectedAttractions.filter((id) => id !== attractionId)
      );
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(orderedAttractions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setOrderedAttractions(items);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const orderedSelectedAttractions = orderedAttractions
      .filter((attraction) =>
        selectedAttractions.includes(attraction.id.toString())
      )
      .map((attraction, index) => ({
        id: attraction.id,
        order: index,
        budget: attraction.budget,
        category: attraction.category,
        desc: attraction.description,
      }));

    console.log("ordered selected attractions: ", orderedSelectedAttractions);

    try {
      console.log("itinerary.isPublished: ", itinerary.isPublished);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/edit-itinerary?itineraryId=${itineraryId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            desc,
            attractions: orderedSelectedAttractions,
            isPublished: itinerary.isPublished,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update itinerary");
      }

      console.log("Itinerary updated:", await res.json());
    } catch (error) {
      console.error("Error updating itinerary:", error);
    }
    setConfirmation("Itinerary updated successfully!");
  };

  const handleSubmitAndPost = async () => {
    // Assuming you want to use the same orderedSelectedAttractions as in handleSubmit
    const orderedSelectedAttractions = orderedAttractions
      .filter((attraction) =>
        selectedAttractions.includes(attraction.id.toString())
      )
      .map((attraction, index) => ({
        id: attraction.id,
        order: index,
        budget: attraction.budget,
        category: attraction.category,
        desc: attraction.description,
      }));

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/edit-itinerary?itineraryId=${itineraryId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            desc,
            attractions: orderedSelectedAttractions,
            isPublished: true,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to post itinerary");
      }

      console.log("Itinerary posted:", await res.json());
      setConfirmation("Itinerary posted successfully!");
    } catch (error) {
      console.error("Error posting itinerary:", error);
    }
  };

  const handleCategoryChange = (selected: Category[]) => {
    setSelectedCategory(selected);
  };

  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          backgroundColor: theme.colors["pastel-purple"][1],
          height: "100vh",
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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flex: 3,
          flexDirection: "column",
        }}
      >
        {/* <h1>Edit Itinerary: {title}</h1> */}
        <form
          onSubmit={handleSubmit}
          style={{ flex: 3, marginLeft: "50px", marginRight: "50px", alignItems: 'center' }}
        >
          {/* <div>
            <label>
              Title:
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
              />
            </label>
          </div>
          <div>
            <label>
              Description:
              <textarea 
                value={desc} 
                onChange={(e) => setDesc(e.target.value)} 
                required 
              />
            </label>
          </div> */}
          <div style={{ 
            display: 'flex', justifyContent:'center' }}>
            <Title
              order={2}
              size="h1"
              style={{
                fontFamily: "Greycliff CF, var(--mantine-font-family)",
                color: "black",
                margin: "20px",
              }}
              fw={900}
              ta="center"
            >
              Edit Itinerary: {title}
            </Title>
          </div>
          <ScrollArea h='90vh'>
          <SearchCategory onSelectedChange={handleCategoryChange} />
          <TextInput
            mt="md"
            label="Title"
            value={title}
            // onChange={(e) => setTitle(e.target.value)}
            onChange={(e) => {
              if (e.target.value.length <= 50) {
                setTitle(e.target.value);
                setRemainingCharsTitle(50 - e.target.value.length);
              }
            }}
            // required
          />
          <Text size="sm" c="dimmed">
            {remainingCharsTitle} characters remaining
          </Text>
          <Textarea
            mt="md"
            label="Description"
            value={desc}
            // onChange={(e) => setDesc(e.target.value)}
            onChange={(e) => {
              if (e.target.value.length <= 250) {
                setDesc(e.target.value);
                setRemainingCharsDesc(250 - e.target.value.length);
              }
            }}
            // required
          />
          <Text size="sm" c="dimmed">
            {remainingCharsDesc} characters remaining
          </Text>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {orderedAttractions.map((attraction, index) => (
                    <Draggable
                      key={attraction.id.toString()}
                      draggableId={attraction.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {/* <label>
                            <input
                              type="checkbox"
                              value={attraction.id}
                              onChange={handleCheckboxChange}
                              checked={selectedAttractions.includes(attraction.id.toString())}
                            />
                            {attraction.name}
                          </label> */}
                          <div
                            style={{
                              display: "flex",
                              margin: "5px",
                              alignItems: "center",
                              padding: "10px",
                              marginBottom: "10px",
                              borderRadius: "7px",
                              backgroundColor: theme.colors["pastel-purple"][2],
                              // backgroundColor: orderedAttractions.some(
                              //   (orderedAttraction) => orderedAttraction.id === attraction.id
                              // )
                              //   ? theme.colors['pastel-purple'][2] // Use purple if attraction is in orderedAttractions
                              //   : 'pink' // Use blue if attraction is not in orderedAttractions
                            }}
                          >
                            <div
                              {...provided.dragHandleProps}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "100%",
                              }}
                            >
                              <IconGripVertical
                                style={{ width: rem(18), height: rem(18) }}
                                stroke={1.5}
                              />
                            </div>
                            <input
                              type="checkbox"
                              value={attraction.id}
                              onChange={handleCheckboxChange}
                              checked={selectedAttractions.includes(
                                attraction.id.toString()
                              )}
                              style={{
                                marginRight: "10px",
                                accentColor: theme.colors["forest-green"][2],
                              }}
                            />
                            <label>
                              <img
                                src={attraction.attractionImage}
                                style={{ width: "30%" }}
                              ></img>
                              <Text>{attraction.name}</Text>
                              <Text c="dimmed" size="sm">
                                Budget: {attraction.budget} • Description:{" "}
                                {attraction.description} • Category:{" "}
                                {attraction.category}
                              </Text>
                            </label>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <div style={{marginBottom: '10px'}}>
            <Button
              type="submit"
              style={{ backgroundColor: theme.colors["forest-green"][2] }}
            >
              Update Itinerary
            </Button>
            <a href="/saved-drafts">
              <Button
                style={{
                  margin: "50px",
                  backgroundColor: theme.colors["forest-green"][2],
                }}
              >
                Back
              </Button>
            </a>
            <a href={`/itinerary/${itineraryId}/review`}>
              <Button
                onClick={handleSubmitAndPost}
                style={{
                  backgroundColor: theme.colors["forest-green"][2],
                  marginLeft: "10px",
                }}
              >
                Post Itinerary
              </Button>
            </a>
          </div>
          </ScrollArea>
        </form>
        {confirmation && (
          <Notification
            title={confirmation}
            color="teal"
            onClose={() => setConfirmation("")}
            closeLabel="Close"
            transition="slide"
            autoClose={3000}
            style={{ position: "fixed", bottom: 20, right: 20 }}
          />
        )}
        
      </div>
    </div>
  );
};

export default EditItinerary;
