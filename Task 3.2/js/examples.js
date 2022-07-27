// Using Fetch

// fetch('https://swapi.dev/api/people/?page=3')
//     .then((response) => response.json()) // get json from response
//     .then((json) => {
//         json.results.forEach(person => {
//             addPersonItem(person);
//         });
//     }); // get data

// request.catch();
// request.finally();

// Using Axios (more comfortable)

// axios.get('https://swapi.dev/api/people/?page=3').then((res) => {
//   res.data.results.forEach((person) => {
//     addPersonItem(person);
//   });
// });

// If the field is used once, it is not necessary to insert it to variable;
