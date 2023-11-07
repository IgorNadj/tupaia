/**
 * Tupaia MediTrak
 * Copyright (c) 2017 Beyond Essential Systems Pty Ltd
 */
import { respond, DatabaseError, FormValidationError } from '@tupaia/utils';
import { sendEmail } from '@tupaia/server-utils';
import { allowNoPermissions } from '../permissions';

export const requestPasswordReset = async (req, res) => {
  const { body, models } = req;
  const { emailAddress, resetPasswordUrl } = body;

  await req.assertPermissions(allowNoPermissions);

  if (!emailAddress) {
    throw new FormValidationError('No email address provided', ['emailAddress']);
  }

  const user = await models.user.findOne({
    email: emailAddress,
  });

  if (!user) {
    throw new DatabaseError(`No account with the email ${emailAddress} found`);
  }

  const { token } = await models.oneTimeLogin.create({
    user_id: user.id,
  });

  // allow overriding the default url for the front end, so that this route can be used from Tupaia and also datatrak
  const passwordResetUrl = `${
    resetPasswordUrl || process.env.TUPAIA_FRONT_END_URL
  }/reset-password?passwordResetToken={token}`;
  const resetUrl = passwordResetUrl.replace('{token}', token);
  const emailText = `Dear ${user.fullName},

You are receiving this email because someone requested a password reset for
this user account on Tupaia.org. To reset your password follow the link below.

${resetUrl}

If you believe this email was sent to you in error, please contact us immediately at
admin@tupaia.org.`;

  sendEmail(user.email, { subject: 'Password reset on Tupaia.org', text: emailText });

  respond(res, {
    success: true,
  });
};
