import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Joke from './newJoke';
import './JokeList.css';


const JokeList = function({numJokes=5}){
    const [jokes, setJokes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    
    useEffect(function(){
        const getJokes = async function() {
            try {
            // load jokes one at a time, adding not-yet-seen jokes
                let j = [];
                let seenJokes = new Set();
            
                while (j.length < numJokes) {
                    let res = await axios.get("https://icanhazdadjoke.com", {
                        headers: { Accept: "application/json" }
                    });
                    let { ...joke } = res.data;
            
                    if (!seenJokes.has(joke.id)) {
                        seenJokes.add(joke.id);
                        j.push({ ...joke, votes: 0 });
                    } 
                    else {
                        console.log("duplicate found!");
                    }
                }
            setJokes(j)
            setIsLoading(false)
            } 
            catch (err) {
                    console.error(err);
            }
        }

        if(jokes.length === 0){
            getJokes();
        }
    }, [jokes, numJokes]);

    const generateNewJokes = function(){
        setJokes([]);
        setIsLoading(true);
    }

    const vote = function(id, delta) {
        setJokes(allJokes =>
            allJokes.map(j => (j.id === id ? { ...j, votes: j.votes + delta } : j))
        );
    }

    if(isLoading){
        return(
            <div className="loading">
                <i className="fas fa-4x fa-spinner fa-spin" />
            </div>
        )
    }

    let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

    return(
        <div className="JokeList">
        <button
          className="JokeList-getmore"
          onClick={generateNewJokes}
        >
          Get New Jokes
        </button>

        {sortedJokes.map(j => (
          <Joke
            text={j.joke}
            key={j.id}
            id={j.id}
            votes={j.votes}
            vote={vote}
          />
        ))}
      </div>
    )
    
}

export default JokeList;