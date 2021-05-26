/*
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { ConfirmModal } from './ConfirmModal';
import { useDeleteAlert } from '../../api/queries';
import { SuccessModal } from './SuccessModal';

const STATUS = {
  INITIAL: 'initial',
  LOADING: 'loading',
  ERROR: 'error',
  SUCCESS: 'success',
};

export const DeleteAlertModal = ({ isOpen, handleClose, alertId }) => {
  const [status, setStatus] = useState(STATUS.INITIAL);
  const [deleteAlert, { error }] = useDeleteAlert(alertId);

  const handleDelete = useCallback(async () => {
    setStatus(STATUS.LOADING);
    try {
      await deleteAlert();
    } catch (e) {
      setStatus(STATUS.ERROR);
      return;
    }
    setStatus(STATUS.SUCCESS);
  }, [deleteAlert]);

  const onClose = useCallback(async () => {
    setStatus(STATUS.INITIAL);
    handleClose();
  }, [setStatus, handleClose]);

  if (status === STATUS.SUCCESS) {
    return (
      <SuccessModal
        isOpen={isOpen}
        title="Delete Alert"
        mainText="Alert successfully deleted"
        handleClose={onClose}
      />
    );
  }

  return (
    <ConfirmModal
      handleClose={onClose}
      isOpen={isOpen}
      isLoading={status === STATUS.LOADING}
      title="Delete Alert"
      mainText="Are you sure you want to delete this alert?"
      error={error && error.message}
      actionText="Delete"
      loadingText="Deleting"
      handleAction={handleDelete}
    />
  );
};

DeleteAlertModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  alertId: PropTypes.string.isRequired,
};
