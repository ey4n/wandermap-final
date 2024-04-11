import { useRouter } from 'next/router';
import { Attraction, Review, User, ItineraryAttractions } from '@prisma/client';
import { GetServerSideProps, NextPage} from 'next';
import UpvoteButton from '../../../components/UpvoteButton';
import { getSession } from "next-auth/react"; 
import Link from 'next/link';
import SaveButtonBig from '../../../components/SaveButtonBig';
import ReviewBox from '../../../components/ReviewBox';
import { Button, MantineProvider, useMantineTheme, Text, Timeline, Rating, Divider, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import { IconArrowLeft } from '@tabler/icons-react';
import { CarouselImage } from '../../../components/CarouselImage';


interface ItineraryPageProps {
  itinerary: {
    id: string;
    title: string;
    desc: string;
    user: {
      name: string;
      email: string;
      image: string;
    };
    attractions: Array<ItineraryAttractions>;
    reviews: Array<Review>;
    isPublished: boolean;
    budget: Number
  };

  currentUser: {
    name: string;
    email: string;
    image: string;
  };
  creatorReview : {
    comment: string;
    rating: number;
    imageUrl: string;
  }
}

const ItineraryIdPage: NextPage<ItineraryPageProps> = ({ itinerary, creatorReview, currentUser}) => {

  const router = useRouter();
  const { itineraryId } = router.query;
  const theme = useMantineTheme();
  const [detailedAttractions, setDetailedAttractions] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(null);

  const fetchAttractions = async () => {
    setLoading(true); 
    try {
        const itineraryAttractions = itinerary.attractions;
        const attractionDetailsPromises = itinerary.attractions.map(async (attraction) => {
            const attractionResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/get-attraction-by-id?attractionId=${attraction.attractionId}`);
            return attractionResponse.json();
          });
        
        const attractionsData = await Promise.all(attractionDetailsPromises);
        console.log("attractionsData: ", attractionsData);
        setDetailedAttractions(attractionsData);
    } catch (error) {
      console.error("failed to fetch attractions", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  if (!itinerary) {
    return <div>Itinerary not found</div>;
  }

  let attractionNo = 0
  const reviewPath = `/itinerary/${itineraryId}/review`;
  const attractionPath = `/itinerary/${itineraryId}/${attractionNo}`

  const isCurrentUserCreator = currentUser && itinerary.user.email === currentUser.email;

  const handleDeleteItinerary = async () => {
    if (!confirm('Are you sure you want to delete this itinerary?')) return;
    const itineraryIdToDelete = itinerary.id;
    console.log(itineraryIdToDelete)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/delete-itinerary`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itineraryId: itineraryIdToDelete }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete itinerary');
      alert('Itinerary deleted successfully');
      router.push('/itinerary');

    } catch (error) {
      setError(error.message);
    }
  };

  // Event handler for the Post button
  const handlePostItinerary = async () => {
    try {
      const response = await fetch(`/api/post-itinerary`, {
        method: 'PATCH', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itineraryId: itineraryId.toString(), isPublished: true }), 
      });

      if (!response.ok) {
        throw new Error('Failed to post itinerary');
      }
      const data = await response.json();
      console.log('Itinerary posted:', data);
      router.push(`/itinerary/${itineraryId}/review`);
    } catch (error) {
      console.error('Error posting itinerary:', error);
    }
  };
  
  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      setIsLoggedIn(!!session);
    };
    
    fetchAttractions();
    fetchSession();
  }, []);

  console.log("detailed attractions: ", detailedAttractions);

  // console.log("Creator review: ", creatorReview);
  return (
    <MantineProvider>
      <div className='full box' style={{display: 'flex', padding: '10px', backgroundColor: 'white'}}>
        <div className='left' style={{display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '2', 
        // borderRight: 'solid grey', minHeight:'100vh'
        }}>
          <div style={{alignSelf: 'flex-start'}}>
            <Link href='/itinerary'>
              <Button leftSection={<IconArrowLeft size={14} />} autoContrast style={{backgroundColor: theme.colors['forest-green'][2]}}>
                Back
              </Button>
            </Link>
          </div>

          <Title order={1} td="underline" fw={700} ta="center">{itinerary.title}</Title>
          <Title order={4}>Description: {itinerary.desc}</Title>
          <Title order={4}>Budget required: {itinerary.budget}</Title>

          <div style={{display: 'flex', flexDirection: 'column'}}>
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: '10px'}}>
                {creatorReview && <CarouselImage imageUrls={creatorReview.imageUrl}></CarouselImage>}
            </div>
            <div className='timeline' style={{marginLeft: '10%'}}>
              <Timeline active={detailedAttractions.length-1} bulletSize={24} lineWidth={5}>
                {detailedAttractions && detailedAttractions.map((attraction, index) => (
                  <Timeline.Item key={index} title={attraction.name} color={theme.colors['pastel-purple'][7]} >
                    {/* <Text>{attraction.name}</Text> */}
                    <Text size='sm' td="underline">Description: </Text>
                    <Text size='sm'>{attraction.description}</Text>
                    {/* <Text size='sm'>Latitude: {attraction.latitude}</Text>
                    <Text size='sm'>Longitude: {attraction.longitude}</Text> */}
                    {index!=(detailedAttractions.length-1) && (
                      <Link href={`/itinerary/${itineraryId}/${index}`}>
                        <Text component="a" size='sm' style={{ textDecoration: 'underline', cursor: 'pointer' }}>
                          View Route to next attraction
                        </Text>
                      </Link>
                    )}
                  </Timeline.Item>
                ))}
              </Timeline>
            </div>
          </div>
          <div style={{display: 'flex', gap: '10px'}}>
          {currentUser && <SaveButtonBig currentUserEmail={currentUser.email} itineraryId={itineraryId}></SaveButtonBig>}
          {currentUser && (
              <a href={`/itinerary/${itineraryId}/review`}>
                <Button radius="md" size="md" style={{ backgroundColor: theme.colors['forest-green'][2] }}>
                  Review this itinerary!
                </Button>
              </a>
            )}
          {isCurrentUserCreator && <Button  onClick={handleDeleteItinerary} radius="md" size="md" style={{ backgroundColor: theme.colors['forest-green'][2] }}>Delete this itinerary</Button>}
          </div>
        </div>
        <Divider orientation="vertical" size='sm' my="md" color='forest-green'/>
        <div className="right" style={{flex: '1'}}>
          {itinerary.reviews && itinerary.reviews.map((review) => (
            <ReviewBox key={review.id} review={review} />
          ))}
        </div>
      </div>
    </MantineProvider>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  console.log("session: ", session)

  const { itineraryId } = context.params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/select-itinerary-by-id?itineraryId=${itineraryId}`);
  const itinerary: ItineraryPageProps = await res.json();
  const res2 = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/get-creator-review?itineraryId=${itineraryId}`);
  const creatorReview = await res2.json();

  if (!session || !session.user) {
    return {
      props: {
        itinerary,
        creatorReview,
        currentUser: null,
      }
    };
  }

  return {
    props: {
      itinerary,
      creatorReview,
      currentUser: session.user,
    },
  };
};
export default ItineraryIdPage;