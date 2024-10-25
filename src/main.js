import { fetchImages } from './js/pixabay-api';
import { renderSearchForm, renderImageGallery } from './js/render-functions';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const main = document.querySelector('main');

const searchForm = renderSearchForm();
main.appendChild(searchForm);

const gallery = document.createElement('div');
gallery.classList.add('gallery');
main.appendChild(gallery);

const loader = document.createElement('span');
loader.classList.add('loader');

const lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
});

searchForm.addEventListener('submit', event => {
  event.preventDefault();
  main.appendChild(loader);
  const searchQuery = document.querySelector('#search-input').value.trim();
  if (searchQuery === '') {
    main.removeChild(loader);
    iziToast.error({
      title: 'Error',
      message: 'Please enter your search query!',
      position: 'topRight',
      timeout: 3000,
    });
    return;
  }

  gallery.innerHTML = '';

  fetchImages(searchQuery)
    .then(images => {
      main.removeChild(loader);

      if (images.hits.length === 0) {
        iziToast.error({
          title: 'No results',
          message:
            'Sorry, there are no images matching your search query. Please try again!',
          position: 'topRight',
          timeout: 3000,
        });
      } else {
        const imageGallery = renderImageGallery(images.hits);
        imageGallery.forEach(imageCard => {
          gallery.appendChild(imageCard);
        });
        lightbox.refresh();
      }
    })
    .catch(error => {
      main.removeChild(loader);

      console.error(error);
      iziToast.error({
        title: 'Error',
        message: 'Error while receiving images!',
        position: 'topRight',
        timeout: 3000,
      });
    });
  document.querySelector('#search-input').value = '';
});
