'use strict';

function truncateText(text, length) {
  let truncatedText = text.substring(0, length);

  if (text.length > length) {
    truncatedText += '...';
  }

  return truncatedText;
}

module.exports = {
  truncateText: truncateText,
};