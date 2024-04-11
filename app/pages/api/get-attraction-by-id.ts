
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function getAttraction(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} not allowed`);
    return;
  }

  const { attractionId } = req.query;
  console.log("itinerary ID", attractionId);
  let id: string;


  if (Array.isArray(attractionId)) {
    id = attractionId[0];
  } else {
    id = attractionId;
  }

  if (!attractionId) {
    res.status(400).json({ message: 'A valid itinerary ID must be provided' });
    return;
  }

  try {
    const attraction = await prisma.attraction.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        latitude: true,
        longitude: true,
        name: true,
        description: true,
        attractionImage: true,
        budget: true, 
        nearbyAttractions: true,
        category: true
      },
    });
    console.log("attraction selected: ",attraction);
    if (!attraction) {
      res.status(404).json({ message: 'Attraction not found' });
    } else {
      res.status(200).json(attraction);
    }
  } catch (error) {
    console.error('Failed to retrieve attraction:', error);
    res.status(500).json({ message: 'Failed to retrieve attraction', error });
  }
}
