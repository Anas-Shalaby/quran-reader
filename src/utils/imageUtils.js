
const QURAN_IMAGES_BASE_PATH = '/quran-images/';

export const getQuranPageImage = (pageNumber) => {
  // Ensure pageNumber is a string and pad with zeros if needed
  const paddedPageNumber = String(pageNumber).padStart(3, '0');
  return `${QURAN_IMAGES_BASE_PATH}${paddedPageNumber}.png`;
};

export const getQuranPageImages = (startPage, endPage) => {
  const images = [];
  for (let page = startPage; page <= endPage; page++) {
    images.push({
      original: getQuranPageImage(page),
      thumbnail: getQuranPageImage(page),
    });
  }
  return images;
};