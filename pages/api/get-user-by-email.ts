import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get the session from the request
  const { userEmail } = req.query;
  let email: string;
  if (Array.isArray(userEmail)) {
    email = userEmail[0];
  } else {
    email = userEmail;
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email
      },
      select: {
        name: true,
        email: true,
        image: true,
        id: true,
      },
    });

    if (user) {
      console.log("User fetched with email: ", user);
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (e) {
    console.error('Error fetching user with email:', e);
    res.status(500).json({ message: 'Error fetching user with email', error: e });
  }
}
