import React from 'react';

function Card({ title, description, image, action }) {
  return (
    <div className="card" style={{ width: '18rem' }}>
      {image && <img src={image} className="card-img-top" alt={title} />}
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{description}</p>
        {action && (
          <button className="btn btn-primary" onClick={action.onClick}>
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}

export default Card;
