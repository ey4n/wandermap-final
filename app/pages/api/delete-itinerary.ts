
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'DELETE') {
      const { itineraryId } = req.body;
  
      try {
        await prisma.itineraryAttractions.deleteMany({
          where: { itineraryId: itineraryId },
        });

        await prisma.userItinerary.deleteMany({
            where: { itineraryId: itineraryId },
          });
  
        await prisma.review.deleteMany({
          where: { itineraryId: itineraryId },
        });
  
        const deletedItinerary = await prisma.itinerary.delete({
          where: { id: itineraryId },
        });
  
        res.status(200).json({ message: 'Itinerary deleted successfully', deletedItinerary });
      } catch (error) {
        console.error('Error deleting itinerary:', error);
        res.status(500).json({ error: 'An error occurred while deleting the itinerary' });
      }
    }
  }
  