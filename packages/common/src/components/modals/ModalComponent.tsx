import React, {useContext} from 'react';
import {ModalContext} from '../../context/ModalProvider';

const ModalComponent = () => {
  const {modal} = useContext(ModalContext);
  return <>{modal}</>;
};

export default ModalComponent;
