
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function getItinerary(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} not allowed`);
    return;
  }

  const { itineraryId } = req.query;
  console.log("itinerary ID", itineraryId);
  let id: string;


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
        id: true,
        attractions: true,
        title: true, 
        reviews: true,
        desc: true,
        user: {
            select: {
            name: true,
            email: true, 
            image: true,
          }            
        },
        isPublished: true,
        budget: true
      },
    });
    console.log("itinerary selected: ", itinerary);
    if (!itinerary) {
      res.status(404).json({ message: 'Itinerary not found' });
    } else {
      res.status(200).json(itinerary);
    }
  } catch (error) {
    console.error('Failed to retrieve itinerary:', error);
    res.status(500).json({ message: 'Failed to retrieve itinerary', error });
  }
}
