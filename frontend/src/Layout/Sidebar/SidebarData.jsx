import React from "react";

export const SidebarData = [
  {
    title: "Dashboard",
    icon: new URL('./SidebarIcons/HomeIcon.png', import.meta.url).href,
    type: "image",
    path: "/"
  },
  {
    title: "Kalender",
    icon: new URL('./SidebarIcons/CalendarIcon.png', import.meta.url).href,
    type: "image",
    path: "/calendar"
  },
  {
    title: "About",
    icon: new URL('./SidebarIcons/AboutIcon.png', import.meta.url).href,
    type: "image",
    path: "/about"
  },
  {
    title: "Contact",
    icon: new URL('./SidebarIcons/KontaktIcon.png', import.meta.url).href,
    type: "image",
    path: "/contact"
  }
];