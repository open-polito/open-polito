import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';

export interface ModalContextProps {
  modal: ReactNode;
  visible: boolean;
  setModal: (modal: ReactNode) => any;
  showModal: () => any;
  hideModal: () => any;
}

export const ModalContext = createContext<ModalContextProps>({
  modal: null,
  visible: false,
  setModal: () => {},
  showModal: () => {},
  hideModal: () => {},
});

export const ModalProvivder = ({children}: {children: ReactNode}) => {
  const [modal, setModal] = useState<ReactNode>(null);
  const [visible, setVisible] = useState<boolean>(false);

  const showModal = useCallback(() => setVisible(true), []);
  const hideModal = useCallback(() => {
    setVisible(false);
    setTimeout(() => setModal(null), 300); // We give time for layout animations before deleting modal contents
  }, []);

  useEffect(() => {
    if (modal) {
      setVisible(true);
    }
  }, [modal]);

  return (
    <ModalContext.Provider
      value={{
        modal,
        visible,
        setModal,
        showModal,
        hideModal,
      }}>
      {children}
    </ModalContext.Provider>
  );
};
