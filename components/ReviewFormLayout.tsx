import { TextInput, Textarea, SimpleGrid, Group, Title, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { useMantineTheme } from '@mantine/core';

export function ReviewFormLayout() {
    const theme = useMantineTheme();
  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      rating: '',
      description: '',
    },
    validate: {
      name: (value) => value.trim().length < 2,
      email: (value) => !/^\S+@\S+$/.test(value),
      rating: (value) => typeof value !== 'number',
    },
  });
const [file, setFile] = useState<string | undefined>(undefined);
function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    console.log(e.target.files);
    setFile(URL.createObjectURL(e.target.files[0]));
}

  return (
    <div style={{display: 'flex',justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: theme.colors["forest-green"][8]}}>
        <div style={{flex: 1}}></div>
        <form onSubmit={form.onSubmit(() => {})} style={{flex: 3,}}>
        <Title
            order={2}
            size="h1"
            style={{ fontFamily: 'Greycliff CF, var(--mantine-font-family)', color: 'white' }}
            fw={900}
            ta="center"
        >
            Set a review!
        </Title>

        <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xl">
            <TextInput
            label="Name"
            placeholder="Your name"
            name="name"
            variant="filled"
            {...form.getInputProps('name')}
            style={{ color: 'white' }}
            />
            <TextInput
            label="Email"
            placeholder="Your email"
            name="email"
            variant="filled"
            style={{ color: 'white' }}
            {...form.getInputProps('email')}
            />
        </SimpleGrid>

        <TextInput
            label="Rating"
            placeholder="Rating"
            mt="md"
            name="subject"
            variant="filled"
            style={{ color: 'white' }}
            {...form.getInputProps('rating')}
        />
        <Textarea
            mt="md"
            label="Description"
            placeholder="Description"
            maxRows={10}
            minRows={5}
            autosize
            name="message"
            variant="filled"
            style={{ color: 'white' }}
            {...form.getInputProps('message')}
        />

        <h2 style={{ color: 'white' }}>Add Image:</h2>
        <input type="file" onChange={handleChange} style={{ color: 'white' }}/>
        <img src={file} />

        <Group justify="center" mt="xl">
            <Button type="submit" size="md" style={{ backgroundColor: theme.colors["pastel-purple"][6] }}>
            Send message
            </Button>
        </Group>
        </form>
    <div style={{flex: 1}}></div>
    </div>
  );
}