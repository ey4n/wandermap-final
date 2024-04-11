import React, { useState } from 'react';
import { ActionIcon, useMantineTheme } from '@mantine/core';
import { IconHeart } from '@tabler/icons-react'; 

interface UpvoteButtonProps {
  itineraryId: any; // Consider using a more specific type if possible, like string or number
  onUpvote: () => void;
  isUpvoted: boolean;
  setIsUpvoted: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpvoteButton: React.FC<UpvoteButtonProps> = ({ itineraryId, onUpvote, isUpvoted, setIsUpvoted }) => {
  const theme = useMantineTheme();

  const handleUpvote = async () => {
    try {
      const response = await fetch('/api/upvote-itinerary', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itineraryId }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setIsUpvoted(!isUpvoted); // Toggle the upvoted state
      onUpvote(); // Notify the parent component

      const data = await response.json();
      console.log('Upvote successful:', data);
    } catch (error) {
      console.error('Error upvoting:', error);
    }
  };

  return (
    <ActionIcon 
      onClick={handleUpvote}
      variant="outline"
      color={isUpvoted ? 'red' : theme.colors.gray[6]} 
      size="lg"
    >
      <IconHeart fill={isUpvoted ? 'red' : 'none'} stroke={isUpvoted ? 'red' : 'currentColor'} />
    </ActionIcon>
  );
};
export default UpvoteButton