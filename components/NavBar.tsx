import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Group, Code, useMantineTheme, MantineProvider, Button } from '@mantine/core';
import {
  IconLogout,
} from '@tabler/icons-react';
import { signOut, getSession } from 'next-auth/react';
import classes from './NavBar.module.css';

const Navbar = () => {
  const theme = useMantineTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      setIsLoggedIn(!!session);
    }
    fetchSession();

  },[]);
  if(isLoggedIn){
    return (
      <MantineProvider>
      <nav className={classes.navbar} style={{ backgroundColor: theme.colors["pastel-purple"][7] }}>
        <div className={classes.navbarMain}>
          <Group className={classes.header} justify="space-between">
            {/* <MantineLogo size={28} inverted style={{ color: 'white' }} /> */}
            {/* <Code fw={700} className={classes.version}>
              v3.1.2
            </Code> */} // logo for wandermap
          </Group>
          <div className={classes.linkButtons}style={{ height: '500px'}}>
              {/* {links} */}
              <Link href="/create-itineraries">
                  <Button className={classes.control} style={{width: '100%', height: '80px', fontSize: '20px', backgroundColor: theme.colors['forest-green'][2]}}>
                      Create
                  </Button>
              </Link>
              <Link href="/itinerary" >
                  <Button className={classes.control} style={{width: '100%', height: '80px', fontSize: '20px', backgroundColor: theme.colors['forest-green'][2]}}>
                      Browse
                  </Button>
              </Link>
            <Link href={`/user-itineraries`}>
              <Button className={classes.control} style={{width: '100%', height: '80px', fontSize: '20px', backgroundColor: theme.colors['forest-green'][2]}}>
                  View/Edit own itineraries
              </Button>
            </Link>
          </div>
        </div>
  
        <div className={classes.footer}>
          <a href="#" className={classes.link} onClick={(event) => signOut()}>
            <IconLogout className={classes.linkIcon} stroke={1.5} style={{color: 'black'}} />
            <span style={{color: 'black'}}>Logout</span>
          </a>
        </div>
      </nav>
      </MantineProvider>
    );
  }
  else if(!isLoggedIn){
    return(
      <MantineProvider>
        <nav className={classes.navbar} style={{ backgroundColor: theme.colors["pastel-purple"][7] }}>
          <div className={classes.navbarMain}>
            <Group className={classes.header} justify="space-between">
              {/* <MantineLogo size={28} inverted style={{ color: 'white' }} /> */}
              {/* <Code fw={700} className={classes.version}>
                v3.1.2
              </Code> */} // logo for wandermap
            </Group>
            <div className={classes.linkButtons}style={{ height: '500px'}}>
                {/* {links} */}
                <Link href="/api/auth/signin">
                  <Button className={classes.control} style={{width: '100%', height: '80px', fontSize: '20px', backgroundColor: theme.colors['forest-green'][2]}}>
                      Sign In
                  </Button>
                </Link>

                {/* <Link href="/create-itineraries-test">
                  <Button className={classes.control} data-disabled onClick={(event) => event.preventDefault()} style={{width: '100%', height: '80px', fontSize: '20px', backgroundColor: 'grey'}}>
                      Create
                  </Button>
                </Link>
                <Link href="/browse" >
                  <Button className={classes.control} data-disabled onClick={(event) => event.preventDefault()} autoContrast style={{width: '100%', height: '80px', fontSize: '20px', backgroundColor: 'grey'}}>
                      Browse
                  </Button>
                </Link>
                <Link href={`/browseUserItineraries`}>
                  <Button className={classes.control} data-disabled onClick={(event) => event.preventDefault()} style={{width: '100%', height: '80px', fontSize: '20px', backgroundColor: 'grey'}}>
                      View/Edit own itineraries
                  </Button>
                </Link> */}
            </div>
          </div>
        </nav>

    </MantineProvider>
    )
  }

}

export default Navbar;