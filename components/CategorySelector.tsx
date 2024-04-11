import React from 'react';
import styles from './CategorySelector.module.css';
import { Button } from '@mantine/core';

interface CategorySelectorProps {
  data: string[];
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ data }) => {
  return (
    <div className={styles.categoryBox}>
      {data.map((category, index) => (
        <Button key={index} className={`${styles.chooseMapButton} ${styles.standardSize}`}>{category}</Button>
      ))}
    </div>
  );
};

export default CategorySelector;
