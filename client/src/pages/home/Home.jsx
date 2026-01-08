import './Home.scss';
import Navbar from '../../components/navbar/Navbar';
import Featured from '../../components/featured/Featured';
import List from '../../components/list/List';
import { useEffect, useState } from 'react';
import api from "../../api/axios";

const Home = ({ type }) => {
  const [lists, setLists] = useState([]);
  const [genre, setGenre] = useState(null);

useEffect(() => {
    const getRandomLists = async () => {
      try {
        const res = await api.get(
          `/lists${type ? "?type=" + type : ""}${genre ? "&genre=" + genre : ""}`
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
      <Featured type={type} setGenre={setGenre} />
        {lists.map((list) => (
          <List key={list._id} list={list} />
        ))}
    </div>
  )
}

export default Home