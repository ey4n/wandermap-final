
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} not allowed`);
    return;
  }

  const { itineraryId } = req.query;
  // console.log("itinerary ID", itineraryId);
  let id: string;

// Check if itineraryId is an array and take the first element if so.
// Otherwise, use itineraryId as it is.
  if (Array.isArray(itineraryId)) {
    id = itineraryId[0];
  } else {
    id = itineraryId;
  }

  if (!itineraryId) {
    res.status(400).json({ message: 'A valid itinerary ID must be provided' });
    return;
  }

  try {
    const itinerary = await prisma.itinerary.findUnique({
      where: {
        id: id,
      },
      select: {
        user: {
            select: {
            email: true, 
          }            
        },
      },
    });
    // console.log("itinerary selected for review: ", itinerary);

    if (!itinerary || !itinerary.user) {
        throw new Error('Itinerary or associated user not found');
    }

    const creatorEmail = itinerary.user.email;
    const review = await prisma.review.findFirst({
        where: {
          createdByUserEmail: creatorEmail,
          itineraryId: id,
        },
      });
    

    if (!review) {
      res.status(404).json({ message: 'Creator review not found' });
    } else {
      res.status(200).json(review);
    }
  } catch (error) {
    console.error('Failed to retrieve creator review:', error);
    res.status(500).json({ message: 'Failed to retrieve creator review', error });
  }
}
