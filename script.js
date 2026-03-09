'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
///////////////////////////
// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//////////////////////////////
// Button Scroll
btnScrollTo.addEventListener('click', function (e) {
  const s1Cords = section1.getBoundingClientRect();
  console.log(s1Cords);
  console.log(e.target.getBoundingClientRect());

  console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);
  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // Scrolling
  // window.scrollTo(
  //   s1Cords.left + window.pageXOffset,
  //   s1Cords.top + window.pageYOffset
  // );

  // 1st method - old way
  // window.scrollTo({
  //   left: s1Cords.left + window.pageXOffset,
  //   top: s1Cords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // 2nd way - modern way
  section1.scrollIntoView({ behavior: 'smooth' });
});

/////////////////////////////////////////////
// Page navigation
// 1st method - Problem with this  approach is here we are adding same eventlistner to all 3 links.
// Let's suppose if we have 100 links then we will ed up adding 100 event listener which is not at all efficient
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// 2nd Method - event deligation
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // console.log(e.target);
  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed component
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  // console.log(clicked);
  // Guard clause
  if (!clicked) return;

  // Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(t => t.classList.remove('operations__content--active'));

  // Activate content area
  clicked.classList.add('operations__tab--active');
  // console.log(clicked.dataset.tab);
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
// nav.addEventListener('mouseover', function (e) {
//   handleHover(e, 0.5);
// });
// nav.addEventListener('mouseout', function (e) {
//   handleHover(e, 1);
// });

// Passing "argument"into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// Sticky navigation
// const initialCords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function () {
//   console.log(window.scrollY);
//   if (window.scrollY > initialCords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// Sticky navigation : Intersection oserver API
// . whenever the first section, so our target here, is intersecting the viewport at 10%, so the viewport, because that's
//   the root, and 10% because that's the threshold.
// . So whenever that happens, then this function here will get called and that's no matter if we are scrolling up or down,

// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };
// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };
// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries; // destructuring
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// Reveal section
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target); // to prevent observing already observed target again (check log)
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(section => {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries) {
  const [entry] = entries;
  console.log(entry);
  if (!entry.isIntersecting) return;
  // replace src with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  entry.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
imgTargets.forEach(img => imgObserver.observe(img));

// slider
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');
// const slider = document.querySelector('.slider');
// slider.style.transform = 'scale(0.4) translateX(-800px)';
// slider.style.overflow = 'visible';
// slides.forEach((s, i) => (s.style.transform = `translateX(${i * 100}%)`));

const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};
const activateDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};
const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};

const init = function () {
  goToSlide(0);
  createDots();
  activateDot(0);
};
init();
let currSlide = 0;
const maxSlide = slides.length - 1;
// next slide
const nextSlide = function () {
  if (currSlide === maxSlide) {
    currSlide = 0;
  } else {
    currSlide++;
  }
  goToSlide(currSlide);
  activateDot(currSlide);
};
const prevSlide = function () {
  if (currSlide === 0) {
    currSlide = maxSlide;
  } else {
    currSlide--;
  }
  goToSlide(currSlide);
  activateDot(currSlide);
};

// Event handlers
btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') prevSlide();
  e.key === 'ArrowRight' && nextSlide();
});

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset; // object destructuring
    goToSlide(slide);
    activateDot(slide);
  }
});

/////////////////////////////////////////////
////////////////////////////////////////////
// LEACTURES

//***************************************** Selecting, Creating, and Deleting Elements ********************************
/* 
// ************* Selecting elements
console.log(document.documentElement); // selects entire page - html
console.log(document.head);
console.log(document.body);
const header1 = document.querySelector('.header');
console.log(header1);
const allSections1 = document.querySelectorAll('.section'); // returns NodeList
console.log(allSections1);

document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button'); // returns HTMLCollection
console.log(allButtons);
console.log(document.getElementsByClassName('btn')); // returns HTMLCollection

// **************** Creating and inserting elements
// .insertAdjacentHTML

const message = document.createElement('div'); // By just creating, this will not be added to DOM
message.classList.add('cookie-message');
message.innerHTML =
  'We use cookies for improved functionality and analytics. <button class="btn btn--close--cookie">Got it!</button>';

header1.prepend(message);
header1.append(message);
header1.append(message.cloneNode(true));

header1.before(message);
header1.after(message);

// *********** Delete Elements
document
  .querySelector('.btn--close--cookie')
  .addEventListener('click', function () {
    message.remove();
    // message.parentElement.removeChild(message);
  });
*/

// *********************************************** Styles, Attributes and Classes ************************************
/* 
// ************* Styles
const message = document.createElement('div'); // By just creating, this will not be added to DOM

message.style.backgroundColor = '#37383d'; // message.style is applied as inline CSS
message.style.width = '120%';

console.log(message.style.height); // will not get height defined in .css, we can only get if defined inline
console.log(message.style.width);

console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// property
document.documentElement.style.setProperty('--color-primary', 'orangered');

// Attrbutes
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.className);

logo.alt = 'Beautful minimalist logo';

// Non-standard
console.log(logo.designer); // undefined because designer is non-standard
console.log(logo.getAttribute('designer'));
logo.setAttribute('company', 'Bankist');

console.log(logo.getAttribute('src')); // relative
console.log(logo.src); //absolute

const link = document.querySelector('.nav__link--btn');
console.log(link.href);
console.log(link.getAttribute('href'));

// Data Attribute
console.log(logo.dataset.versionNumber);

// Classes
logo.classList.add('c');
logo.classList.add('c', 'j');
logo.classList.remove('c', 'j');
logo.classList.toggle('c');
logo.classList.contains('c'); // not includes

// Don't use - because it will override all existing claases and add only one
logo.className = 'jonas';
*/

// ****************************************** Types of Events and Eent Handlers **************************************
/* 
const h1 = document.querySelector('h1');
const alerth1 = function (e) {
  alert('addEventListener: Great! You are reading the heading :D');
};

h1.addEventListener('mouseenter', alerth1);

h1.onmouseenter = alerth1;

setTimeout(() => h1.removeEventListener('mouseenter', alerth1), 3000);
*/

//  **************************************** Event Propagation in Practice *******************************************
/*
// rgb(255, 255, 255);
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randomColor = () =>
  `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('LINK', e.target, e.currentTarget);
//   console.log(this === e.currentTarget);

//   // stop propagation
//   // e.stopPropagation();
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('CONTAINER', e.target, e.currentTarget);
//   console.log(this === e.currentTarget);
// });

// // . We can change event handling from bubbling phase to capturing phase by passing third parameter as true/false.
document.querySelector('.nav').addEventListener(
  'click',
  function (e) {
    this.style.backgroundColor = randomColor();
    console.log('NAV', e.target, e.currentTarget);
    console.log(this === e.currentTarget);
  },
  true
);
 */

// ***************************************************** DOM Traversing ***********************************************
/* 
const h1 = document.querySelector('h1');

// Going downwards: child
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);
console.log(h1.children);
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered';

// Going upwards: parents
console.log(h1.parentNode);
console.log(h1.parentElement);

//  closest parent element that has this class and then it's simply applied all style to that element.
//  same as querySelector() but querySelector, finds children, no matter how deep in the Dom tree,
//  while the closest method finds parents.
h1.closest('.header').style.background = 'var(--gradient-secondary)';
h1.closest('h1').style.background = 'var(--gradient-primary)';

// Going sideways : siblings
// . for some reason in JavaScript, we can only access direct siblings. So basically only the previous and the next one.

console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

//  just like before, we also have the same methods or actually the same properties for nodes.
console.log(h1.previousSibling);
console.log(h1.nextSibling);

// selecting all siblings - find parent and select all children
console.log(h1.parentElement.children);
// Apply some style on all sibling except h1
[...h1.parentElement.children].forEach(function (el) {
  if (el != h1) {
    el.style.transform = 'scale(0.5)';
  }
});
*/

//**************************************************** Lifecycle DOM events ********************************************
/* 
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree build!', e);
});

window.addEventListener('load', function (e) {
  console.log('Page fully loaded', e);
});

window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
  console.log(e);
  e.returnValue = '';
});
 */
var fullname = 'Joe Black';
var obj = {
  fullname: 'Mary Jackson',
  prop: {
    fullname: 'Bob Smith',
    getFullname: function () {
      return this.fullname;
    },
  },
};
console.log(obj.prop.getFullname());
var test = obj.prop.getFullname;
console.log(test());
