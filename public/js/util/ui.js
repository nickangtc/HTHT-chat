// Animate scroll to specified element on page w/o '#' in resultant URL
function smoothScroll(elementId) {
  const el = $(`#${elementId}`);
  if (el.length === 0) return null;

  $('html, body').animate({
    scrollTop: $(el).offset().top,
  }, 700);
}

export {
  smoothScroll,
}
