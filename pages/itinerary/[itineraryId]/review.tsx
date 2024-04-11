import { useRouter } from 'next/router';
import { getSession } from "next-auth/react"; 
import { GetServerSideProps } from 'next';
import ReviewForm from '../../../components/ReviewForm'; // Adjust the import path based on your actual file structure

const ReviewPage = ({currentUser}) => {
  const router = useRouter();
  const itineraryID = router.query.itineraryId as string;
  console.log("Itinerary to review: ", router.query);
  console.log("itineraryID: ", itineraryID);
  console.log("Reviewer: ", currentUser.email);


  return (
    <div>
      {/* <h1>Submit Your Review</h1> */}
        <ReviewForm itineraryId={itineraryID} currentUserEmail={currentUser.email} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  console.log("session: ", session)

  if (!session || !session.user) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    };
  }

  return {
    props: {
      currentUser: session.user, 
    },
  };
};

export default ReviewPage;
