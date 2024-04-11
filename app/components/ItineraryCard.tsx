import React, { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import {
  Card,
  Image,
  Text,
  Group,
  Button,
  ActionIcon,
  useMantineTheme,
  Badge,
  Divider,
  Rating,
} from "@mantine/core";
import UpvoteButton from "./UpvoteButton";
import classes from "./ItineraryCard.module.css";
import SaveButton from "./SaveButton";
import { useSession } from "next-auth/react";
import { CarouselImage } from "./CarouselImage";
import { IconCoin } from "@tabler/icons-react";

const ItineraryCard = ({ itinerary }) => {
  const [creatorReview, setCreatorReview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { data: session } = useSession();
  const date = new Date(itinerary.createdDate);
  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are zero-indexed (January is 0)
  const year = date.getFullYear();
  const money = itinerary.budget;
  const [upvotes, setUpvotes] = useState(itinerary.upvotes || 0);
  const [isUpvoted, setIsUpvoted] = useState(false);

  const formattedDate = `${day}/${month}/${year}`;

  const incrementUpvote = () => {
    setUpvotes((prevUpvotes) => prevUpvotes + 1);
  };

  useEffect(() => {
    const fetchCreatorReview = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/get-creator-review?itineraryId=${itinerary.id}`
        );
        // if (!res.ok) {
        //   throw new Error('Failed to fetch creator review');
        // }
        const data = await res.json();
        setCreatorReview(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchSession = async () => {
      const session = await getSession();
      setIsLoggedIn(!!session);
    };

    fetchCreatorReview();
    fetchSession();
  }, [itinerary.id]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const theme = useMantineTheme();
  const btnGroupStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%", // Use all of the space available in the column
  };

  const currentUserEmail = session?.user?.email;

  return (
    <Card
      withBorder
      radius="md"
      p="md"
      className={classes.card}
      style={{ backgroundColor: theme.colors["pastel-purple"][2] }}
    >
      <div
        style={{ ...btnGroupStyle, display: "flex", flexDirection: "column" }}
      >
        <Card.Section>
          {creatorReview && (
            <CarouselImage imageUrls={creatorReview.imageUrl}></CarouselImage>
          )}
        </Card.Section>
        <Card.Section className={classes.section} mt="md">
          <Group justify="apart">
            <Text fz="md" fw={500}>
              {itinerary.title}
            </Text>
            <Rating
              value={itinerary.budget / 25}
              fractions={2}
              fullSymbol={<IconCoin size="1.1rem" />}
              emptySymbol={<IconCoin size="1.1rem" color="white"></IconCoin>}
              readOnly
            ></Rating>
          </Group>
          {/* <Divider my="xs" label="Budget" labelPosition="left" color='forest-green'/>
            <Text fz="sm" mt="xs">
              ${itinerary.budget}
            </Text> */}
          <Divider
            my="xs"
            label="Description"
            labelPosition="left"
            color="forest-green"
          />
          <Text fz="sm" mt="xs">
            {itinerary.desc}
          </Text>
          <Divider
            my="xs"
            label="Date Created"
            labelPosition="left"
            color="forest-green"
          />
          <Text fz="sm" mt="xs">
            {formattedDate}
          </Text>
        </Card.Section>
        <Card.Section className={classes.section}>
          <Text mt="md" className={classes.label} c="dimmed">
            Related Categories
          </Text>
          <Group gap={7} mt={5}>
            {/* {itinerary.category.map((category) => (<Badge color="forest-green">{category}</Badge>))} */}
            {itinerary.category &&
              itinerary.category.length > 0 &&
              itinerary.category.map((category) => (
                <Badge color="forest-green">{category}</Badge>
              ))}
          </Group>
        </Card.Section>
        <Group mt="xs">
          <a href={`/itinerary/${itinerary.id}`}>
            <Button
              radius="md"
              style={{
                flex: 1,
                backgroundColor: theme.colors["forest-green"][2],
              }}
            >
              Show details
            </Button>
          </a>
          {isLoggedIn && (
            <a href={`/itinerary/${itinerary.id}/review`}>
              <Button
                radius="md"
                style={{
                  flex: 1,
                  backgroundColor: theme.colors["forest-green"][2],
                }}
              >
                Review
              </Button>
            </a>
          )}
          {isLoggedIn && (
            <SaveButton
              itineraryId={itinerary.id}
              currentUserEmail={currentUserEmail}
            />
          )}
          <UpvoteButton
            itineraryId={itinerary.id}
            onUpvote={incrementUpvote}
            isUpvoted={isUpvoted}
            setIsUpvoted={setIsUpvoted}
          />
          <div>{upvotes}</div>
        </Group>
      </div>
    </Card>
  );
};

export default ItineraryCard;
