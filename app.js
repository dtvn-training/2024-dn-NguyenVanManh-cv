// scroll top 
const btnScrollToTop = document.querySelector(".btnScrollToTop");
btnScrollToTop.addEventListener("click", e => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth"
  });
});
window.addEventListener('scroll', e => {
  btnScrollToTop.style.display = window.scrollY > 20 ? 'block' : 'none';
});

// ScrollReveal
ScrollReveal({
    distance: '60px',
    duration: 2500,
    delay: 400
});

ScrollReveal().reveal('#about', { delay: 600, origin: 'bottom' });       
ScrollReveal().reveal('#nav-menu li ', { delay: 500, origin: 'bottom', interval: 200, distance: '300px' });
ScrollReveal().reveal('#about div' , { delay: 500, origin: 'bottom', interval: 200, distance: '300px' });
ScrollReveal().reveal('#inner-about p , #additional > p , #additional li ' , { delay: 500, origin: 'bottom', interval: 200, distance: '300px' });
ScrollReveal().reveal('#introduction' , { delay: 500, origin: 'bottom', interval: 200, distance: '300px' });
ScrollReveal().reveal('#infor-detail li' , { delay: 500, origin: 'bottom', interval: 200, distance: '300px' });
ScrollReveal().reveal('#contact , #contact-detail li' , { delay: 500, origin: 'bottom', interval: 200, distance: '300px' });
ScrollReveal().reveal('#objective' , { delay: 500, origin: 'bottom', interval: 200, distance: '300px' });
ScrollReveal().reveal('#education' , { delay: 500, origin: 'bottom', interval: 200, distance: '300px' });
ScrollReveal().reveal('#work , #work-detail li' , { delay: 500, origin: 'bottom', interval: 200, distance: '300px' });
ScrollReveal().reveal('#skills , #skills ul li' , { delay: 500, origin: 'bottom', interval: 200, distance: '300px' });
    