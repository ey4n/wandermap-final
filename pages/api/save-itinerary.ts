import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import { getSession } from "next-auth/react";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method !== 'POST') {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  // const session = await getSession({ req });
  
  // if (!session || !session.user) {
  //   return res.status(401).json({ message: 'You must be signed in to save itineraries.' });
  // }

  // Get the itineraryId from the request body
  const { itineraryId, currentUserEmail } = req.body;

  if (!itineraryId) {
    return res.status(400).json({ message: 'No itinerary ID provided.' });
  }

  try {

    const savedItinerary = await prisma.userItinerary.create({
      data: {
        userEmail: currentUserEmail,
        itineraryId: itineraryId,
      },
    });

    res.status(200).json(savedItinerary);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Itinerary already saved.' });
    } else {
      res.status(500).json({ error: 'Something went wrong while saving the itinerary.' });
    }
  }
}
