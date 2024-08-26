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
  const nextUrl = data.next.url.path;
  const isHome = (nextUrl === '/' || nextUrl === '/index.html');

  nav.disabled = isHome;

  return [
    gsap.to(nav, {
      translateY: isHome ? '0px' : '100px',
      ease: `power1.${isHome ? 'in' : 'out'}`,
    })
  ];
}