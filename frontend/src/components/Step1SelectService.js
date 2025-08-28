import React, { useEffect, useState } from 'react';
import { getServices } from '../services/api';

export default function Step1SelectService({ nextStep, setService }) {
  const [services, setServicesList] = useState([]);

  useEffect(() => { getServices().then(res => setServicesList(res.data)); }, []);

  return (
    <div>
      <h2>Select a Service</h2>
      <ul>
        {services.map(s => (
          <li key={s.id}>
            <button onClick={() => { setService(s); nextStep(); }}>
              {s.name} - £{s.price}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}