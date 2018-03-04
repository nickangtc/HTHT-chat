// Animate scroll to specified element on page w/o '#' in resultant URL
function smoothScroll(elementId) {
  const el = $(`#${elementId}`);
  if (el.length === 0) return;

  $('html, body').animate({
    scrollTop: $(el).offset().top,
  }, 700);
}

function autoScroll(elementId) {
  const messagesDiv = $(`#${elementId}`);
  if (messagesDiv) {
    messagesDiv.stop().animate({
      scrollTop: messagesDiv[0].scrollHeight,
    }, 1500);
  }
}

export {
  smoothScroll,
  autoScroll,
};
