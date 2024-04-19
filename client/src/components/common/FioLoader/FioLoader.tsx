import React from 'react';

import logoAnimation from './logo-animation.json';

type Props = {
  wrap?: boolean;
  wrapCenter?: boolean;
};

const FioLoader: React.FC<Props> = props => {
  const renderLoader = () => (
    <lottie-player
      id="logo-loading"
      autoplay
      loop
      mode="normal"
      src={JSON.stringify(logoAnimation)}
    />
  );

  if (props.wrap || props.wrapCenter) {
    return (
      <div
        className="d-flex justify-content-center align-items-center align-self-center"
        style={
          props.wrapCenter
            ? { width: '100%', height: '100%' }
            : { width: '70px', height: '70px' }
        }
      >
        {renderLoader()}
      </div>
    );
  }

  return <div style={{ width: '70px', height: '70px' }}>{renderLoader()}</div>;
};

export default FioLoader;
