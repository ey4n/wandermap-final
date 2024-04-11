
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const attractions = await prisma.attraction.findMany({
        select: {
            id: true,
            name: true,
            budget: true,
            description: true,
            longitude: true,
            latitude: true,
            category: true,
            attractionImage: true,
            nearbyAttractions: true
        },
      });
      console.log('All attractions: ', attractions);
      res.status(200).json(attractions);
      console.log(attractions)
    } catch (error) {
      res.status(500).json({ error: "Unable to retrieve attractions" });
    }
  } else {
    // If the method is not GET, return a 405 Method Not Allowed error
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
