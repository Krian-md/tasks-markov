'use strict';

const appConfig = {
  URL: 'https://swapi.dev/api/people',
};

const appOptions = {
  ACTIVE: 'active',
  DISABLED: 'disabled',
  BUTTON_PREVIOUS: 'Previous',
  BUTTON_NEXT: 'Next',
  BUTTON_SPACE: '...',
  PAGINATION_ITEM_CLASS: 'page-item',
  PEOPLE_GROUP_CLASS: 'list-group-item',
  PAGINATE_TABS: 10,
};

class App {
  $parentList = null;
  $parentPaginate = null;

  constructor({ parentList, parentPaginate }) {
    if (!parentList) {
      return new Error('no parent!');
    }

    this.$parentList = parentList;
    this.$parentPaginate = parentPaginate;

    this.onInit();
  }

  _page = 1;
  get page() {
    return this._page;
  }
  set page(currentPage) {
    this._page = currentPage;
    this._redrawPaginate(currentPage);
    this.getPeople(currentPage);
  }

  _redrawPaginate(currentPage) {
    const $activeItem = this.$parentPaginate.querySelectorAll('a');
    if ($activeItem.length) {
      this._page = currentPage;
      $activeItem.forEach(($item, index) => {
        console.log($item);
        $item.classList.toggle(appOptions.ACTIVE, index === currentPage);
      });
    }

    this._buttonActivity(currentPage, $activeItem);
  }

  _buttonActivity(currentPage, $activeItem) {
    if (currentPage <= 1) {
      $activeItem[0].classList.add(appOptions.DISABLED);
    } else {
      $activeItem[0].classList.remove(appOptions.DISABLED);
    }

    if (currentPage >= $activeItem.length - 2) {
      $activeItem[$activeItem.length - 1].classList.add(appOptions.DISABLED);
    } else {
      $activeItem[$activeItem.length - 1].classList.remove(appOptions.DISABLED);
    }

    if (currentPage > 4 && $activeItem.length > appOptions.PAGINATE_TABS) {
      $activeItem[2].classList.add(appOptions.DISABLED);
      $activeItem[2].innerText = appOptions.BUTTON_SPACE;
    } else {
      $activeItem[2].classList.remove(appOptions.DISABLED);
      $activeItem[2].innerText = '2';
    }

    if (
      currentPage < $activeItem.length - 5 &&
      $activeItem.length > appOptions.PAGINATE_TABS
    ) {
      $activeItem[$activeItem.length - 3].classList.add(appOptions.DISABLED);
      $activeItem[$activeItem.length - 3].innerText = appOptions.BUTTON_SPACE;
    } else {
      $activeItem[$activeItem.length - 3].classList.remove(appOptions.DISABLED);
      $activeItem[$activeItem.length - 3].innerText =
        Number.parseInt($activeItem[$activeItem.length - 2].innerText) - 1;
    }
  }

  _isLoading = true;
  get isLoading() {
    return this._isLoading;
  }
  set isLoading(value) {
    this._isLoading = value;

    document
      .querySelector('.spinner-border')
      .classList.toggle('d-none', !value);
  }

  onInit() {}

  async getPeople(page) {
    this.isLoading = true;

    this.clearList();
    const result = await fetch(`${appConfig.URL}/?page=${page}`);
    const data = await result.json();
    this.renderList(data.results);
    this.isLoading = false;

    return data;
  }

  clearList() {
    this.$parentList.innerHTML = '';
  }

  renderList(list) {
    list.forEach((person) => {
      this.addPersonItem(person);
    });
  }

  addPersonItem(person) {
    const $li = document.createElement('li');
    $li.classList.add(appOptions.PEOPLE_GROUP_CLASS);
    $li.innerText = `${person['name']} (birth year: ${person['birth_year']})`;
    this.$parentList.appendChild($li);
  }

  renderPaginate(count) {
    const itemLength = Math.ceil(count / 10);

    const paginationLength =
      itemLength > appOptions.PAGINATE_TABS
        ? appOptions.PAGINATE_TABS + 1
        : itemLength + 1;

    for (let i = 0; i <= paginationLength; i++) {
      const $li = document.createElement('li');
      $li.classList.add(appOptions.PAGINATION_ITEM_CLASS);
      const $a = document.createElement('a');
      $a.classList.add('page-link');
      $a.href = '#';

      if (i === 0) {
        $a.classList.add(appOptions.DISABLED);
        $a.innerText = appOptions.BUTTON_PREVIOUS;
      } else if (i === 1) {
        $a.classList.add(appOptions.ACTIVE);
        $a.innerText = i;
      } else if (
        i === paginationLength - 2 &&
        paginationLength > appOptions.PAGINATE_TABS
      ) {
        $a.classList.add(appOptions.DISABLED);
        $a.innerText = appOptions.BUTTON_SPACE;
      } else if (i === paginationLength - 1) {
        $a.innerText = itemLength;
      } else if (i === paginationLength) {
        $a.innerText = appOptions.BUTTON_NEXT;
      } else {
        $a.innerText = i;
      }

      $li.appendChild($a);
      this.$parentPaginate.appendChild($li);
    }

    this._addPaginateListener();
  }

  _addPaginateListener() {
    this.$parentPaginate.addEventListener('click', (event) => {
      const target = event.target;

      if (!target.children[0]?.classList.contains(appOptions.DISABLED)) {
        if (target.innerText === appOptions.BUTTON_PREVIOUS) {
          this.page--;
        } else if (target.innerText === appOptions.BUTTON_NEXT) {
          this.page++;
        } else {
          this.page = Number.parseInt(target.innerText);
        }
      }

      event.preventDefault();
    });
  }
}

// Як краще, передавати селектор і постійно створювати, чи відразу передавати об'єкт?
const app = new App({
  parentList: document.querySelector('#people_list'),
  parentPaginate: document.querySelector('.pagination'),
});

app.getPeople(1).then((res) => {
  app.renderPaginate(res.count);
});
