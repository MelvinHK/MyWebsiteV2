export function setImageClickListeners() {
  const images = document.getElementById('gallery').children;

  const clickThreshold = 6; // In pixels; if the dragged distance is less than this, it is a click.
  let startX;
  let startY;

  const setNewXY = (event) => {
    startX = event.pageX;
    startY = event.pageY;
  };

  const onMouseUp = (event, clicked) => {
    const draggedX = Math.abs(event.pageX - startX);
    const draggedY = Math.abs(event.pageY - startY);

    if (draggedX < clickThreshold && draggedY < clickThreshold) {
      clicked();
    }
  };

  const handleMouseDown = (e) => setNewXY(e);
  const handleMouseUp = (e) => onMouseUp(e, () => enlargeImage(e.target));

  for (const image of images) {
    image.removeEventListener('mousedown', handleMouseDown);
    image.removeEventListener('mouseup', handleMouseUp);

    image.addEventListener('mousedown', handleMouseDown);
    image.addEventListener('mouseup', handleMouseUp);
  }
}

function enlargeImage(image) {
  console.log(image.src);
}