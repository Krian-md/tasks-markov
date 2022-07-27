// https://cdn.jsdelivr.net/npm/boxicons@latest/css/boxicons.min.css
'use strict';

const appStates = {
  DISABLED: 'disabled',
  ACTIVE: 'active',
};

const paginationList = [
  {
    title: 'Previous',
    data_value: 'Previous',
    classes: {
      li: ['page-item', appStates.DISABLED],
      a: ['page-link'],
    },
  },
  {
    title: '1',
    data_value: '1',
    classes: {
      li: ['page-item', appStates.ACTIVE],
      a: ['page-link'],
    },
  },
  {
    title: '2',
    data_value: '2',
    classes: {
      li: ['page-item'],
      a: ['page-link'],
    },
  },
  {
    title: '3',
    data_value: '3',
    classes: {
      li: ['page-item'],
      a: ['page-link'],
    },
  },
  {
    title: 'Next',
    data_value: 'Next',
    classes: {
      li: ['page-item'],
      a: ['page-link'],
    },
  },
];

let currentPageIndex = 1;

const $ul = document.querySelector('#people_list');
const $preloader = document.querySelector('#preloader');
const $pagination = document.querySelector('.pagination');

const addPersonItem = (person) => {
  const secondFilm = _.get(person, '["films"][1]', 'Unknown');
  const $li = document.createElement('li');
  $li.className = 'list-group-item';

  $li.innerText = `
        ${person['name']}
        (birth year: ${person['birth_year']})
        - second film: ${secondFilm}
    `;
  $ul.appendChild($li);
};

const renderPreloader = () => {
  const $preloaderBox = document.createElement('div');
  $preloaderBox.className = 'preloader-box';

  for (let i = 0; i <= 5; i++) {
    const $span = document.createElement('span');
    $preloaderBox.appendChild($span);
  }

  $preloader.appendChild($preloaderBox);
};

const togglePreloader = () => {
  $preloader.classList.toggle('hidden');
};

const loadPeopleList = async () => {
  togglePreloader();
  try {
    const result = await axios.get(
      `https://swapi.dev/api/people/?page=${currentPageIndex}`
    );

    result.data.results.forEach((person) => {
      addPersonItem(person);
    });
  } catch (error) {
    console.log(error);
  } finally {
    togglePreloader();
  }
};

const clearPeopleList = () => {
  while ($ul.firstChild) {
    $ul.removeChild($ul.firstChild);
  }
};

const createElementA = (innerText, classes) => {
  const $a = document.createElement('a');
  classes.forEach((className) => {
    $a.classList.add(className);
  });
  $a.innerText = innerText;

  return $a;
};

const createElementLi = (classes, attr) => {
  const $li = document.createElement('li');
  $li.setAttribute('data-value', attr);
  classes.forEach((className) => {
    $li.classList.add(className);
  });
  return $li;
};

const renderPagination = () => {
  paginationList.forEach((paginationElem) => {
    const $li = createElementLi(
      paginationElem.classes.li,
      paginationElem.data_value
    );

    const $a = createElementA(paginationElem.title, paginationElem.classes.a);

    $li.appendChild($a);
    $pagination.appendChild($li);
  });
};

const clickPaginationlistener = () => {
  $pagination.addEventListener('click', function (event) {
    const dataValue = event.target.parentElement.dataset.value;
    if (dataValue !== 'undefind') {
      transitionLogic(dataValue);
    }
  });
};

const updateClassesPaginationLi = (paginationLi) => {
  if (currentPageIndex > 1) {
    paginationLi[0].classList.remove(appStates.DISABLED);
  } else {
    paginationLi[0].classList.add(appStates.DISABLED);
  }

  const lengthPaginationList = paginationList.length - 1;

  if (currentPageIndex < lengthPaginationList - 1) {
    paginationLi[lengthPaginationList].classList.remove(appStates.DISABLED);
  } else {
    paginationLi[lengthPaginationList].classList.add(appStates.DISABLED);
  }

  paginationLi[currentPageIndex].classList.add(appStates.ACTIVE);
};

const transitionLogic = (dataValue) => {
  const $paginationLi = document.querySelectorAll('.pagination li');
  $paginationLi[currentPageIndex].classList.remove(appStates.ACTIVE);
  clearPeopleList();

  switch (dataValue) {
    case 'Previous':
      currentPageIndex--;
      break;
    case '1':
      currentPageIndex = 1;
      break;
    case '2':
      currentPageIndex = 2;
      break;
    case '3':
      currentPageIndex = 3;
      break;
    case 'Next':
      currentPageIndex++;
      break;
    default:
      'Data value not found!';
  }

  updateClassesPaginationLi($paginationLi);
  loadPeopleList();
};

function run() {
  renderPreloader();
  loadPeopleList();
  renderPagination();
  clickPaginationlistener();
}

run();
