import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import { Category } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const itineraries = await prisma.itinerary.findMany({
        where: {
          isPublished: true,
        },
        select: {
          title: true,
          attractions: true,
          reviews: true,
          id: true,
          desc: true,
          user: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
          category: true,
          upvotes: true,
          createdDate: true,
          budget: true,
        },
      });
      res.status(200).json(itineraries);
    } catch (error) {
      console.error("Error fetching itineraries:", error);
      res.status(500).json({ error: "Unable to retrieve itineraries" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
