import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import Navbar from './NavBar';
import Navlink from './Navlink';
import { useMantineTheme, Burger } from '@mantine/core';
import { LoginPage } from './LoginPage';
import { useDisclosure } from '@mantine/hooks';
import { Loader } from '@mantine/core';


const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const { data: session, status } = useSession();
  const theme = useMantineTheme();
  const [opened, { toggle }] = useDisclosure();

  if (status === "loading"){
    return <Loader />
  }
  else if (status === "unauthenticated") {
    return <LoginPage></LoginPage>;
  }

  else if (status === "authenticated"){
    return(
      <div className='left' style={{display:'flex'}}>
        {/* <Navbar></Navbar> */}
        <div style={{height: '100vh', backgroundColor: theme.colors['pastel-purple'][1]}}>
        <Burger opened={opened} onClick={toggle} aria-label="Toggle navigation" />
          {opened && (<div style={{height: '100vh', backgroundColor: theme.colors['pastel-purple'][1], flex: 1}}>
            <Navlink></Navlink>
          </div>)}
        </div>
        <div style={{display:'flex',  
                flex: 3,
                fontSize: '25px', 
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                color: theme.colors["forest-green"][2],
                width: '100%',
                backgroundColor: 'white'
                }}>Welcome, {session.user.name}!</div>
      </div>
    )
  };
};

export default Header;

// if (session) {
//   left = (
//     <div className='left'>
//       <Navbar></Navbar>
//       <div style={{display:'flex',  
//               // flex: 3,
//               fontSize: '25px', 
//               justifyContent: 'center',
//               alignItems: 'center',
//               textAlign: 'center',
//               color: 'white',
//               width: '100%',
//               backgroundColor: theme.colors["forest-green"][2]
//               }}>Welcome! Yvette!</div>
//     </div>
      {/* <Link href="/browse" className="bold" data-active={isActive('/')}>
          Browse others itineraries
      </Link>
      <Link href="/itinerary/user-itineraries" data-active={isActive('/itineraries/user-itineraries')}>
        My itineraries
      </Link>
      <style jsx>{`
        .bold {
          font-weight: bold;
        }

        a {
          text-decoration: none;
          color: var(--geist-foreground);
          display: inline-block;
        }

        .left a[data-active='true'] {
          color: gray;
        }

        a + a {
          margin-left: 1rem;
        }
      `}</style>
    
  );

  right = (
    <div className="right">
      <p>
        {session.user.name} ({session.user.email})
      </p>
      <Link href="/create">
        <button>
          <a>New post</a>
        </button>
      </Link>
      <button onClick={() => signOut()}>
        <a>Log out</a>
      </button>
      <style jsx>{`
        a {
          text-decoration: none;
          color: var(--geist-foreground);
          display: inline-block;
        }

        p {
          display: inline-block;
          font-size: 13px;
          padding-right: 1rem;
        }

        a + a {
          margin-left: 1rem;
        }

        .right {
          margin-left: auto;
        }

        .right a {
          border: 1px solid var(--geist-foreground);
          padding: 0.5rem 1rem;
          border-radius: 3px;
        }


        button {
          border: none;
        }
      `}</style> */}
      
//   );
// }