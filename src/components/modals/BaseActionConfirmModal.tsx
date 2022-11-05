import React, {FC, ReactNode, useContext, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {Color} from '../../colors';
import {ModalContext} from '../../context/ModalProvider';
import ModalBase, {ModalAction} from './ModalBase';

export interface BaseActionConfirmModalProps {
  title: string;
  onConfirm?: () => any;
  onCancel?: () => any;
  icon?: string;
  accentColor?: Color;
  customLabels?: {
    cancel: string;
    confirm: string;
  };
  children: ReactNode;
}

const BaseActionConfirmModal: FC<BaseActionConfirmModalProps> = ({
  title,
  children,
  onConfirm = () => {},
  onCancel = () => {},
  icon,
  accentColor,
  customLabels,
}) => {
  const {hideModal} = useContext(ModalContext);
  const {t} = useTranslation();

  const actions = useMemo<ModalAction[]>(() => {
    return [
      {
        type: 'secondary',
        label: customLabels ? customLabels.cancel : t('cancel'),
        value: 'cancel',
        onSelect: async () => {
          onCancel();
          hideModal();
        },
        dismiss: true,
      },
      {
        type: 'colored',
        label: customLabels ? customLabels.confirm : t('confirm'),
        value: 'confirm',
        onSelect: async () => {
          onConfirm();
          hideModal();
        },
        dismiss: true,
      },
    ];
  }, [hideModal, onCancel, onConfirm, t, customLabels]);

  return (
    <ModalBase
      icon={icon}
      accentColor={accentColor}
      title={title}
      actions={actions}>
      {children}
    </ModalBase>
  );
};

export default BaseActionConfirmModal;
