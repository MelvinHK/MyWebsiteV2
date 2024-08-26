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
      return getNavTransition(data.next.url.path);
    },
    once(data) {
      return getNavTransition(data.next.url.path);
    }
  }],
});

function getNavTransition(path) {
  const nav = document.getElementsByClassName('bookmark');
  const isHome = (path === '/' || path === '/index.html');

  return gsap.to(nav, {
    translateY: isHome ? '0px' : '100px',
    ease: `power1.${isHome ? 'in' : 'out'}`,
  });
}