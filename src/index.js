import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  countryInput: document.querySelector('#search-box'),
  countriesList: document.querySelector('.country-list'),
  countryInfoBox: document.querySelector('.country-info'),
};

refs.countryInput.addEventListener(
  'input',
  debounce(onCountryInput, DEBOUNCE_DELAY)
);

function onCountryInput(evt) {
  const inputValue = evt.target.value.trim();

  //   console.log(inputValue, inputValue.length);

  if (inputValue === '') {
    Notify.warning('Please start entering some country for searching');
    clearCountryMarkup();
    return;
  }

  fetchCountries(inputValue)
    .then(countries => {
      //   console.log(countries);
      //   console.log(countries.length);
      if (countries.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        clearCountryMarkup();
      } else if (countries.length >= 2 && countries.length <= 10) {
        createCountriesMarkup(countries);
        refs.countryInfoBox.innerHTML = '';
      } else if (countries.length === 1) {
        createOneCountryMarkup(countries);

        refs.countriesList.innerHTML = '';
      }
    })
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
      clearCountryMarkup();
    });
}

function createCountriesMarkup(countries) {
  const markup = countries
    .map(country => {
      return `<li class="country-item">
            <img class="img" src="${country.flags.svg}" alt="Flag of ${country.name.official}">
            <h1 class="title">${country.name.official}</h1>
            </li>`;
    })
    .join('');
  refs.countriesList.innerHTML = markup;
}

function createOneCountryMarkup(countries) {
  const markup = countries
    .map(country => {
      return `<div class="country"><img class="img" src="${
        country.flags.svg
      }"  alt="Flag of ${country.name.official}">
    <h1 class ="title">${country.name.official}</h1></div>
    <p class="text"><b>Capital:</b> ${country.capital}</p>
    <p class="text"><b>Population:</b> ${country.population}</p>
    <p class="text"><b>Languages:</b> ${Object.values(country.languages)}</p>`;
    })
    .join('');

  refs.countryInfoBox.innerHTML = markup;

  const bigCountry = document.querySelector('.country');
  bigCountry.classList.add('big');
}

function clearCountryMarkup() {
  refs.countriesList.innerHTML = '';
  refs.countryInfoBox.innerHTML = '';
}
