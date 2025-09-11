import { Button } from 'react-bootstrap';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { Field, Form } from 'react-final-form';

import Modal from '../../../../components/Modal/Modal';

import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';
import Input, { INPUT_UI_STYLES } from '../../../../components/Input/Input';
import InfoBadge from '../../../../components/Badges/InfoBadge/InfoBadge';
import Loader from '../../../../components/Loader/Loader';
import { COLOR_TYPE } from '../../../../components/Input/ErrorBadge';
import DangerModal from '../../../../components/Modal/DangerModal';

import { useContext } from './BlockedApiUrlsComponentContext';

import { formValidation } from './validation';

import classes from './BlockedApiUrlsComponent.module.scss';

export type BlockedApiUrlsComponentProps = {
  blockedApiUrlsList: string[];
  setBlockedApiUrlsList: (blockedApiUrlsList: string[]) => void;
};

export const BlockedApiUrlsComponent = ({
  blockedApiUrlsList,
  setBlockedApiUrlsList,
}: BlockedApiUrlsComponentProps) => {
  const {
    listLoading,
    submitLoading,
    showModal,
    showDangerModal,
    itemToDelete,
    closeDangerModal,
    openModal,
    onDelete,
    onDeleteActionClick,
    closeModal,
    onSubmit,
  } = useContext({ blockedApiUrlsList, setBlockedApiUrlsList });

  return (
    <div className={`${classes.container} ml-4 mt-4`}>
      <h4>Blocked Api URLs</h4>
      <p>
        Blocked Api URLs that should not be used in the app by different
        reasons.
      </p>
      <Button onClick={openModal}>
        <AddBoxIcon className="mr-2" /> Add Url to Block
      </Button>
      <div className="mt-4">
        {listLoading ? (
          <Loader />
        ) : blockedApiUrlsList?.length ? (
          blockedApiUrlsList.map((url, index) => (
            <div
              key={url}
              className={`mt-2 p-2 border rounded-lg d-flex align-items-center justify-content-between bg-light ${
                index % 2 === 0 ? 'bg-light' : 'bg-white'
              }`}
            >
              {index + 1}. {url}
              <Button
                variant="danger"
                onClick={() => onDeleteActionClick(url)}
                className="ml-4"
              >
                Delete
              </Button>
            </div>
          ))
        ) : (
          <InfoBadge
            title="No blocked urls"
            message="You have no blocked urls"
          />
        )}
      </div>

      <Modal
        show={showModal}
        closeButton
        onClose={closeModal}
        isSimple
        isWide
        hasDefaultCloseColor
      >
        <div className="w-100">
          <h3>Add Url to Filter</h3>
          <Form onSubmit={onSubmit} validate={formValidation.validateForm}>
            {({
              handleSubmit,
              hasValidationErrors,
              pristine,
              submitting,
              validating,
            }) => (
              <form
                onSubmit={handleSubmit}
                className="d-flex flex-column w-100"
              >
                <Field
                  name="url"
                  type="text"
                  component={Input}
                  uiType={INPUT_UI_STYLES.BLACK_WHITE}
                  errorColor={COLOR_TYPE.WARN}
                  placeholder="Enter Url"
                  loading={validating}
                  disabled={submitting || submitLoading}
                />
                <SubmitButton
                  text={submitLoading ? 'Adding' : 'Add URL'}
                  disabled={
                    submitLoading ||
                    hasValidationErrors ||
                    validating ||
                    submitting ||
                    pristine
                  }
                  loading={submitLoading || submitting}
                />
              </form>
            )}
          </Form>
        </div>
      </Modal>

      <DangerModal
        show={showDangerModal}
        onClose={closeDangerModal}
        title="Delete Url from Blocked"
        subtitle={`You are deleting ${itemToDelete} from blocked`}
        buttonText="Delete"
        onActionButtonClick={onDelete}
        showCancel
      />
    </div>
  );
};
