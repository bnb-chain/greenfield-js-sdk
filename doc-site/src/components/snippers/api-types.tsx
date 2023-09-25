import React from 'react';
type API_TYPE = 'Tx' | 'Query' | 'Storage Provider';

const ApiTypes = (props: { type: API_TYPE }) => {
  const { type } = props;
  return (
    <span
      style={{
        backgroundColor: '#25c2a0',
        borderRadius: '5px',
        color: '#FFF',
        fontSize: 14,
        padding: 2,
      }}
    >
      {type}
    </span>
  );
};

export default ApiTypes;
