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
      return animations(data);
    },
    once(data) {
      return animations(data);
    }
  }],
});

function animations(data) {
  const nextUrl = data.next.url.path;
  const isHome = (nextUrl === '/' || nextUrl === '/index.html');

  return [
    hideHeader(isHome),
    indicateCurrentPage(data)
  ];
}

function hideHeader(hideCondition) {
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
      opacity: hideCondition ? 0 : 1,
      pointerEvents: hideCondition ? "none" : "all"
    }),
    gsap.to(headerWrapper, {
      opacity: hideCondition ? 0 : 1
    })
  ];
}

function indicateCurrentPage(data) {
  const currentPageTitle = data.next.namespace;
  const otherPageTitles = Array.from(document.getElementById('header-menu').children)
    .map(item => item.attributes.title.value)
    .filter(title => title !== currentPageTitle);

  const matchingMenuOption = document.getElementById(currentPageTitle);
  const otherMenuOptions = otherPageTitles.map(title => document.getElementById(title));

  const matchingMenuOptionAnimation = (currentPageTitle === 'Home')
    ? null
    : gsap.set(matchingMenuOption, {
      '--header-menu-a-width': '1rem'
    });

  const otherMenuOptionsAnimations = otherMenuOptions.map(option =>
    gsap.set(option, {
      '--header-menu-a-width': '0rem'
    })
  );

  return [
    matchingMenuOptionAnimation,
    otherMenuOptionsAnimations
  ];
}