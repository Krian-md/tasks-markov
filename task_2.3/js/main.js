// mockup start
const list = ['Alex', 'Oleg', 'Olena'];
// mockup end

const LIMIT_LIST = 10;
const MIN_LENGTH = 3;
const MAX_LENGTH = 15;

const $ul = document.querySelector('ul#list');

const removeItem = ($element) => {
  $ul.removeChild($element);
};

const addItem = (item) => {
  const $li = document.createElement('li');
  $li.innerText = item;
  $li.addEventListener('click', (event) => {
    removeItem(event.target);

    const index = getIndexByName(event.target.innerText);
    if (index !== -1) {
      list.splice(index, 1);
    }

    $btn.disabled = false;
  });
  $ul.appendChild($li);
};

const updateItem = () => {};

list.forEach((el, index) => {
  addItem(el);
});

// FORM PATH
const $form = document.querySelector('form#user');
const $input = $form.querySelector('input[name="user_name"]');
const $btn = $form.querySelector('button');
const $validLength = document.querySelector('#valid-length');
const $validAmount = document.querySelector('#valid-amount');

$form.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = $input.value;
  // check validation
  if (isValidLength(value)) {
    if (isValidList()) {
      addItem(value);
      list.push(value);
      $input.value = '';
      $validAmount.style.display = 'none';
    } else {
      $btn.disabled = true;
      $validAmount.style.display = 'block';
    }
    $validLength.style.display = 'none';
  } else {
    $validLength.style.display = 'block';
  }
});

function isValidLength(value) {
  return value.length >= MIN_LENGTH && value.length <= MAX_LENGTH
    ? true
    : false;
}

function isValidList() {
  return list.length <= LIMIT_LIST ? true : false;
}

function getIndexByName(name) {
  const index = list.find((person) => person.name === name);
  console.log(index);
  return index;
}
