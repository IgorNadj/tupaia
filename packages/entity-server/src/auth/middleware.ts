/**
 * Tupaia
 * Copyright (c) 2017 - 2021 Beyond Essential Systems Pty Ltd
 */

import { Request, NextFunction, Response } from 'express';
import { UnauthenticatedError } from '@tupaia/utils';
import { AccessPolicy } from '@tupaia/access-policy';
import { getUserIDFromToken, getUserAndPassFromBasicAuth } from '@tupaia/auth';

const authenticateUser = async (req: Request) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new UnauthenticatedError(
      'No authorization header provided - must be Basic or Bearer Auth Header',
    );
  }

  if (authHeader.startsWith('Bearer')) {
    return authenticateBearerAuthHeader(authHeader);
  }

  if (authHeader.startsWith('Basic')) {
    return authenticateBasicAuthHeader(req, authHeader);
  }

  throw new UnauthenticatedError('Could not authenticate with the provided token');
};

const authenticateBearerAuthHeader = async (authHeader: string) => {
  // Use the user account provided in the auth header if present
  const tokenUserID = getUserIDFromToken(authHeader);
  if (tokenUserID) {
    return tokenUserID;
  }

  throw new UnauthenticatedError('Could not authenticate with the provided access token');
};

const authenticateBasicAuthHeader = async (req: Request, authHeader: string) => {
  const { username, password } = getUserAndPassFromBasicAuth(authHeader);
  const { authenticator } = req;
  const { user } = await authenticator.authenticatePassword({
    emailAddress: username,
    password,
    deviceName: 'entities',
  });
  if (user) {
    return user.id;
  }

  throw new UnauthenticatedError('Could not find user');
};

export const authenticationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = await authenticateUser(req);
    if (userId) {
      const { authenticator } = req;
      const accessPolicy = await authenticator.getAccessPolicyForUser(userId);
      req.accessPolicy = new AccessPolicy(accessPolicy);
    }
    next();
  } catch (error) {
    next(error);
  }
};