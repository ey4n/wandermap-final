
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import { getSession } from "next-auth/react";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (session) {
    try {
      const itineraries = await prisma.userItinerary.findMany({
        where: {
            userEmail: session.user.email
        },
        select: {
            itinerary: {
                select: {
                    id: true,
                    title: true,
                    desc: true,
                    reviews: true,
                    upvotes: true,
                    createdDate: true,
                    category: true,
                    budget: true,
                    savedByUsers: true,
                    user:{
                        select:{
                            name: true,
                            email: true,
                            image: true,
                        }
                    }
                }
            }
          },
      });
      console.log('Fetched saved itineraries:', itineraries);
      res.status(200).json(itineraries);
    } catch (e) {
      console.error('Error fetching itineraries for user:', e);
      res.status(500).json({ message: 'Error fetching itineraries for user', error: e });
    }
  } else {
    res.status(401).json({ message: "No active session found" });
  }
}
