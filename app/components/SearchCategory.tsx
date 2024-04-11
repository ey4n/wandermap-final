

import { MultiSelect } from '@mantine/core';

function SelectCategory({ onSelectedChange }) {
  return (
    <MultiSelect
      label="Choose your category"
      placeholder="Select your category!"
      data={['Nightlife', 'Nature', 'Scenic', 'Sports', 'Food', 'Cultural']}
      onChange={(selected) => onSelectedChange(selected || [])} 
      hidePickedOptions
      comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 } }}
    />
  );
}

export default SelectCategory;