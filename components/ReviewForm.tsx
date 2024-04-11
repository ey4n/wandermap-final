import React, { useState } from 'react';
import { useMantineTheme } from '@mantine/core';
import { TextInput, Textarea, SimpleGrid, Group, Title, Button, Rating, Text } from '@mantine/core';
import Link from 'next/link';
import { FileInput } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';

interface ReviewFormProps {
  itineraryId: string;
  currentUserEmail: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ itineraryId, currentUserEmail }) => {
  const [comment, setComment] = useState<string>('');
  const [rating, setRating] = useState(0);
  const [images, setImages] = useState<File[] | null>([]);
  // const [image, setImage] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const theme = useMantineTheme();
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [remainingCharsComment, setRemainingCharsComment] = useState(250);

  const [isLoading, setIsLoading] = useState(false); 

  // const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files && event.target.files[0]) {
  //     setImage(event.target.files[0]);
  //   } else {
  //     setImage(null);
  //   }
  // };
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.dir(event.target)
    console.dir(event.target.files[0])
    console.dir(event.target.files[1])
    console.dir([...Array.from(event.target.files)])
    if (event.target.files) {
      setImages([...Array.from(event.target.files)]);
    } else {
      setImages([]);
    }
  };
  

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('comment', comment);
    formData.append('rating', rating.toString());
    formData.append('itineraryId', itineraryId);
    formData.append('currentUserEmail', currentUserEmail);
    // formData.append('image', images); // Append the image file if selected
    if (images.length) {
      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]); 
      }
    }
    setSuccessMessage('');
    setSubmitted(false);

    try {
      setIsLoading(true);
      const url = '/api/create-review';

      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Submitted review successfully!');
        setSubmitted(true);
        setComment('');
        setRating(0);
        setImages([]);
        setErrorMessage('');
        console.log("Submitted review successfully");
      } else {
        throw new Error(data.message || 'Something went wrong');
      }
    } catch (error: any) {
      setErrorMessage(error.message);
    }
    finally{
      setIsLoading(false);
    }
  };

  const handleBackButtonClick = () => {
    window.location.href = '/';
  };

  if (submitted === false) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: theme.colors["pastel-purple"][7] }}>
        <div style={{ alignSelf: 'flex-start', margin: '10px' }}>
          <Button onClick={handleBackButtonClick} leftSection={<IconArrowLeft size={14} />} variant="default" style={{ backgroundColor: theme.colors['forest-green'][2], color: 'white' }}>
            Back
          </Button>
        </div>
        <div style={{ flex: 1 }}></div>
        <form onSubmit={handleSubmit} encType="multipart/form-data" style={{ flex: 3 }}>
          <div>
            <Title
              order={2}
              size="h1"
              style={{ fontFamily: 'Greycliff CF, var(--mantine-font-family)', color: 'black' }}
              fw={900}
              ta="center"
            >
              Review the itinerary!
            </Title>
            <Textarea
              mt="md"
              label="Comment"
              placeholder={"Comment"}
              maxRows={10}
              minRows={5}
              autosize
              name="message"
              variant="filled"
              style={{ color: 'black' }}
              value={comment.substring(0, 250)}
              // onChange={(e) => setComment(e.target.value)}
              onChange={(e) => {
                if (e.target.value.length <= 250) {
                  setComment(e.target.value.substring(0, 250));
                  setRemainingCharsComment(250 - e.target.value.length);
                  // console.log(remainingCharsComment);
                } 
                else{
                  console.log('limit reached')
                }
              }}
            />
            <Text size="sm" >
                {remainingCharsComment} characters remaining
            </Text>
            Rating:
            <Rating value={rating} onChange={setRating} color='forest-green' />

            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
              <input
                type="file"
                id="image"
                onChange={handleImageChange}
                accept="image/*"
                multiple
                style={{ color: 'black' }}
              />

            </div>
            {errorMessage && <p className="error">{errorMessage}</p>}
            <Group justify="center" mt="xl">
              {isLoading ? (<Button type="submit" size="md" disabled style={{ backgroundColor: theme.colors["forest-green"][2] }}>
                Loading...
              </Button>) : <Button type="submit" size="md" style={{ backgroundColor: theme.colors["forest-green"][2] }}>Submit Review!</Button>} 
              {/* // <Button type="submit" size="md" style={{ backgroundColor: theme.colors["forest-green"][2] }}>
              //   Submit Review!
              // </Button> */}
            </Group>
          </div>
        </form>
        <div style={{ backgroundColor: 'blue' }}>{successMessage}</div>
        <div style={{ flex: 1 }}></div>
      </div>
    );
  } else {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: theme.colors["forest-green"][8] }}>
        <div style={{ flex: 1 }}></div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <h1 style={{ fontSize: '40px', color: 'white' }}>{successMessage}</h1>
          <Button onClick={handleBackButtonClick} color='pastel-purple'>Close Window</Button>
        </div>
        <div style={{ flex: 1 }}></div>
      </div>
    );
  }
}

export default ReviewForm;
