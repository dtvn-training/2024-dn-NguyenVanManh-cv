// view cv 
if (localStorage.getItem('view_cv') === null) {
    localStorage.setItem('view_cv', '100');
} else {
    let viewCount = parseInt(localStorage.getItem('view_cv')) + 1;
    if (viewCount < 100) {
        viewCount = 100;
    }
    localStorage.setItem('view_cv', viewCount.toString());
}

let currentViewCount = localStorage.getItem('view_cv');
document.getElementById('number_view').textContent = currentViewCount;

// Hiển thị hiệu ứng chạy số từ 0 đến 'view_cv'
let displayCount = 0;
let increment = 1; // Bước tăng giá trị, có thể điều chỉnh

let intervalId = setInterval(function () {
    document.getElementById('number_view').textContent = displayCount;
    displayCount += increment;

    if (displayCount > currentViewCount) {
        clearInterval(intervalId);
        document.getElementById('number_view').textContent = currentViewCount;
    }
}, 50); // Thời gian cập nhật, có thể điều chỉnh

let intervalId2 = setInterval(function () {
    document.getElementById('number_view2').textContent = displayCount;
    displayCount += increment;

    if (displayCount > currentViewCount) {
        clearInterval(intervalId);
        document.getElementById('number_view2').textContent = currentViewCount;
    }
}, 50); // Thời gian cập nhật, có thể điều chỉnh


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
ScrollReveal().reveal('#infor-detail li p' , { delay: 500, origin: 'bottom', interval: 200, distance: '300px' });
ScrollReveal().reveal('#contact , #contact-detail li' , { delay: 500, origin: 'bottom', interval: 200, distance: '300px' });
ScrollReveal().reveal('#objective' , { delay: 500, origin: 'bottom', interval: 200, distance: '300px' });
ScrollReveal().reveal('#education' , { delay: 500, origin: 'bottom', interval: 200, distance: '300px' });
ScrollReveal().reveal('#work , #work-detail li p' , { delay: 500, origin: 'bottom', interval: 200, distance: '300px' });
ScrollReveal().reveal('#skills , #skills ul li' , { delay: 500, origin: 'bottom', interval: 200, distance: '300px' });
ScrollReveal().reveal('#interests ' , { delay: 500, origin: 'bottom', interval: 200, distance: '300px' });
ScrollReveal().reveal('#other div li ' , { delay: 500, origin: 'bottom', interval: 200, distance: '300px' });
    