document.querySelectorAll('.slider').forEach(slider => {
  let index = 0;
  const slides = slider.querySelectorAll('.slide');

  slider.addEventListener('click', () => {
    slides[index].classList.remove('active');
    index = (index + 1) % slides.length;
    slides[index].classList.add('active');
  });
});
