import axios from 'axios';
import Notiflix from 'notiflix';

import SimpleLightbox from 'simplelightbox';

import 'simplelightbox/dist/simple-lightbox.min.css';

const PIXABAY_API_KEY = '39127015-a9e8e8777acb2ec37b8d78542';
const IMAGE_TYPE = 'photo';
const ORIENTATION = 'horizontal';
const SAFE_SEARCH = false;
const PER_PAGE = 40;

const form = document.getElementById('search-form');
const input = document.getElementsByTagName('input')[0];
const gallery = document.getElementsByClassName('gallery')[0];
const status = document.getElementsByClassName('status')[0];

let pageCounter = 1;
let total;

var lightbox = new SimpleLightbox('.gallery a', {
  /* options */
});

async function fetchImages(e) {
  e.preventDefault();
  const { data } = await axios.get(
    `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&orinentation=${ORIENTATION}&image_type=${IMAGE_TYPE}&safesearch=${SAFE_SEARCH}&q=${input.value}&page=${pageCounter}&per_page=${PER_PAGE} `
  );

  if (data.hits.length === 0) {
    Notiflix.Notify.warning(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    total = data?.totalHits;
    if (pageCounter === 1) {
      Notiflix.Notify.success(`Hooray! We found ${total} images.`);
    }
    const slides = data?.hits.map(image => {
      const {
        likes,
        views,
        comments,
        downloads,
        largeImageURL,
        webformatURL,
        tags,
      } = image;
      return `<a class="slide" href="${largeImageURL}">
		<div class="photo-card">
		  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
		  <div class="info">
			  <p class="info-item">
				  <b><i class="fa fa-thumbs-o-up" aria-hidden="true"></i> ${likes}</b>
			  </p>
			  <p class="info-item">
				  <b><i class="fa fa-eye" aria-hidden="true"></i> ${views}</b>
			  </p>
			  <p class="info-item">
				  <b><i class="fa fa-comment-o" aria-hidden="true"></i> ${comments}</b>
			  </p>
			  <p class="info-item">
				  <b><i class="fa fa-download" aria-hidden="true"></i> ${downloads}</b>
			  </p>
		  </div>
	  </div>
		</a>`;
    });
    gallery.innerHTML += slides.join('');
    lightbox.refresh();
  }
}

function formSubmit(e) {
  pageCounter = 1;
  total = 0;
  gallery.innerHTML = '';
  status.innerHTML = '';
  fetchImages(e);
}

window.onscroll = function (e) {
  if (
    window.innerHeight + Math.round(window.scrollY) >=
    document.body.offsetHeight - 100
  ) {
    const slidesCount = document.querySelectorAll('.slide').length;
    if (slidesCount < total) {
      pageCounter++;
      fetchImages(e);
    } else {
      status.innerHTML = `<h2 class="status-text">We're sorry, but you've reached the end of search results.</h2>`;
    }
  }
};

form.addEventListener('submit', formSubmit);
