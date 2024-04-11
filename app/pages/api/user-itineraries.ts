// pages/api/user-itineraries.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import { getSession } from "next-auth/react";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get the session from the request
  const session = await getSession({ req });

  if (session) {
    try {
      const itineraries = await prisma.itinerary.findMany({
        where: {
            user: {
              email: session.user.email, 
            },
        },
        select: {
            title: true, 
            attractions: true,
            reviews: true,
            id: true,
            upvotes: true,
            desc: true,
            user: {
              select: {
                name: true,
                email: true, 
                image: true,
              }
            },
            isPublished: true,
            category: true,
            budget: true,
            createdDate: true
          },
      });
      console.log('Fetched user itineraries:', itineraries);
      res.status(200).json(itineraries);
    } catch (e) {
      console.error('Error fetching itineraries for user:', e);
      res.status(500).json({ message: 'Error fetching itineraries for user', error: e });
    }
  } else {
    res.status(401).json({ message: "No active session found" });
  }
}
