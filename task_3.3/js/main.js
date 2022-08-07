'use strict';

// Вказував статичні classname (для зручності), потім можливо буде зробити окремий файл зі css стилями, чи переробити методи з аргументами;
const appConstants = {
  DISABLED: 'disabled',
  ACTIVE: 'active',
  AMOUNT_PAGINATION_ITEMS: 6,
  PAGINATION_RANGE: 3,
  CLASS_PAGINATION_ITEMS: 'page-item',
  DATA_ATTREBUTE: 'data-value',
  PREVIOUS: 'previous',
  NEXT: 'next',
};

const selectorOptions = [
  {
    selectorName: 'people',
    urlApi: 'https://swapi.dev/api/people/',
    dataList: (selectorDataList) => new PeopleList(selectorDataList),
  },
  {
    selectorName: 'vehicles',
    urlApi: `https://swapi.dev/api/vehicles/`,
    dataList: (selectorDataList) => new VehiclesList(selectorDataList),
  },
];

// Анімація завантаження даних!;
class Preloader {
  constructor(selectorPreloader) {
    this.selectorPreloader = selectorPreloader;
  }

  renderPreloader() {
    const $preloaderBox = document.createElement('div');
    $preloaderBox.className = 'preloader-box';

    for (let i = 0; i <= 5; i++) {
      const $span = document.createElement('span');
      $preloaderBox.appendChild($span);
    }

    this._getPrealoder().appendChild($preloaderBox);
  }

  togglePreloader() {
    this._getPrealoder().classList.toggle('hidden');
  }

  _getPrealoder() {
    return document.querySelector(this.selectorPreloader);
  }
}

// Витяг даних з сторонього серверу!;
class SwaggerApi {
  constructor(preloader) {
    this.url = 'https://swapi.dev/api/vehicles/';
    this.currentPageIndex = 1;
    this.preloader = preloader;
  }

  // Using Async/Await;
  // TODO: new URL, axios config отдавать

  async getData(dataList) {
    this.preloader.togglePreloader();

    try {
      const result = await axios.get(
        `${this.url}?page=${this.currentPageIndex}`
      );
      dataList.loadDataList(result.data.results);
    } catch (error) {
      console.error(error);
    } finally {
      this.preloader.togglePreloader();
    }
  }

  // Using Promise;
  // getData(dataList) {
  //   this.preloader.togglePreloader();

  //   const result = axios.get(`${this.url}?page=${this.currentPageIndex}`);

  //   result
  //     .then((res) => {
  //       dataList.loadDataList(res.data.results);
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     })
  //     .finally(() => {
  //       this.preloader.togglePreloader();
  //     });
  // }

  // TODO: implemetation;
  hasNextPages() {
    return axios
      .get(`${this.url}?page=${this.currentPageIndex + 2}`)
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  setUrl(url) {
    this.url = url;
  }

  setCurrentPageIndex(currentPageIndex) {
    this.currentPageIndex = currentPageIndex;
  }

  getCurrentPageIndex() {
    return this.currentPageIndex;
  }

  increaseCurrentPageIndex() {
    this.currentPageIndex++;
  }

  decreaseCurrentPageIndex() {
    this.currentPageIndex--;
  }
}

// Для роботи з Списком даних!;
class DataList {
  constructor(selectorDataList) {
    this.selectorDataList = selectorDataList;
  }

  loadDataList(data) {
    data.forEach((item) => {
      this.addItem(item);
    });
  }

  addItem(item) {}

  clearDataList = () => {
    const $dataList = this.getDataList();

    while ($dataList.firstChild) {
      $dataList.removeChild($dataList.firstChild);
    }
  };

  getDataList() {
    return document.querySelector(this.selectorDataList);
  }
}

class PeopleList extends DataList {
  constructor(selectorDataList) {
    super(selectorDataList);
  }

  addItem(person) {
    const $li = document.createElement('li');
    $li.className = 'list-group-item';

    $li.innerText = `
          ${person['name']}
          (birth year: ${person['birth_year']})
          `;

    this.getDataList().appendChild($li);
  }
}

class VehiclesList extends DataList {
  constructor(selectorDataList) {
    super(selectorDataList);
  }

  addItem(vehicle) {
    const $li = document.createElement('li');
    $li.className = 'list-group-item';

    $li.innerText = `
          ${vehicle['name']}
          model: ${vehicle['model']}
          manufacturer: ${vehicle['manufacturer']}
          `;
    this.getDataList().appendChild($li);
  }
}

// Перехід поміж сторінками контенту!;
class Pagination {
  constructor(selectorPagination) {
    this.selectorPagination = selectorPagination;
  }

  // Вибір був між статичними даними та сгенерованими (зупинився на динамічному варіанті)!;
  renderPagination() {
    for (let i = 0; i <= appConstants.AMOUNT_PAGINATION_ITEMS; i++) {
      let $li;
      let $a;

      if (i === 0) {
        $li = this._createElementLi(
          [appConstants.CLASS_PAGINATION_ITEMS, appConstants.DISABLED],
          appConstants.PREVIOUS
        );
        $a = this._createElementA('Previous', ['page-link']);
      } else if (i === 1) {
        $li = this._createElementLi(
          [appConstants.CLASS_PAGINATION_ITEMS, appConstants.ACTIVE],
          i
        );
        $a = this._createElementA(i, ['page-link']);
      } else if (i === appConstants.AMOUNT_PAGINATION_ITEMS - 1) {
        $li = this._createElementLi(
          [appConstants.CLASS_PAGINATION_ITEMS],
          '...'
        );
        $a = this._createElementA('...', ['page-link']);
      } else if (i === appConstants.AMOUNT_PAGINATION_ITEMS) {
        $li = this._createElementLi(
          [appConstants.CLASS_PAGINATION_ITEMS],
          appConstants.NEXT
        );
        $a = this._createElementA('Next', ['page-link']);
      } else {
        $li = this._createElementLi([appConstants.CLASS_PAGINATION_ITEMS], i);
        $a = this._createElementA(i, ['page-link']);
      }

      $li.appendChild($a);
      this._getPagination().appendChild($li);
    }
  }

  _getClickListener(thisInstanse, swaggerApi, dataList) {
    return function clickListener(event) {
      const dataValue = event.target.closest(
        '.' + appConstants.CLASS_PAGINATION_ITEMS
      ).dataset.value;

      if (
        !event.target.classList.contains(appConstants.DISABLED) &&
        dataValue !== '...'
      ) {
        thisInstanse._applySelectedButton(dataValue, swaggerApi, dataList);
      }
    };
  }

  addPaginationListener(swaggerApi, dataList) {
    this._getPagination().addEventListener(
      'click',
      this._getClickListener(this, swaggerApi, dataList)
    );
  }

  removePaginationListener() {
    this._getPagination().removeEventListener('click', this._getClickListener);
  }

  _applySelectedButton(dataValue, swaggerApi, dataList) {
    const $paginationElements = this._getPagination().querySelectorAll(
      '.' + appConstants.CLASS_PAGINATION_ITEMS
    );
    $paginationElements[swaggerApi.getCurrentPageIndex()].classList.remove(
      appConstants.ACTIVE
    );

    if (dataValue === appConstants.PREVIOUS) {
      swaggerApi.decreaseCurrentPageIndex();
    } else if (dataValue === appConstants.NEXT) {
      swaggerApi.increaseCurrentPageIndex();
    } else {
      swaggerApi.setCurrentPageIndex(Number.parseInt(dataValue));
    }

    this._updatePaginationElements($paginationElements, swaggerApi);

    dataList.clearDataList();
    swaggerApi.getData(dataList);
  }

  _updatePaginationElements(paginationElements, swaggerApi) {
    this._previousButtonState(paginationElements[0], swaggerApi);

    const lengthPaginationList = paginationElements.length;

    this._nextButtonState(
      paginationElements[lengthPaginationList - 1],
      lengthPaginationList,
      swaggerApi
    );

    this._paginationRange(
      paginationElements[1],
      paginationElements[lengthPaginationList - 2],
      lengthPaginationList,
      swaggerApi
    );

    paginationElements[swaggerApi.getCurrentPageIndex()].classList.add(
      appConstants.ACTIVE
    );
  }

  _previousButtonState(previousElement, swaggerApi) {
    if (swaggerApi.getCurrentPageIndex() > 1) {
      previousElement.classList.remove(appConstants.DISABLED);
    } else {
      previousElement.classList.add(appConstants.DISABLED);
    }
  }

  _nextButtonState(nextElement, lengthPaginationList, swaggerApi) {
    if (swaggerApi.getCurrentPageIndex() < lengthPaginationList - 2) {
      nextElement.classList.remove(appConstants.DISABLED);
    } else {
      nextElement.classList.add(appConstants.DISABLED);
    }
  }

  _paginationRange(
    firstButton,
    penultimateButton,
    lengthPaginationList,
    swaggerApi
  ) {
    if (swaggerApi.getCurrentPageIndex() > appConstants.PAGINATION_RANGE) {
      firstButton.firstChild.innerText = '...';
      firstButton.setAttribute(appConstants.DATA_ATTREBUTE, '...');
    } else {
      firstButton.firstChild.innerText = '1';
      firstButton.setAttribute(appConstants.DATA_ATTREBUTE, '1');
    }

    if (
      swaggerApi.getCurrentPageIndex() <
      lengthPaginationList - 1 - appConstants.PAGINATION_RANGE
    ) {
      penultimateButton.firstChild.innerText = '...';
      penultimateButton.setAttribute(appConstants.DATA_ATTREBUTE, '...');
    } else {
      penultimateButton.firstChild.innerText = `${
        appConstants.AMOUNT_PAGINATION_ITEMS - 1
      }`;
      penultimateButton.setAttribute(
        appConstants.DATA_ATTREBUTE,
        `${appConstants.AMOUNT_PAGINATION_ITEMS - 1}`
      );
    }
  }

  _createElementLi(classes, attr) {
    const $li = document.createElement('li');
    $li.setAttribute(appConstants.DATA_ATTREBUTE, attr);

    classes.forEach((className) => {
      $li.classList.add(className);
    });

    return $li;
  }

  _createElementA(innerText, classes) {
    const $a = document.createElement('a');

    classes.forEach((className) => {
      $a.classList.add(className);
    });
    $a.innerText = innerText;

    return $a;
  }

  _getPagination() {
    return document.querySelector(this.selectorPagination);
  }
}

class App {
  constructor(selectorDataList, selectorPreloader, selectorPagination) {
    this.selectorDataList = selectorDataList;
    this.preloader = new Preloader(selectorPreloader);
    this.swaggerApi = new SwaggerApi(this.preloader);
    this.dataList = new VehiclesList(this.selectorDataList);
    this.pagination = new Pagination(selectorPagination);
  }

  run() {
    this.preloader.renderPreloader();

    this.swaggerApi.getData(this.dataList);
    this._addSelectorListener();

    this.pagination.renderPagination();
    this.pagination.addPaginationListener(this.swaggerApi, this.dataList);
  }

  _addSelectorListener() {
    const $selector = document.querySelector('#selector');

    $selector.addEventListener('change', (event) => {
      const value = event.target.value;
      this.dataList.clearDataList();
      this.pagination.removePaginationListener();

      selectorOptions.forEach((option) => {
        if (value === option.selectorName) {
          this.dataList = option.dataList(this.selectorDataList);
          this.swaggerApi.setUrl(option.urlApi);
          this.swaggerApi.getData(this.dataList);
        }
      });

      this.pagination.addPaginationListener(this.swaggerApi, this.dataList);
    });
  }
}

const app = new App('#data_list', '#preloader', '.pagination');

app.run();
