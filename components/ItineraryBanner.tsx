import React from 'react';
import { Title, Text, Button, Image, useMantineTheme, MantineProvider } from '@mantine/core';
import classes from './ItineraryBanner.module.css';
import UpvoteButton from './UpvoteButton';

interface User {
  name: string;
  email: string;
}

interface Itinerary {
  id: string;
  title: string;
  user: User;
  desc: string;
}

interface ItineraryBannerProps {
  itinerary: Itinerary;
}

export const ItineraryBanner: React.FC<ItineraryBannerProps> = ({ itinerary }) => {
  const theme = useMantineTheme();
    return (
      <MantineProvider>

      <div className={classes.wrapper} style={{backgroundColor: theme.colors['pastel-purple'][6]}}>
        <Image
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9cML8aG9ns-aa60F7L3aMuoJZPWDelLeGDUtrEtv3bA&s"
          className={classes.image}
          style={{ width: '300px', height: '300px' }}
        />
        <div className={classes.body}>
          <div>
            <Title className={classes.title}>{itinerary.title}</Title>
            <Text>{itinerary.desc}</Text>
          </div>
        </div>
        <Button className={classes.viewMoreButton} radius="sm" color='forest-green'>
          View More
        </Button>
        <div className={classes.upvoteButtonContainer}>
          <UpvoteButton itineraryId={itinerary.id}/>
        </div>
        <Button className={classes.bookmarksButton} radius="sm" color='forest-green'>
          Bookmark
        </Button>
      </div>
      </MantineProvider>
    );
  };
  