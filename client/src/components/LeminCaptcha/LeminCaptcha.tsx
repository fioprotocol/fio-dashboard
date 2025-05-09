import React from 'react';

import { LeminCroppedCaptchaContainer } from '@leminnow/react-lemin-cropped-captcha';

import ModalComponent from '../Modal/Modal';
import SubmitButton from '../common/SubmitButton/SubmitButton';

import classes from './LeminCaptcha.module.scss';

import { VerifyParams } from '../../types';

export type LeminCaptchaProps = {
  captchaId: string;
  loading: boolean;
  onClose: () => void;
  setCaptchaResult: (params: VerifyParams) => void;
};

const LeminCaptcha: React.FC<LeminCaptchaProps> = ({
  captchaId,
  loading,
  onClose,
  setCaptchaResult,
}) => {
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const formValues = Object.fromEntries(formData.entries());

    const challenge_id = formValues['lemin_challenge_id'] as string;
    const answer = formValues['lemin_answer'] as string;

    setCaptchaResult({ challenge_id, answer });
  };

  return (
    <ModalComponent show={!!captchaId} onClose={onClose} closeButton>
      <form onSubmit={onSubmit} className={classes.form}>
        <LeminCroppedCaptchaContainer
          containerId="lemin-cropped-captcha"
          captchaId={captchaId}
        />
        <SubmitButton
          text="Verify The Captcha and Continue"
          withTopMargin
          loading={loading}
        />
      </form>
    </ModalComponent>
  );
};

export default LeminCaptcha;
