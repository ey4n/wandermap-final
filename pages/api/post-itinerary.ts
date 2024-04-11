import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  // Only allow PATCH method
  if (req.method !== 'PATCH') {
    res.setHeader('Allow', ['PATCH']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Assuming itineraryId is sent in the request's query parameters or body
    const { itineraryId } = req.body;

    if (!itineraryId) {
      return res.status(400).json({ message: 'Itinerary ID is required' });
    }

    const itinerary = await prisma.itinerary.findUnique({
      where: {
        id: itineraryId,
      },
      select: {
        isPublished: true,
      },
    });

    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }

    console.log("Itinerary selected: ", itinerary);

    const updatedItinerary = await prisma.itinerary.update({
      where: {
        id: itineraryId,
      },
      data: {
        isPublished: true,
      },
    });

    console.log("Itinerary updated: ", updatedItinerary);
    res.status(200).json(updatedItinerary);

  } catch (error) {
    console.error('Error updating itinerary:', error);
    res.status(500).json({ message: 'Error updating itinerary', error: error.message });
  }
}
