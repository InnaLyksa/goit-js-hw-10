export function fetchCountries(name) {
  const searchCountry = 'name,capital,population,flags,languages';
  return fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=${searchCountry}`
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
