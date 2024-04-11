import React, { useState } from "react";
import { Attraction } from "@prisma/client";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  TextInput,
  Textarea,
  Title,
  Button,
  Notification,
  rem,
  Text,
} from "@mantine/core";
import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";
import { IconGripVertical } from "@tabler/icons-react";
import { useMantineTheme } from "@mantine/core";
import { CarouselImage } from "./CarouselImage";

interface CreateItineraryFormProps {
  attractions: Attraction[];
  currentUser: User;
}

const CreateItineraryForm: React.FC<CreateItineraryFormProps> = ({
  attractions,
  currentUser,
}) => {
  const [selectedAttractions, setSelectedAttractions] = useState<string[]>([]);
  const [orderedAttractions, setOrderedAttractions] =
    useState<Attraction[]>(attractions);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [confirmation, setConfirmation] = useState<string>("");
  const theme = useMantineTheme();
  const [remainingCharsTitle, setRemainingCharsTitle] = useState(50);
  const [remainingCharsDesc, setRemainingCharsDesc] = useState(250);
  const [titleError, setTitleError] = useState(false);
  const [titleErrorMessage, setTitleErrorMessage] = useState("");
  const [descError, setDescError] = useState(false);
  const [descErrorMessage, setDescErrorMessage] = useState("");

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(orderedAttractions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setOrderedAttractions(items);
  };

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

  const handleSubmit = async (event: React.FormEvent, isPublished: boolean) => {
    event.preventDefault();

    try {
      const orderedSelectedAttractions = orderedAttractions
        .filter((attraction) =>
          selectedAttractions.includes(attraction.id.toString())
        )
        .map((attraction, index) => ({
          id: attraction.id,
          budget: attraction.budget,
          category: attraction.category,
          desc: attraction.description,
          order: index,
        }));

      const formData = {
        userEmail: currentUser.email,
        attractions: orderedSelectedAttractions,
        title: title,
        desc: desc,
        budget: orderedSelectedAttractions.reduce(
          (acc, attraction) => acc + attraction.budget,
          0
        ),
        category: Array.from(
          new Set(
            orderedSelectedAttractions.map((attraction) => attraction.category)
          )
        ),
        isPublished: isPublished,
      };

      if (!formData.title || formData.title.trim() === "") {
        setTitleError(true);
        setTitleErrorMessage("Please input a title");
        return;
      } else {
        setTitleError(false);
        setTitleErrorMessage("");
      }

      if (!formData.desc || formData.desc.trim() === "") {
        setDescError(true);
        setDescErrorMessage("Please provide a description");
        return;
      } else {
        setDescError(false);
        setDescErrorMessage("");
      }

      const response = await fetch("/api/create-itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok && isPublished == true) {
        const data = await response.json();
        const itineraryId = data.itineraryId;
        console.log(
          "Itinerary submitted successfully! Itinerary ID:",
          itineraryId
        );

        window.location.href = `/itinerary/${itineraryId}/review`;
      } else {
        throw new Error("Failed to submit itinerary");
      }
    } catch (error) {
      console.error("Failed to submit itinerary:", error);
    }

    setConfirmation("Itinerary saved successfully!");
    setSelectedAttractions([]);
    setTitle("");
    setDesc("");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* <div style={{ flex: 1 }}></div> */}
      <form style={{ marginLeft: "200px", marginRight: "200px" }}>
        <div>
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
            required
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
            required
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
                      isDragDisabled={
                        !selectedAttractions.includes(attraction.id.toString())
                      }
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div
                            style={{
                              display: "flex",
                              margin: "5px",
                              alignItems: "center",
                              padding: "10px",
                              marginBottom: "10px",
                              backgroundColor: theme.colors["pastel-purple"][2],
                              borderRadius: "7px",
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
                                style={{ width: "300px" }}
                              ></img>
                              <Text>{attraction.name}</Text>
                              <Text c="dimmed" size="sm">
                                Budget: {attraction.budget} • Description:{" "}
                                {attraction.description}
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
          {/* <div style={{ minHeight: '20px' }}></div> */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "20px",
            }}
          >
            <Button
              type="button"
              size="md"
              style={{ backgroundColor: theme.colors["forest-green"][2] }}
              onClick={(e) => handleSubmit(e, false)}
            >
              Save as Draft
            </Button>
            <Button
              type="button"
              size="md"
              style={{ backgroundColor: theme.colors["forest-green"][2] }}
              onClick={(e) => handleSubmit(e, true)}
            >
              Submit Itinerary
            </Button>
          </div>
        </div>
      </form>
      {/* <div style={{ flex: 1 }}></div> */}

      {}
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
      {titleError && (
        <Notification
          title={titleErrorMessage}
          color="red"
          onClose={() => {
            setTitleError(false);
            setTitleErrorMessage("");
          }}
          closeLabel="Close"
          transition="slide"
          autoClose={5000}
          style={{ position: "fixed", bottom: 20, right: 20 }}
        />
      )}
      {descError && (
        <Notification
          title={descErrorMessage}
          color="red"
          onClose={() => {
            setDescError(false);
            setDescErrorMessage("");
          }}
          closeLabel="Close"
          transition="slide"
          autoClose={5000}
          style={{ position: "fixed", bottom: 20, right: 20 }}
        />
      )}
    </div>
  );
};

export default CreateItineraryForm;
