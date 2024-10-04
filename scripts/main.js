import barba from '@barba/core';
import gsap from 'gsap';

import { onImageClick, enlargeImage } from './art';

/**
 * @overview - Main script for handling barba transitions, and initializing individual page scripts.
 */

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

/**
 * Return animations here, and initialize individual pages' scripts.
 */
function init(data) {
  if (data.next.namespace === "Digital Art") {
    enableDragScroll(document.getElementById('gallery'));
    onImageClick((image) => enlargeImage(image));
  }

  return [
    hideHeader(isHomeUrl(data.next.url.path)),
    indicateSelectedMenuOption(data)
  ];
}

let lastScrollY = 0;
let headerHidden = false;

window.addEventListener('scroll', () => {
  if (isHomeUrl(window.location.pathname)) {
    return;
  }

  const isScrollingDown = window.scrollY > lastScrollY;

  if (isScrollingDown !== headerHidden) {
    hideHeader(isScrollingDown);
    headerHidden = isScrollingDown;
  }

  lastScrollY = window.scrollY;
});

// Cache header elements
const homeButton = document.getElementById('home');
const menu = document.getElementById('header-menu');
const menuOptions = Array.from(menu.children);
const headerWrapper = document.getElementById('header-wrapper');

/**
 * @param {boolean} condition - Optional boolean condition to hide header with.
 */
function hideHeader(condition = true) {
  homeButton.tabIndex = condition ? -1 : 0;
  menuOptions.forEach(option => option.tabIndex = condition ? -1 : 0);

  return [
    gsap.to(homeButton, {
      translateY: condition ? '0px' : '100px',
      ease: `power1.${condition ? 'in' : 'out'}`,
    }),
    gsap.to(menu, {
      pointerEvents: condition ? "none" : "all"
    }),
    gsap.to(headerWrapper, {
      opacity: condition ? 0 : 1
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

  const otherOptionsAnimations = menuOptions
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

  container.removeEventListener('mousedown', mouseDownHandler);
  container.addEventListener('mousedown', mouseDownHandler);
}
