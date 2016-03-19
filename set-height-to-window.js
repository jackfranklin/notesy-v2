let fns = {};

function setHeight(elem) {
  const renderedDiv = document.querySelector('#app ' + elem);
  const header = document.querySelector('#app .header');
  const heightVal = window.innerHeight - header.offsetHeight;
  renderedDiv.style.height = heightVal + 'px';
}

function makeEventHandlerForElem(elem) {
  return function() {
    setHeight(elem);
  }
}

export function didMount(elem) {
  var fn = makeEventHandlerForElem(elem);
  fns[elem] = fn;
  setHeight(elem);
  window.addEventListener('resize', fns[elem]);
}

export function didUnmount(elem) {
  window.removeEventListener('resize', fns[elem]);
}
