import './Home.scss';
import Navbar from '../../components/navbar/Navbar';
import Featured from '../../components/featured/Featured';
import List from '../../components/list/List';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Home = ({ type }) => {
  const [lists, setLists] = useState([]);
  const [genre, setGenre] = useState(null);

useEffect(() => {
    const getRandomLists = async () => {
      try {
        const res = await axios.get(
          `/api/lists${type ? "?type=" + type : ""}${genre ? "&genre=" + genre : ""}`,
          {
            headers: {
              token:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4Y2Q0Yjk0YjM0ZGM3OWE3YzFjMzJiZSIsImlzQWRtaW4iOnRydWUsImlhdCI6MTc2MDY5Njk0MywiZXhwIjoxNzYwNzgzMzQzfQ.e0rHCqTil9PzfV9-1let0fUbGLtmJ7H3bFLho-DgfwA"
             },
          }
        );
        //console.log(res);
        setLists(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.log(err);
      }
    };
    getRandomLists();
  }, [type, genre]);
  return (
    <div className="home">
      <Navbar />
      <Featured type={type} />
        {lists.map((list) => (
          <List key={list._id} list={list} />
        ))}
    </div>
  )
}

export default Home