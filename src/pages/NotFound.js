import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <section className='section'>
      <h2>Error:404</h2>
      <p>page not found</p>
      <Link to="/Home">back home</Link>
    </section>
  );
};
export default NotFound;