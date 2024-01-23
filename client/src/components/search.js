import React, {useRef, useEffect, useState} from 'react';

const Search = () => {
    const [searchResults, setSearchResults] = useState([]);

  const searchSuperheroes = async () => {
    const searchName = document.getElementById('searchName');
    const searchPublisher = document.getElementById('searchPublisher');
    const searchPower = document.getElementById('searchPower');
    const searchRace = document.getElementById('searchRace');
    
    const name = searchName.value.trim();
    const publisher = searchPublisher.value.trim();
    const power = searchPower.value.trim();
    const race = searchRace.value.trim();

    const searchUri = `/api/search?name=${name}&publisher=${publisher}&power=${power}&race=${race}`;
    const response = await fetch(searchUri);

    if(response.ok) {
      const data = await response.json();
      setSearchResults(data);
    } else {
      console.error('Error:', response.statusText);
    }
  }

  // show the expanded detailed info for each superhero with an expand button
  const toggleDetails = (index) => {
    const updatedResults = [...searchResults];
    updatedResults[index].expanded = !updatedResults[index].expanded;
    setSearchResults(updatedResults);
  };

  return(
    <div class="container">
      <h2>Search For A Superhero</h2>
      <input type="text" id="searchName" placeholder="Search Name"/>
      <input type="text" id="searchPublisher" placeholder="Search Publisher"/>
      <input type="text" id="searchPower" placeholder="Search Power"/>
      <input type="text" id="searchRace" placeholder="Search Race"/>
      <button id="searchSuperheroes" onClick={()=>searchSuperheroes()}>Search</button>
      <div id="searchResult">
        <table>
          <thead>
          <tr>
            <th>Name</th>
            <th>Publisher</th>
            <th>Search on DuckDuckGo</th>
          </tr>
          </thead>
          <tbody>
            {searchResults.map((result, index) => (
              <React.Fragment key={result.id}>
                <tr>
                  <td>{result.name}</td>
                  <td>{result.Publisher}</td>
                  <td>
                    <a
                      href={`https://duckduckgo.com/?q=${encodeURIComponent(result.name + " " + result.Publisher)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      DDG Search
                    </a>
                  </td>
                  <td>
                    <button onClick={() => toggleDetails(index)}>
                      {result.expanded ? 'Hide' : 'Expand'}
                    </button>
                  </td>
                </tr>
                {result.expanded && (
                  <tr>
                    <td colSpan="4">
                      <div>
                        <p>Gender: {result.Gender}</p>
                        <p>Eye Color: {result['Eye color']}</p>
                        <p>Skin Color: {result['Skin color']}</p>
                        <p>Hair Color: {result['Hair color']}</p>
                        <p>Race: {result.Race}</p>
                        <p>Height: {result.Height}</p>
                        <p>Alignment: {result.Alignment}</p>
                        <p>Weight: {result.Weight}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Search;

//AI PROMPT: create me a frontend component in react to display the search results in a table. i want to show the name, publisher, and a clickable link to search the hero on duck duck go, the duck duck go link should search "Hero Name, Publisher". I also want an expand button that when clicked will show the rest of the hero information.
// include the api call and inputs for search in the component as well