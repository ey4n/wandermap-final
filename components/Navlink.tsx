import { Badge, Loader, NavLink } from "@mantine/core";
import {
  IconGauge,
  IconChevronRight,
  IconPencilPlus,
  IconBookmarks,
  IconHeart,
  IconPencil,
  IconVocabulary,
  IconEye,
} from "@tabler/icons-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Group,
  Code,
  useMantineTheme,
  MantineProvider,
  Button,
  Burger,
} from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import { signOut, getSession } from "next-auth/react";
import classes from "./Navlink.module.css";
import { useSession } from "next-auth/react";

const Navlink = () => {
  const theme = useMantineTheme();
  const { data: session, status } = useSession();

    if(status === "authenticated"){
        return (
            <>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <div style={{display: 'flex', flexDirection: 'column', height: '90vh'}}>
                    <NavLink
                        // active
                        // autoContrast
                        href="/itinerary/create-itineraries"
                        label={<span style={{ fontSize: "16px" }}>Create an itinerary</span>}
                        leftSection={<IconPencilPlus size="1.5rem" stroke={1.5} />}
                        rightSection={
                            <IconChevronRight size="0.8rem" stroke={1.5} className="mantine-rotate-rtl" />
                        }
                    />
                    <NavLink
                        href="/itinerary"
                        label={<span style={{ fontSize: "16px" }}>Browse all itineraries</span>}
                        leftSection={<IconVocabulary size="1.5rem" stroke={1.5} />}
                        rightSection={
                            <IconChevronRight size="0.8rem" stroke={1.5} className="mantine-rotate-rtl" />
                        }
                    />
                    <NavLink
                        href="/itinerary"

                        label={<span style={{ fontSize: "16px" }}>Your itineraries</span>}
                        leftSection={<IconEye size="1.5rem" stroke={1.5} />}
                        rightSection={
                            <IconChevronRight size="0.8rem" stroke={1.5} className="mantine-rotate-rtl" />
                        }
                        childrenOffset={28}
                        defaultOpened
                    >
                        {/* <NavLink label={<span style={{ fontSize: "14px" }}>Your Posts</span>} href="#required-for-focus" leftSection={<IconPencil size="1rem" stroke={1.5} />} /> */}
                        <NavLink label={<span style={{ fontSize: "14px" }}>Saved Drafts</span>} href="/user-itineraries/drafts" leftSection={<IconHeart size="1rem" stroke={1.5} />}/>
                        <NavLink label={<span style={{ fontSize: "14px" }}>Bookmarked</span>} href="/user-itineraries/bookmarked-itineraries" leftSection={<IconBookmarks size="1rem" stroke={1.5} />}/>
                        <NavLink label={<span style={{ fontSize: "14px" }}>View all your itineraries</span>} href="/user-itineraries" leftSection={<IconEye size="1rem" stroke={1.5} />}/>
                    </NavLink>

                </div>
                <div style={{marginLeft: '10px'}}>
                    <a href="#" onClick={(event) => signOut({ callbackUrl: 'http://localhost:3000' })} style={{display: 'flex' }}>
                        <IconLogout stroke={1.5} style={{color: 'black', marginRight: '10px'}} />
                        <span style={{color: 'black'}}>Logout</span>
                    </a>
                </div>
            </div>
            </>
        );
    }
    else if (status === "unauthenticated"){
        return(
            <NavLink
                href="/api/auth/signin"
                label="Sign In"
                leftSection={<IconGauge size="1rem" stroke={1.5} />}
            />

        )
    }


}

export default Navlink;
