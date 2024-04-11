import { Carousel } from '@mantine/carousel';
import '@mantine/carousel/styles.css';

import { Image } from '@mantine/core';

const images = ['https://t4.ftcdn.net/jpg/01/11/10/55/360_F_111105568_C0CRN1nRp2RwPD6hzEsv1kclLf9uOl5Q.jpg'];

export function CarouselImage({ imageUrls }) {
    if (!Array.isArray(imageUrls)) {
      console.error('CarouselImage: "imageUrls" prop must be an array of image URLs.');
      return null; // Or handle the error differently, e.g., return default content
    }
  
    const slides = imageUrls.map((url) => (
      <Carousel.Slide key={url}>
        <Image src={url} />
      </Carousel.Slide>
    ));
  
    return <Carousel withIndicators>{slides}</Carousel>;
  }