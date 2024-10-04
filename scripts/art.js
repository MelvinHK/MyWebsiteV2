/**
 * Since the gallery can be drag scrolled, default click listeners will not suffice.
 * This function will differentiate between drag+release and clicks on the images.
 * 
 * @param {function(Element)} callback - A callback for when an image is clicked.
 */
export function onImageClick(callback) {
  const images = document.getElementById('gallery').children;

  const clickThreshold = 6; // In pixels; if the dragged distance is less than this, it is a click.
  let startX;
  let startY;

  const setNewXY = (event) => {
    startX = event.pageX;
    startY = event.pageY;
  };

  const checkIfClicked = (event) => {
    const draggedX = Math.abs(event.pageX - startX);
    const draggedY = Math.abs(event.pageY - startY);

    if (draggedX < clickThreshold && draggedY < clickThreshold) {
      callback(event.target);
    }
  };

  for (const image of images) {
    image.removeEventListener('mousedown', setNewXY);
    image.removeEventListener('mouseup', checkIfClicked);

    image.addEventListener('mousedown', setNewXY);
    image.addEventListener('mouseup', checkIfClicked);
  }
}

/**
 * @param {Element} image 
 */
export function enlargeImage(image) {
  console.log(image.src);
}