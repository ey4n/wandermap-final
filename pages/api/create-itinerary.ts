import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} not allowed`);
    return;
  }

  const { userEmail, attractions, title, desc, budget, category, isPublished } = req.body;

  try {
    const newItinerary = await prisma.$transaction(async (prisma) => {
      const itinerary = await prisma.itinerary.create({
        data: {
          userEmail: userEmail,
          title: title,
          desc: desc,
          budget: budget,
          category: category,
          isPublished: isPublished,
        },
      });

      const itineraryAttractions = await prisma.itineraryAttractions.createMany({
        data: attractions.map((attraction, index) => ({
          itineraryId: itinerary.id,
          attractionId: attraction.id,
          orderIndex: attraction.order, 
        })),
      });

      return itinerary;
    });

    // Return the itinerary object including itineraryId in the response
    res.status(200).json({ itineraryId: newItinerary.id, ...newItinerary });
    console.log("Itinerary created!")
  } catch (error) {
    console.error('Failed to create itinerary:', error);
    res.status(500).json({ error: 'Failed to create itinerary' });
  }
}
