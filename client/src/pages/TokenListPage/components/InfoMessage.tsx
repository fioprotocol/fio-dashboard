import React from 'react';

const InfoMessage: React.FC = () => {
  return (
    <>
      <p className="mt-2">
        When you link your FIO Handle to a public address for a specific token
        type, you allow others to easily send you that token to your FIO Crypto
        Handle without worrying about public addresses.
      </p>
      <p>
        By default your FIO Handle is not linked to any public address and can
        only be used to send and receive FIO Requests. You can change the
        mapping at any time. Just remember, once you link it anyone can see your
        public address if they know your FIO Handle.
      </p>
    </>
  );
};

export default InfoMessage;
