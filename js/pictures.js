'use strict';
var ESC_KEY = 27;
var PHOTOS_COUNT = 25;
var USER_COMMENTS = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
var PHOTO_DESCRIPTIONS = ['Тестим новую камеру!', 'Затусили с друзьями на море', 'Как же круто тут кормят', 'Отдыхаем...', 'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......', 'Вот это тачка!'];
var usersPhotos = [];
var similarListElement = document.querySelector('.pictures');
var similarPhotoTemplateElement = document.querySelector('#picture').content.querySelector('.picture__link');
var bigPhotoElement = document.querySelector('.big-picture');
var socialCommentElement = document.querySelector('.social__comment');
var socialCommentListElement = document.querySelector('.social__comments');

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var showElement = function (elem) {
  elem.classList.remove('hidden');
};

var hideElement = function (elem) {
  elem.classList.add('hidden');
};

var visuallyHideElement = function (elem) {
  elem.classList.add('visually-hidden');
};

var getRandomComments = function () {
  var comments = [];
  var commentCount = getRandomNumber(1, 2);

  for (var i = 0; i < commentCount; i++) {
    comments.push(USER_COMMENTS[getRandomNumber(0, USER_COMMENTS.length - 1)]);
  }

  return comments;
};


var initPhotos = function () {
  for (var i = 0; i < PHOTOS_COUNT; i++) {
    var newPhotoBuild = {
      url: 'photos/' + (i + 1) + '.jpg',
      likes: getRandomNumber(15, 200),
      comments: getRandomComments(),
      description: PHOTO_DESCRIPTIONS[getRandomNumber(0, PHOTO_DESCRIPTIONS.length - 1)],
      dataId: i
    };
    usersPhotos.push(newPhotoBuild);
  }

  return usersPhotos;
};


var createNewPhoto = function (photo) {
  var photoElement = similarPhotoTemplateElement.cloneNode(true);

  photoElement.querySelector('.picture__img').src = photo.url;
  photoElement.querySelector('.picture__img').dataset.idnum = photo.dataId;
  photoElement.querySelector('.picture__stat--likes').textContent = photo.likes;
  photoElement.querySelector('.picture__stat--comments').textContent = photo.comments.length;

  return photoElement;
};


var renderPhotos = function (photos) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < photos.length; i++) {
    fragment.appendChild(createNewPhoto(photos[i]));
  }

  similarListElement.appendChild(fragment);
};

var createSocialComment = function (photo) {
  var comment = socialCommentElement.cloneNode(true);
  var newComments = [];

  for (var i = 0; i < photo.comments.length; i++) {
    comment.querySelector('.social__picture').src = 'img/avatar-' + getRandomNumber(1, 6) + '.svg';
    comment.querySelector('.social__text').textContent = photo.comments[i];

    newComments.push(comment);
  }

  return newComments;
};

var createBigPhoto = function (photo) {
  bigPhotoElement.classList.remove('hidden');
  bigPhotoElement.querySelector('.big-picture__img img').src = photo.url;
  bigPhotoElement.querySelector('.likes-count').textContent = photo.likes;
  bigPhotoElement.querySelector('.comments-count').textContent = photo.comments.length;
  bigPhotoElement.querySelector('.social__caption').textContent = photo.description;

  var socialComments = createSocialComment(photo);
  for (var i = 0; i < socialComments.length; i++) {
    socialCommentListElement.appendChild(socialComments[i]);
  }

  return bigPhotoElement;
};


var init = function () {
  usersPhotos = initPhotos();
  renderPhotos(usersPhotos);
  visuallyHideElement(document.querySelector('.social__comment-count'));
  visuallyHideElement(document.querySelector('.social__loadmore'));
};

init();

// открытие и закрытие редактируемого изображения
var imageSetupElement = document.querySelector('#upload-file');
var imageEditElement = document.querySelector('.img-upload__overlay');
var closeimageEditElement = imageEditElement.querySelector('#upload-cancel');
var imagePreviewWrapperElement = imageEditElement.querySelector('.img-upload__preview');
var imagePreviewElement = imageEditElement.querySelector('.img-upload__preview img');
var sizeValueElement = document.querySelector('.resize__control--value');

imageSetupElement.addEventListener('change', function () {
  showElement(imageEditElement);
  sizeValueElement.value = 100 + '%';

  document.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ESC_KEY) {
      hideElement(imageEditElement);
    }
  });
});

closeimageEditElement.addEventListener('click', function () {
  hideElement(imageEditElement);
});


// наложение фильтров на редактируемоге изображение
var effectScale = document.querySelector('.img-upload__scale');
var imageEffects = document.querySelector('.img-upload__effects');

imageEffects.addEventListener('click', function (evt) {
  if (evt.target.value === 'none') {
    hideElement(effectScale);
  } else {
    showElement(effectScale);
  }

  imagePreviewElement.className = 'effects__preview--' + evt.target.value;
});

// масштабирование редактируемого изображения
var resizeMinusElement = document.querySelector('.resize__control--minus');
var resizePlusElement = document.querySelector('.resize__control--plus');
var minResize = 25;
var maxResize = 100;
var stepResize = 25;

var getCurentSizeNumber = function () {
  return Number(sizeValueElement.value.slice(0, -1));
};

var sizeMinusHandler = function () {
  var newSizeNumber = getCurentSizeNumber() - stepResize;
  sizeValueElement.value = newSizeNumber + '%';
  imagePreviewWrapperElement.style = 'transform: scale(' + (newSizeNumber / 100) + ')';
};

var sizePlusHandler = function () {
  var newSizeNumber = getCurentSizeNumber() + stepResize;
  sizeValueElement.value = newSizeNumber + '%';
  imagePreviewWrapperElement.style = 'transform: scale(' + (newSizeNumber / 100) + ')';
};

resizeMinusElement.addEventListener('click', function () {
  if (getCurentSizeNumber() > minResize) {
    sizeMinusHandler();
  }
});

resizePlusElement.addEventListener('click', function () {
  if (getCurentSizeNumber() < maxResize) {
    sizePlusHandler();
  }
});

// раскрытие большого изображения по клику на превью
var picturePreviewElement = document.querySelectorAll('.picture__link');
var closeBigPhotoElement = document.querySelector('.big-picture__cancel');

for (var i = 0; i < picturePreviewElement.length; i++) {
  picturePreviewElement[i].addEventListener('click', function (evt) {
    createBigPhoto(usersPhotos[evt.target.dataset.idnum]);
  });
}

closeBigPhotoElement.addEventListener('click', function () {
  hideElement(bigPhotoElement);
});
