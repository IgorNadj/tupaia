/*
 * Tupaia
 *  Copyright (c) 2017 - 2023 Beyond Essential Systems Pty Ltd
 */
import React from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import Typography from '@material-ui/core/Typography';
import { useRegister } from '../../api/mutations';
import { SignupComplete } from './SignUpComplete';
import { SubmitHandler } from 'react-hook-form';
import { TextField, AuthModalBody, AuthModalButton } from '../../components';
import { FORM_FIELD_VALIDATION } from '../../constants';
import { Checkbox } from '@tupaia/ui-components';
import { RouterLink } from '../../components/RouterButton';
import { MODAL_ROUTES } from '../../constants';

const ModalBody = styled(AuthModalBody)`
  width: 53rem;
`;

const StyledForm = styled.form`
  margin-top: 1rem;
  width: 42rem;
  max-width: 100%;

  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm}px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 2rem;
    row-gap: 0;
  }
`;

const StyledCheckbox = styled(Checkbox)`
  display: flex;
`;

const LinkText = styled(Typography)`
  font-weight: 400;
  font-size: 0.6875rem;
  line-height: 1.4;
  color: ${props => props.theme.palette.common.white};

  a {
    color: ${props => props.theme.palette.common.white};
  }

  ${AuthModalButton} + & {
    margin-top: 1.3rem;
  }
`;

const FullWidthColumn = styled.div`
  grid-column: 1/-1;
`;

export const Register = () => {
  const { mutate: onSubmit, isLoading, isSuccess, isError, error } = useRegister();
  const { errors, handleSubmit, getValues, register } = useForm();

  return (
    <ModalBody
      title="Register"
      subtitle={!isSuccess ? 'Enter your details below to create an account' : undefined}
    >
      {isSuccess ? (
        <SignupComplete />
      ) : (
        <>
          {isError && <Typography color="error">{error.message}</Typography>}
          <StyledForm onSubmit={handleSubmit(onSubmit as SubmitHandler<any>)} noValidate>
            <TextField
              name="firstName"
              label="First name *"
              error={!!errors?.firstName}
              helperText={errors?.firstName && errors?.firstName.message}
              inputRef={register({
                required: 'Required',
              })}
            />
            <TextField
              name="lastName"
              label="Last name *"
              error={!!errors?.lastName}
              helperText={errors?.lastName && errors?.lastName.message}
              inputRef={register({
                required: 'Required',
              })}
            />
            <TextField
              name="emailAddress"
              type="email"
              label="Email *"
              error={!!errors?.emailAddress}
              helperText={errors?.emailAddress && errors?.emailAddress.message}
              inputRef={register({
                ...FORM_FIELD_VALIDATION.EMAIL,
              })}
            />
            <TextField
              name="contactNumber"
              label="Contact number (optional)"
              error={!!errors?.contactNumber}
              helperText={errors?.contactNumber && errors?.contactNumber.message}
              inputRef={register()}
            />
            <TextField
              name="password"
              label="Password *"
              type="password"
              error={!!errors?.password}
              helperText={errors?.password && errors?.password.message}
              inputRef={register({
                ...FORM_FIELD_VALIDATION.PASSWORD,
              })}
            />
            <TextField
              name="passwordConfirm"
              label="Confirm password *"
              type="password"
              error={!!errors?.passwordConfirm}
              helperText={errors?.passwordConfirm && errors?.passwordConfirm.message}
              inputRef={register({
                validate: value => value === getValues('password') || 'Passwords do not match.',
                ...FORM_FIELD_VALIDATION.PASSWORD,
              })}
            />
            <TextField
              name="employer"
              label="Employer *"
              error={!!errors?.employer}
              helperText={errors?.employer && errors?.employer.message}
              inputRef={register({
                required: 'Required',
              })}
            />
            <TextField
              name="position"
              label="Position *"
              error={!!errors?.position}
              helperText={errors?.position && errors?.position.message}
              inputRef={register({
                required: 'Required',
              })}
            />
            <StyledCheckbox
              name="hasAgreed"
              color="primary"
              label="I agree to the terms and conditions"
              error={!!errors.hasAgreed}
              helperText={errors?.hasAgreed?.message}
              inputRef={register({
                required: 'Required',
              })}
            />
            <FullWidthColumn>
              <AuthModalButton type="submit" isLoading={isLoading}>
                Register account
              </AuthModalButton>
              <LinkText align="center">
                Already have an account?{' '}
                <RouterLink to={MODAL_ROUTES.LOGIN}>Log in here</RouterLink>
              </LinkText>
            </FullWidthColumn>
          </StyledForm>
        </>
      )}
    </ModalBody>
  );
};
