import { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import { getSession } from 'next-auth/react';
import prisma from '../../lib/prisma';
import { put } from '@vercel/blob';

export const config = {
  api: {
    bodyParser: false, 
  },
};

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  // Parse the form data (including files) using formidable
  const form = new IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: 'Error parsing the form data.' });
      return;
    }

    // Extract fields
    const { rating, comment, itineraryId, currentUserEmail} = fields;
    console.log("current user reviewing: ", currentUserEmail);

    // let imageUrl = ""; 
    let imageUrls: string[] = []; 
    const images = files.images;
    console.log(images);
    for (let image of images) {
      const filepath = image.filepath;
      const fileContent = fs.readFileSync(filepath);
      const filename = `reviews/${Date.now()}-${Math.random()}.jpg`;

      // Upload the file content to Vercel Blob
      const blob = await put(filename, fileContent, {
        access: 'public',
      });
      
      imageUrls.push(blob.url)
    }
    // if (images && images.length > 0) {
    //   const file = imageArray[0];
    //   const filepath = file.filepath;

    //   console.log("Filepath:", filepath);

    //   const fileContent = fs.readFileSync(filepath);
    //   const filename = `reviews/${Date.now()}-${Math.random()}.jpg`;

    //   // Upload the file content to Vercel Blob
    //   const blob = await put(filename, fileContent, {
    //     access: 'public',
    //   });
    //   imageUrl = blob.url;
    //   console.log("imageURL", imageUrl);

    //   console.log("file: ", file);
    // }
    // if (imageArray && imageArray.length > 0) {
    
    //   for (const file of imageArray) { 
    //     const filepath = file.filepath;
    //     const fileContent = fs.readFileSync(filepath);
    //     const filename = `reviews/${Date.now()}-${Math.random()}.jpg`;
    
    //     const blob = await put(filename, fileContent, {
    //       access: 'public',
    //     });
    //     imageUrls.push(blob.url); // Add the generated URL to the array
    //   }
    
    //   console.log("imageUrls:", imageUrls);
    //   // Include imageUrls in your database insert/update logic
    // }

    const result = await prisma.review.create({
      data: {
        comment: String(comment),
        rating: Number(rating),
        createdByUserEmail: String(currentUserEmail),
        itineraryId: String(itineraryId),
        imageUrl: imageUrls
        // imageUrl: JSON.stringify(imageUrls) 
      },
    });

    res.status(200).json(result);
    console.log("Review posted!");
  });
}
