import React, { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { Card, Image, Text, Group, Button, ActionIcon, useMantineTheme } from '@mantine/core';
import classes from './OwnItineraryCard.module.css';

const ItineraryCardEdit = ({ itinerary }) => {
  const [creatorReview, setCreatorReview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchCreatorReview = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/get-creator-review?itineraryId=${itinerary.id}`);
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

    // fetchCreatorReview();
    fetchSession();
  }, [itinerary.id]);

  const handleDeleteItinerary = async () => {
    if (!confirm('Are you sure you want to delete this itinerary?')) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/delete-itinerary`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itineraryId: itinerary.id }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete itinerary');
      alert('Itinerary deleted successfully');

      window.location.reload();

    } catch (error) {
      setError(error.message);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const theme = useMantineTheme();

  return (
    <Card withBorder radius="md" p="md" className={classes.card} >
      <Card.Section>
        {creatorReview && creatorReview.imageUrl ? (
          <Image src={creatorReview.imageUrl} alt={itinerary.title} height={180} />
        ) : (
          // <Text size="xl" ta="center">No Image</Text>
          <Image src="https://savethefrogs.com/wp-content/uploads/placeholder-image-blue-landscape.png"></Image>
        )}
      </Card.Section>

      <Card.Section className={classes.section} mt="md">
        <Group justify="apart">
          <Text fz="lg" fw={500}>
            {itinerary.title}
          </Text>
        </Group>
        <Text fz="sm" mt="xs">
          {itinerary.desc}
        </Text>
      </Card.Section>

      <Group mt="xs">
      <Button
          radius="md"
          style={{ backgroundColor: theme.colors['forest-green'][2] }}
          onClick={handleDeleteItinerary}
        >
          Delete
        </Button>
        {isLoggedIn && (
          <a href={`/itinerary/${itinerary.id}/edit`}>
            <Button radius="md" style={{ backgroundColor: theme.colors['forest-green'][2] }}>
              Edit
            </Button>

          </a>
        )}
        {/* <Button radius="md" style={{ backgroundColor: theme.colors['forest-green'][2] }}>
          Post
        </Button> */}
      </Group>
    </Card>
  );
};

export default ItineraryCardEdit;
