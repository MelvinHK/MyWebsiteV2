import barba from '@barba/core';
import gsap from 'gsap';

barba.init({
  transitions: [{
    name: 'opacity-transition',
    leave(data) {
      return gsap.to(data.current.container, {
        opacity: 0,
        translateX: "-5rem",
        duration: 0.25,
        ease: "power1.in"
      });
    }
  }],
});