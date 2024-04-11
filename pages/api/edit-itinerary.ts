import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import { Category } from '@prisma/client'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') {
    res.setHeader('Allow', ['PATCH']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const { itineraryId } = req.query;
  const { title, desc, attractions, isPublished } = req.body;

  let id: string;
  if (Array.isArray(itineraryId)) {
    id = itineraryId[0];
  } else {
    id = itineraryId as string; 
  }

  try {
    let newBudget = 0;
    const categoriesSet = new Set<Category>();

    attractions.forEach(attraction => {
      newBudget += attraction.budget;
      categoriesSet.add(attraction.category as Category);
    });

    const newCategories = Array.from(categoriesSet); // Convert the Set to an array

    const updatedItinerary = await prisma.$transaction(async (prisma) => {
      // Update the itinerary with new values
      const itineraryUpdate = await prisma.itinerary.update({
        where: { id: id },
        data: {
          title,
          desc,
          budget: newBudget,
          category: newCategories, 
          isPublished,
        },
      });

      await prisma.itineraryAttractions.deleteMany({
        where: {
          itineraryId: id,
        },
      });

      const updatedAttractions = await prisma.itineraryAttractions.createMany({
        data: attractions.map(attraction => ({
          itineraryId: id,
          attractionId: attraction.id,
          orderIndex: attraction.order,
        })),
        skipDuplicates: true, 
      });

      return { 
        title: title,
        desc: desc,
        updatedAttractions: updatedAttractions.count 
      };
    });

    res.status(200).json(updatedItinerary);
  } catch (error) {
    console.error('Failed to update itinerary:', error);
    res.status(500).json({ error: 'Failed to update itinerary' });
  }
}
