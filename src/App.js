import React, { useState } from 'react';
import './App.css';
import useFetchJobs from './useFetchJobs';
import { Container } from './react-bootstrap';
import Jobs from './Jobs';

function App() {
  //states
  const [params, setParams] = useState({})
  const [page, setPage] = useState(1)
  const {jobs, loading, error } = useFetchJobs();
  return (
    <Container>
      
      {loading && <h1> loading...</h1>}
      {error && <h1>Error. Try refreshing</h1>}
      {jobs.map(job => {
        return <Jobs key={jobs.id} job = {job}/>
      })}
    </Container>
    
  );
}

export default App;
