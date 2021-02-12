const barElement = document.getElementById("bar");
const closeElement = document.getElementById("close");
const dropdownElement = document.getElementById("dropdown-content");
const scrollList = document.getElementById("scroll-list");

function toggleContent() {
  barElement.classList.toggle("d-none");
  closeElement.classList.toggle("d-none");
  dropdownElement.classList.toggle("d-none");
}

function copyToClipboard(id) {
  const element = document.getElementById(id);
  const range = document.createRange();
  range.selectNodeContents(element);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  document.execCommand("copy");
}

function onUpArrow() {
  if (scrollList.scrollTop !== 0) {
    scrollList.scrollTop -= 30;
  }
}

function onDownArrow() {
  if (scrollList.scrollTop !== scrollList.scrollHeight) {
    scrollList.scrollTop += 30;
  }
}
