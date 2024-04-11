// pages/api/upvote-itinerary.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PATCH') {
    const { itineraryId } = req.body; 
    console.log("Itinerary to upvote: ", itineraryId)

    try {
      const itinerary = await prisma.itinerary.findUnique({
        where: {
          id: itineraryId,
        },
        select: {
          upvotes: true,
        },
      });

      if (!itinerary) {
        return res.status(404).json({ message: 'Itinerary not found' });
      }

      const newUpvotes = (itinerary.upvotes || 0) + 1;

      const updatedItinerary = await prisma.itinerary.update({
        where: {
          id: itineraryId,
        },
        data: {
          upvotes: newUpvotes,
        },
      });

      return res.status(200).json(updatedItinerary);
    } catch (error) {
      console.error('Error upvoting itinerary:', error);
      return res.status(500).json({ message: 'Error upvoting itinerary' });
    }
  } else {
    res.setHeader('Allow', ['PATCH']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
