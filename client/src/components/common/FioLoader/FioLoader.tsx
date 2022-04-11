import React from 'react';

import logoAnimation from '../../CreateAccountForm/logo-animation.json';

type Props = {
  wrap?: boolean;
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

  if (props.wrap) {
    return (
      <div className="d-flex justify-content-center align-items-center w-100 flex-grow-1">
        {renderLoader()}
      </div>
    );
  }

  return renderLoader();
};

export default FioLoader;
