import { useState, useEffect } from 'react';
import { Image } from "@mantine/core";
import Comments from './Comments';
import { comment } from 'postcss';
import { useMantineTheme } from '@mantine/core'; 

const ReviewBox = ({ review }) => {
  const [user, setUser] = useState(null);
  const theme = useMantineTheme();

  useEffect(() => {
    const fetchUser = async () => {
        console.log("review.createdByUserEmail: ", review.createdByUserEmail)
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/get-user-by-email?userEmail=${review.createdByUserEmail}`);
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          console.error('Failed to fetch user data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (review && review.createdByUserEmail) {
      fetchUser();
    }
  }, [review]);

  console.log("review in box: ", review);
  if(review.createdByUserEmail === review.currentUserEmail) { // @ eyan i need figure this out later
    return (
      <div>
        <div style={{backgroundColor: theme.colors['pastel-purple'][6]}}>
          <Comments comment={review} user={user} />
        </div>
      </div>
    );
      }
  else{
    return(
      <div>
        <Comments comment={review} user={user} />
      </div>
    )
  }
};


export default ReviewBox;
