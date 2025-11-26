import React from "react";

export const SidebarData = [
  {
    title: "Home",
    icon: new URL('./SidebarIcons/HomeIcon.png', import.meta.url).href,
    link: "/",

  }
    ,
    {
    title: "About",
    icon: new URL('./SidebarIcons/AboutIcon.png', import.meta.url).href,
    link: "/",

  },
  {     
    title: "Test",
    icon: new URL('./SidebarIcons/LupeIcon.png', import.meta.url).href,
    link: "/",
    },
  {
    title: "Contact",
    icon: new URL('./SidebarIcons/KontaktIcon.png', import.meta.url).href,
    link: "/",
  }
];