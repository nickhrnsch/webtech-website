import React from "react";

export const SidebarData = [
  {
    title: "Home",
    icon: new URL('./SidebarIcons/HomeIcon.png', import.meta.url).href,
    type: "image",
    path: "/"
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