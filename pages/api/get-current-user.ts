
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import { getSession } from "next-auth/react";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get the session from the request
  const session = await getSession({ req });

  if (session && session.user) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email : session.user.email
        },
        select: {
          name: true,
          email: true,
          image: true, 
          id: true,
        },
      });

      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
      console.log("Current user: ", user)
    } catch (e) {
      console.error('Error fetching current user:', e);
      res.status(500).json({ message: 'Error fetching current user', error: e });
    }
  } else {
    res.status(401).json({ message: "No active session found" });
  }
}
