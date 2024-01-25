import React, { useState, useEffect } from 'react';

const PublicHeroLists = () => {
  const [publicHeroLists, setPublicHeroLists] = useState([]);
  const [superpowers, setSuperpowers] = useState({});
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    // Fetch public hero lists when the component mounts
    const fetchPublicHeroLists = async () => {
      try {
        const response = await fetch('/api/publicHeroLists');
        const data = await response.json();

        if (response.ok) {
          setPublicHeroLists(data);
        } else {
          console.error('Error:', data.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    // Call fetchPublicHeroLists on component mount
    fetchPublicHeroLists();
  }, []);

  // Fetch true superpowers when publicHeroLists changes
  useEffect(() => {
    const fetchTrueSuperpowers = async () => {
      try {
        const superpowersMap = {};
        await Promise.all(
          publicHeroLists.map(async (list) => {
            const response = await fetch(`/api/getSuperheroPowers/${list._id}`);
            const data = await response.json();

            if (response.ok) {
              superpowersMap[list._id] = data;
            } else {
              console.error('Error:', data.message);
            }
          })
        );
        setSuperpowers(superpowersMap);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    // Call fetchTrueSuperpowers when publicHeroLists changes
    fetchTrueSuperpowers();
  }, [publicHeroLists]);

  const changeToggle = () => {
    setToggle(!toggle);
  };

  return (
    <div className="container">
      <h2>Public Hero Lists</h2>
      {publicHeroLists.map((list) => (
        <div key={list._id}>
          <h3>{list.name}</h3>
          <p>Creator: {list.creatorNickname}</p>
          <p>Number of Heroes: {list.superheroes.length}</p>
          <p>Average Rating: {list.averageRating}</p>
          <p>Description: {list.description}</p>
          {/* Additional information for each hero in the list */}
          <button type="button" onClick={changeToggle}>
            {toggle ? 'Hide' : 'Expand List'}
          </button>
          {toggle
            ? list.superheroes.map((hero) => (
                <div key={hero._id}>
                  <p>Name: {hero.name}</p>
                  <p>Publisher: {hero.Publisher}</p>
                  <div>
                    {console.log(hero)}
                    <p>Race: {hero["Race"]}</p>
                    <p>Alignment: {hero["Alignment"]}</p>
                    <p>Eye Color: {hero["Eye color"]}</p>
                    <p>Gender: {hero["Gender"]}</p>
                    <p>Hair Color: {hero["Hair color"]}</p>
                    <p>Skin Color: {hero["Skin color"]}</p>
                    <p>Weight: {hero["Weight"]}</p>
                  </div>
                  {console.log(superpowers)}
                  {superpowers[list._id] && (
                    <p>Powers: {superpowers[list._id].map((hero) => hero.powers).join(', ')}</p>
                  )}
                </div>
              ))
            : ''}
        </div>
      ))}
    </div>
  );
};

export default PublicHeroLists;
//use the new api you made above to display the true super powers for each superhero in the list, give me the full react component with the new changes
