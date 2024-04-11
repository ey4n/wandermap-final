
import React from 'react';
import { ActionIcon, Button } from '@mantine/core';
import { useMantineTheme } from '@mantine/core';
import { IconBookmark } from '@tabler/icons-react/';

const SaveButtonBig = ({ itineraryId, currentUserEmail}) => {
  const [isSaving, setIsSaving] = React.useState(false);
  const [isSaved, setIsSaved] = React.useState(false);
  const theme=useMantineTheme();

  const handleSaveClick = async () => {
    setIsSaving(true);
    setIsSaved(!isSaved);
    try {
      const response = await fetch('/api/save-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itineraryId, currentUserEmail}),
      });

      if (response.ok) {
        console.log('Itinerary saved successfully!');
        setIsSaved(!isSaved);
      } else {
        const errorData = await response.json();
        console.error('Failed to save itinerary:', errorData.message);
      }
    } catch (error) {
      console.error('Error saving itinerary:', error);
    } finally {
      setIsSaving(false);
    }
  };
  if(!isSaved){
      return (
        // <Button onClick={handleSaveClick} disabled={isSaving}>
        //   {isSaving ? 'Saving...' : 'Save Itinerary'}
        // </Button>
        <Button 
        onClick={handleSaveClick}
        disabled={isSaving}
        variant="outline"
        color={isSaving ? 'yellow' : 'black'} 
        size="md"
        radius="md"
        leftSection={<IconBookmark fill={isSaved ? theme.colors['pastel-purple'][6] : 'black'} />}
      >
        {/* <IconBookmark fill={isSaved ? 'red' : ''} stroke={isSaved ? 'yellow' : 'currentColor'} /> */}
        Save Itinerary
      </Button>
      );
  }
  else{
      return (
        // <Button onClick={handleSaveClick} disabled={isSaving}>
        //   {isSaving ? 'Saving...' : 'Save Itinerary'}
        // </Button>
        <Button 
        onClick={handleSaveClick}
        disabled={isSaving}
        variant="outline"
        color={isSaving ? 'yellow' : theme.colors['pastel-purple'][7]} 
        size="md"
        radius="md"
        leftSection={<IconBookmark fill={isSaved ? theme.colors['pastel-purple'][6] : theme.colors['pastel-purple'][7]} />}
      >
        {/* <IconBookmark fill={isSaved ? 'red' : ''} stroke={isSaved ? 'yellow' : 'currentColor'} /> */}
        Saved!
      </Button>
      );
  }

};

export default SaveButtonBig;
