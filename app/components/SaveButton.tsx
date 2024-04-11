import React from 'react';
import { ActionIcon } from '@mantine/core';
import { useMantineTheme } from '@mantine/core';
import { IconBookmark } from '@tabler/icons-react/';

const SaveButton = ({ itineraryId, currentUserEmail}) => {
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

  return (
    // <Button onClick={handleSaveClick} disabled={isSaving}>
    //   {isSaving ? 'Saving...' : 'Save Itinerary'}
    // </Button>
    <ActionIcon 
    onClick={handleSaveClick}
    disabled={isSaving}
    variant="outline"
    color={isSaving ? 'yellow' : theme.colors.gray[6]} 
    size="lg"
  >
    <IconBookmark fill={isSaved ? 'red' : ''} stroke={isSaved ? 'yellow' : 'currentColor'} />
  </ActionIcon>
  );
};

export default SaveButton;
