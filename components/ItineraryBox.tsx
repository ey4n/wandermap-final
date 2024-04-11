
import Link from 'next/link';

const ItineraryBox = ({ itinerary }) => {
  console.log("itinerary in box: ", itinerary)
  return (
    <div>
      <Link href={`/itinerary/${itinerary.id}`} >
            <h2>{itinerary.title}</h2> 
            <p>{itinerary.desc}</p>
      </Link>
    </div>
  );
};

export default ItineraryBox;