import React, { useEffect, useState } from 'react';
import '../Styles/Cotizaciones.css';


const ContadorCircular = ({ duracion = 35 }) => {
  const [tiempoRestante, setTiempoRestante] = useState(duracion);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setTiempoRestante((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(intervalo);
  }, []);

  const porcentaje = (tiempoRestante / duracion) * 100;

  return (
    <div className="contador-circular-container">
      <svg className="reloj" viewBox="0 0 36 36">
        <path
          className="fondo"
          d="M18 2.0845
             a 15.9155 15.9155 0 0 1 0 31.831
             a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          className="barra"
          strokeDasharray={`${porcentaje}, 100`}
          d="M18 2.0845
             a 15.9155 15.9155 0 0 1 0 31.831
             a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <text x="18" y="20.35" className="tiempo">{tiempoRestante}s</text>
      </svg>
      <p className="texto-enviando">Enviando cotización...</p>
    </div>
  );
};

export default ContadorCircular;
