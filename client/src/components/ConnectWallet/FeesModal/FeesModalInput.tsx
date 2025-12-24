import React, { useEffect, useState } from 'react';
import { DebounceInput } from 'react-debounce-input';
import { FieldRenderProps } from 'react-final-form';
import classnames from 'classnames';
import { Button } from 'react-bootstrap';
import { ethers } from 'ethers';

import { ErrorBadge } from '../../Input/ErrorBadge';
import Modal from '../../Modal/Modal';
import { LoadingIcon } from '../../Input/StaticInputParts';
import SubmitButton from '../../common/SubmitButton/SubmitButton';
import TabsContainer from '../../Tabs/TabsContainer';
import Tabs from '../../Tabs/Tabs';
import InfoBadge from '../../InfoBadge/InfoBadge';
import { ClearButton } from '../../Input/InputActionButtons';
import Loader from '../../Loader/Loader';

import useLoadFeePriceSuggestions from '../../../hooks/externalWalletsConnection/useLoadFeesSuggestions';
import MathOp from '../../../util/math';

import { WRAP_TYPE } from '../../../constants/wrap';

import classes from './FeesModalInput.module.scss';

export type FeePriceOptionsList = Array<FeePriceOptionItem>;

export type FeePriceOptionItem = {
  name: string;
  gasPrice: string;
  gasLimit?: string;
};

export const DEFAULT_GAS_LIMIT = 60000;
const DEFAULT_FIXED_AMOUNT = 9;
const DEFAULT_EXTRA_FIXED_AMOUNT = 2;

export const calculateGasFee = (
  gasPrice: string | number, // wei
  gasLimit: number = DEFAULT_GAS_LIMIT,
): string => {
  const gasFee =
    parseFloat(ethers.utils.formatEther(gasPrice).toString()) * gasLimit;
  const decimalsPart = gasFee.toString().split('.')[1];
  const eDecimalsPart = Number(gasFee.toString()?.split('e-')?.[1]);
  let significantDigits = DEFAULT_FIXED_AMOUNT;

  if (decimalsPart && !eDecimalsPart) {
    for (let i = 0; i < decimalsPart.length; i++) {
      if (decimalsPart[i] !== '0') {
        if (i <= DEFAULT_FIXED_AMOUNT) break;
        significantDigits = i + DEFAULT_EXTRA_FIXED_AMOUNT;
        break;
      }
    }
  }

  if (eDecimalsPart) {
    significantDigits = eDecimalsPart + DEFAULT_EXTRA_FIXED_AMOUNT;
  }

  return gasFee
    .toFixed(significantDigits)
    .replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1');
};

type Props = {
  chainCode?: string;
  gasPrice?: string;
  gasLimit?: string;
  name?: string;
  onClose?: (isOpen: boolean) => void;
  hideError?: boolean;
  loading?: boolean;
  showErrorBorder?: boolean;
  input: {
    'data-clear'?: boolean;
    value: FeePriceOptionItem;
  };
  modalTitle?: string;
  modalSubTitle?: string;
  wrapType?: keyof typeof WRAP_TYPE;
  handleConfirmValidate?: (
    val?: FeePriceOptionItem,
  ) => Promise<{
    succeeded: boolean;
    message: string;
  }>;
};

type ModalProps = {
  show?: boolean;
  subTitle?: string;
  title?: string;
  handleClose?: () => void;
  onHide?: () => void;
};

type TabProps = FieldRenderProps<Props> & {
  isActive: boolean;
  basicOptions: FeePriceOptionsList;
  valueTitle: string;
};

const CustomFeeInputsTab = ({
  input,
  hasError,
  isLoading,
  data,
  confirmError,
  errorType,
  errorColor,
  isActive,
  basicOptions,
  handleChangeModalValue,
  valueTitle,
  isNFT,
}: TabProps): React.ReactElement => {
  const advancedTabName = TabsList[1].title;

  const [isGasLimitFieldDirty, setIsGasLimitFieldDirty] = useState(false);
  const [gasLimit, setGasLimit] = useState(
    input.value?.name === advancedTabName && input.value?.gasLimit
      ? input.value.gasLimit
      : '',
  );

  // Gwei
  const [gasPrice, setGasPrice] = useState(
    input.value?.name === advancedTabName && input.value?.gasPrice
      ? +ethers.utils.formatUnits(input.value.gasPrice, 'gwei') + ''
      : '',
  );

  useEffect(() => {
    if (isActive && (gasLimit?.length || gasPrice?.length)) {
      handleChangeModalValue({
        name: advancedTabName,
        gasPrice: gasPrice?.length
          ? ethers.utils.parseUnits(gasPrice, 'gwei').toString()
          : null,
        gasLimit: gasLimit?.length ? gasLimit : null,
      });
    } else handleChangeModalValue(null);
  }, [gasLimit, gasPrice, isActive, handleChangeModalValue, advancedTabName]);

  return (
    <div>
      <div className={classnames(classes.regInputWrapper, 'mb-0')}>
        <div className={classes.suggestedFee}>
          <div>Current base fee</div>
          <div>
            {basicOptions?.length === 3
              ? `${calculateGasFee(
                  basicOptions.find(o => o.name === 'Medium')?.gasPrice,
                )} ${valueTitle}`
              : ''}
          </div>
        </div>
        <InfoBadge
          className="my-3"
          show={true}
          type="info"
          title="Advanced Fee"
          message="Using a low fee may increase the amount of time it takes for your transaction to confirm. In rare instances your transaction can fail."
        />

        <p className={classnames(classes.labelTitle)}>Gas Limit</p>
        <div className={classnames(classes.inputGroup)}>
          <div
            className={classnames(
              classes.regInput,
              classes.bw,
              hasError && classes.error,
            )}
          >
            <DebounceInput
              debounceTimeout={0}
              onChange={e => {
                const currentValue = e.target.value || '';
                setGasLimit(currentValue);
              }}
              onBlur={() => setIsGasLimitFieldDirty(true)}
              value={gasLimit}
              type="number"
              placeholder={`Enter gas limit, default value: ${DEFAULT_GAS_LIMIT}`}
            />
          </div>

          <ClearButton
            isVisible={gasLimit.length > 0 && !isLoading}
            onClear={() => setGasLimit('')}
            isBW={true}
          />
          <LoadingIcon isVisible={isLoading} />
        </div>
        <p
          className={classnames(
            classes.warningMessage,
            'mb-2',
            isGasLimitFieldDirty &&
              gasLimit?.length &&
              new MathOp(gasLimit).lt(DEFAULT_GAS_LIMIT)
              ? ''
              : classes.hidden,
          )}
        >
          This fee may cause the transaction to fail. Your funds will be
          unrecoverable.
        </p>

        <p className={classes.labelTitle}>Gas Price</p>
        <div className={classnames(classes.inputGroup)}>
          <div
            className={classnames(
              classes.regInput,
              classes.bw,
              hasError && classes.error,
              'mb-3',
            )}
          >
            <DebounceInput
              debounceTimeout={isNFT ? 0 : 600}
              onChange={e => {
                const currentValue = e.target.value || '';
                setGasPrice(currentValue);
              }}
              value={gasPrice}
              type="number"
              placeholder="Enter gas price"
            />
            <div>GWEI</div>
          </div>
          <LoadingIcon isVisible={isLoading} />
        </div>
        <ErrorBadge
          error={confirmError}
          data={data}
          hasError={hasError}
          type={errorType}
          color={errorColor}
        />
      </div>
    </div>
  );
};

const TabsList = [
  {
    eventKey: 'basic',
    title: 'Basic',
    renderTab: ({
      basicOptions,
      input,
      isSuggestionsLoading,
      handleChangeModalValue,
      modalInputValue,
      valueTitle,
    }: TabProps) => (
      <>
        {basicOptions?.length ? (
          <div className={classes.optionsList}>
            {basicOptions.map(o => (
              <div
                className={classes.option}
                key={'basic_' + o.name}
                onClick={() => handleChangeModalValue(o)}
              >
                <div className={classes.suggestedOption}>
                  <input
                    className="mr-3"
                    type="radio"
                    readOnly
                    value={o.name}
                    name={o.name}
                    checked={
                      modalInputValue
                        ? modalInputValue.name === o.name
                        : input.value.name === o.name
                    }
                  />
                  {o.name}
                </div>
                <div className={classes.suggestedOptionValue}>
                  {calculateGasFee(o.gasPrice)} {valueTitle}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {isSuggestionsLoading ? (
              <Loader className="w-100 d-flex text-center mb-3" />
            ) : (
              <div className={classes.notFound}>No Data Loaded</div>
            )}
          </div>
        )}
      </>
    ),
  },
  {
    eventKey: 'advanced',
    title: 'Advanced',
    renderTab: CustomFeeInputsTab,
  },
];

const SelectModal: React.FC<Props &
  FieldRenderProps<Props> &
  ModalProps> = props => {
  const {
    chainCode,
    input,
    meta,
    handleConfirmValidate,
    loading,
    errorType = '',
    errorColor = '',
    title = 'Fees',
    subTitle = 'Manually set fees by selecting one of the basics options or for a more advanced option, set your own.',
    showErrorBorder,
    show = false,
    wrapType,
    onHide,
    valueTitle,
  } = props;

  const { value, onChange } = input;
  const { data } = meta;
  const advancedTabName = TabsList[1].title;

  const {
    feePriceOptionsList: options,
    isLoading: isSuggestionsLoading,
  } = useLoadFeePriceSuggestions({
    startLoad: show,
    chainCode,
    type: wrapType,
  });

  const [inputValue, setInputValue] = useState<FeePriceOptionItem>(value);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [isDirtyInputState, setIsDirtyInputState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // update value in form input, when basic options refreshed
  useEffect(() => {
    const basicOption =
      options?.length && value?.name && value.name !== advancedTabName
        ? options.filter(o => o.name === value.name)[0]
        : null;
    if (basicOption && basicOption.gasPrice !== value.gasPrice) {
      onChange(basicOption);
    }
  }, [advancedTabName, onChange, options, value]);

  // initialize inputValue in case, when modal was closed and opened again
  useEffect(() => {
    if (!!show && !inputValue && value) setInputValue(value);
  }, [inputValue, show, value]);

  const handleClose = () => {
    if (isLoading) return;

    onHide && onHide();
    setConfirmError(null);
    setIsDirtyInputState(false);
  };

  const handleConfirm = async () => {
    if (handleConfirmValidate) {
      setIsLoading(true);
      const validationResult = await handleConfirmValidate(inputValue);
      if (validationResult.succeeded) {
        onChange(inputValue);
        handleClose();
      } else {
        setConfirmError(validationResult.message);
      }
      setIsLoading(false);
    } else {
      onChange(inputValue);
      handleClose();
    }
  };

  const hasError = !!(confirmError && isDirtyInputState);

  return (
    <Modal
      show={show}
      closeButton={true}
      onClose={handleClose}
      isSimple={true}
      isWide={true}
      hasDefaultCloseColor={true}
    >
      <div className={classes.optionsContainer}>
        <h3 className={classes.title}>{title}</h3>
        <div className={classes.subtitle}>{subTitle}</div>
        <div className="mt-3">
          <TabsContainer
            defaultActiveKey={
              input.value?.name === advancedTabName
                ? TabsList[1].eventKey
                : TabsList[0].eventKey
            }
          >
            <Tabs
              list={TabsList}
              showTabBorder={true}
              tabProps={{
                input,
                basicOptions: options,
                hasError: hasError || showErrorBorder,
                errorColor,
                errorType,
                confirmError,
                data,
                handleChangeModalValue: setInputValue,
                modalInputValue: inputValue,
                isLoading: loading,
                isSuggestionsLoading,
                valueTitle,
                wrapType,
              }}
            />
          </TabsContainer>

          <div className="d-flex justify-content-center align-items-center mt-0 mb-4">
            <SubmitButton
              text="Confirm"
              onClick={handleConfirm}
              disabled={
                !inputValue ||
                !!confirmError ||
                isLoading ||
                (inputValue.name === advancedTabName &&
                  !inputValue.gasLimit &&
                  !inputValue.gasPrice)
              }
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

const FeesModalInput: React.FC<Props & FieldRenderProps<Props>> = props => {
  const {
    chainCode,
    input,
    meta,
    hideError,
    loading,
    errorType = '',
    errorColor = '',
    prefixLabel = 'Fees',
    valueTitle,
    showErrorBorder,
    wrapType,
    handleConfirmValidate,
  } = props;
  const {
    error,
    data,
    touched,
    active,
    modified,
    submitError,
    modifiedSinceLastSubmit,
    submitSucceeded,
  } = meta;

  const { value, onChange } = input;

  const {
    feePriceOptionsList: options,
    isLoading: isSuggestionsLoading,
  } = useLoadFeePriceSuggestions({
    startLoad: true,
    chainCode,
    type: wrapType,
  });

  const mediumFees = options.find(o => o.name === 'Medium');

  useEffect(() => {
    if (!isSuggestionsLoading && mediumFees?.name) {
      onChange(mediumFees);
    }
  }, [isSuggestionsLoading, mediumFees, onChange]);

  const [showModal, toggleShowModal] = useState(false);

  const handleCloseModal = () => {
    toggleShowModal(false);
  };

  const handleOpenModal = () => {
    toggleShowModal(true);
  };

  const hasError =
    !hideError &&
    !data?.hideError &&
    (((error || data?.error) &&
      (touched || modified || submitSucceeded || !!value) &&
      !active) ||
      (submitError && !modifiedSinceLastSubmit));

  return (
    <div className={classes.container}>
      <div className={classnames(classes.inputGroup)}>
        <div
          className={classnames(
            classes.regInput,
            (hasError || showErrorBorder) && !showModal && classes.error,
          )}
        >
          <b>{prefixLabel}</b>
          <span className="flex-grow-1" />
          <span>
            {(input.value.gasPrice
              ? calculateGasFee(
                  input.value.gasPrice,
                  input.value.gasLimit ? +input.value.gasLimit : undefined,
                )
              : 0) +
              ' ' +
              valueTitle}
          </span>
          {!loading && (
            <div className={classes.editButtonContainer}>
              <Button onClick={handleOpenModal}>Edit</Button>
            </div>
          )}
        </div>
        <LoadingIcon isVisible={loading} />
      </div>
      <ErrorBadge
        error={error}
        data={data}
        hasError={!showModal && hasError}
        type={errorType}
        color={errorColor}
        submitError={submitError}
      />

      <SelectModal
        {...props}
        show={showModal}
        onHide={handleCloseModal}
        handleConfirmValidate={handleConfirmValidate}
      />
    </div>
  );
};

export default FeesModalInput;
