import barba from '@barba/core';
import gsap from 'gsap';

import { setImageEventListeners } from './art';

barba.init({
  preventRunning: true,
  transitions: [{
    leave(data) {
      return gsap.to(data.current.container, {
        opacity: 0,
        duration: 0.2,
        ease: 'power1.in'
      });
    },
    enter(data) {
      return init(data);
    },
    once(data) {
      return init(data);
    }
  }],
});

/**
 * @param {string} url 
 */
function isHomeUrl(url) {
  return ['/', '/index.html'].includes(url);
}

function init(data) {
  if (data.next.namespace === "Digital Art") {
    enableDragScroll(document.getElementById('gallery'));
    setImageEventListeners();
  }

  return [
    hideHeaderIf(isHomeUrl(data.next.url.path)),
    indicateSelectedMenuOption(data)
  ];
}

window.onscroll = function () {
  if (isHomeUrl(window.location.pathname)) {
    return;
  }
  hideHeaderIf(this.oldScroll < this.scrollY && this.scrollY !== 0);
  this.oldScroll = this.scrollY;
};

/**
 * @param {boolean} hideCondition 
 */
function hideHeaderIf(hideCondition) {
  const homeButton = document.getElementById('home');
  const menu = document.getElementById('header-menu');
  const headerWrapper = document.getElementById('header-wrapper');

  homeButton.tabIndex = hideCondition ? -1 : 0;
  Array.from(menu.children)
    .forEach(option => option.tabIndex = hideCondition ? -1 : 0);

  return [
    gsap.to(homeButton, {
      translateY: hideCondition ? '0px' : '100px',
      ease: `power1.${hideCondition ? 'in' : 'out'}`,
    }),
    gsap.to(menu, {
      pointerEvents: hideCondition ? "none" : "all"
    }),
    gsap.to(headerWrapper, {
      opacity: hideCondition ? 0 : 1
    })
  ];
}

function indicateSelectedMenuOption(data) {
  const currentPageTitle = data.next.namespace;

  const matchingOptionAnimation = (currentPageTitle === 'Home')
    ? null
    : gsap.set(document.getElementById(currentPageTitle), {
      '--header-menu-a-width': '1rem'
    });

  const otherOptionsAnimations = Array
    .from(document.getElementById('header-menu').children)
    .filter(element => element.attributes.title.value !== currentPageTitle)
    .map(element => gsap.set(element, {
      '--header-menu-a-width': '0rem'
    }));

  return [
    matchingOptionAnimation,
    otherOptionsAnimations
  ];
}

/**
 * @param {HTMLElement} container 
 */
function enableDragScroll(container) {
  let pos = { top: 0, left: 0, x: 0, y: 0 };

  const mouseMoveHandler = function (e) {
    const dx = e.clientX - pos.x;
    const dy = e.clientY - pos.y;
    container.scrollTop = pos.top - dy;
    container.scrollLeft = pos.left - dx;
  };

  const mouseUpHandler = function () {
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
  };

  const mouseDownHandler = function (e) {
    pos = {
      left: container.scrollLeft,
      top: container.scrollTop,
      x: e.clientX,
      y: e.clientY,
    };
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  // Because this function can be called multiple times, remove any previously added listeners.
  container.removeEventListener('mousedown', mouseDownHandler);
  container.addEventListener('mousedown', mouseDownHandler);
}
