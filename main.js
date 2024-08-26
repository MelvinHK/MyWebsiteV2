import barba from '@barba/core';
import gsap from 'gsap';

barba.init({
  transitions: [{
    name: 'opacity-transition',
    leave(data) {
      return gsap.to(data.current.container, {
        opacity: 0,
        translateX: '-5rem',
        duration: 0.25,
        ease: 'power1.in'
      });
    },
    enter(data) {
      return handleNav(data);
    },
    once(data) {
      return handleNav(data);
    }
  }],
});

function handleNav(data) {
  const nav = document.getElementById('bookmark');
  const menu = document.getElementById('bookmark-menu');

  const nextUrl = data.next.url.path;
  const isHome = (nextUrl === '/' || nextUrl === '/index.html');

  nav.disabled = isHome;

  return [
    gsap.to(nav, {
      translateY: isHome ? '0px' : '100px',
      ease: `power1.${isHome ? 'in' : 'out'}`,
    }),
    gsap.to(menu, {
      opacity: 0,
      pointerEvents: "none"
    })
  ];
}

document.getElementById('bookmark').addEventListener('click', (e) => {
  const nav = e.currentTarget;
  const menu = document.getElementById('bookmark-menu');
  const isOpen = gsap.getProperty(nav, 'y') !== 100;

  gsap.to(menu, {
    opacity: isOpen ? 0 : 1,
    pointerEvents: isOpen ? "none" : "all"
  });

  gsap.to(nav, {
    translateY: isOpen ? 100 : '250%'
  });
});