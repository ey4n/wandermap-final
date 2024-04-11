import React from "react";
import styles from "./AttractionBox.module.css";
import { Button, Select, Image, Badge, Textarea, Group } from "@mantine/core";

interface AttractionBoxProps {
  attraction: {
    name: string;
    description: string;
    budget: number;
    category: string;
    attractionImage: string;
    nearbyAttractions: string[];
  };
}

const AttractionBox: React.FC<AttractionBoxProps> = ({ attraction }) => {
  return (
    <div className={styles.attractionBox}>
      <Group className={styles.detailsRow}>
        <Badge color="blue" variant="light">
          Budget: ${attraction.budget}
        </Badge>
        <Badge color="green" variant="light">
          Category: {attraction.category}
        </Badge>
      </Group>
      {attraction.attractionImage && (
        <Image
          src={attraction.attractionImage}
          alt={attraction.name}
          className={styles.attractionImage}
        />
      )}
      <div className={styles.nearbyAttractions}>
        <Select
          placeholder="Nearby Attractions"
          data={attraction.nearbyAttractions}
          searchable
          clearable
        />
      </div>
    </div>
  );
};

export default AttractionBox;
