import cx from 'clsx';
import { Title, Text, Container, Button, Overlay } from '@mantine/core';
import classes from './LoginPage.module.css';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export function LoginPage() {
  return (
    <div className={classes.wrapper}>
      <Overlay color="#000" opacity={0.65} zIndex={1} />

      <div className={classes.inner}>
        <Title className={classes.title}>
          WanderMap
          {/* <Text component="span" inherit className={classes.highlight}>
            any stack
          </Text> */}
        </Title>
        <Container size={640}>
          <Text size="lg" className={classes.description}>
            Plan your trip. Share your experience. WanderMap is a platform for travelers to share their itineraries and experiences.
          </Text>
        </Container>

        <div className={classes.controls}>
            <Link href="/api/auth/signin">
                <Button className={classes.control} variant="white" size="lg">
                    Login
                </Button>
            </Link>
            {/* <Link href="/api/auth/signin" >
                <Button className={classes.control} variant="white" size="lg">
                    Sign Up
                </Button>
            </Link> */}
          <Link href={`/itinerary`}>
            <Button className={classes.control} size="lg" color='pastel-purple'>
                Browse All Itineraries
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}