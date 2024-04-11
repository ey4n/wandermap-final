import React from 'react';
import Link from 'next/link';
import { Button, useMantineTheme } from '@mantine/core';

const TopButtons: React.FC = () => {
  const theme=useMantineTheme();
  return (
    <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: theme.colors['forest-green'][8] }}>
      <Link href="/explore-locations">
        <Button
          style={{ backgroundColor: theme.colors['forest-green'][6], color: 'white', width: '300px' }} // Set a fixed width for the buttons
          size="lg"
        >
          Your Posts
        </Button>
      </Link>
      <div style={{ width: '10%' }} />
      <Link href="/browse-all-categories">
        <Button
          style={{ backgroundColor: theme.colors['forest-green'][6], color: 'white', width: '300px' }} // Set a fixed width for the buttons
          size="lg" 
        >
          Saved Drafts
        </Button>
      </Link>
      <div style={{ width: '10%' }} />
      <Link href="/top-itineraries">
        <Button
          style={{ backgroundColor: theme.colors['forest-green'][6], color: 'white', width: '300px' }} // Set a fixed width for the buttons
          size="lg"
        >
          Bookmarked
        </Button>
      </Link>
    </div>
  );
};

export default TopButtons;
