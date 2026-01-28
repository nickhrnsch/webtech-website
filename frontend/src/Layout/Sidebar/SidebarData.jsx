import React from "react";

export const SidebarData = [
  {
    title: "Dashboard",
    icon: new URL('./SidebarIcons/HomeIcon.svg', import.meta.url).href,
    type: "image",
    path: "/"
  },
  {
    title: "Kalender",
    icon: new URL('./SidebarIcons/CalendarIconBlack.svg', import.meta.url).href,
    type: "image",
    path: "/calendar"
  },
  {
    title: "About",
    icon: new URL('./SidebarIcons/AboutIcon.svg', import.meta.url).href,
    type: "image",
    path: "/about"
  },
  {
    title: "Contact",
    icon: new URL('./SidebarIcons/KontaktIcon.svg', import.meta.url).href,
    type: "image",
    path: "/contact"
  }
];