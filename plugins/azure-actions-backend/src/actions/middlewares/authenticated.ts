import { AuthenticationError } from '@backstage/errors';
import { PluginEnvironment } from '../types';
import { RequestHandler } from 'express';
import { BackstageIdentityResponse } from '@backstage/plugin-auth-node';

interface LocalsMiddleware {
  userIdentity: BackstageIdentityResponse;
}

export const handleUserIdentity = ({
  identity,
}: Pick<PluginEnvironment, 'identity'>): RequestHandler<
  any,
  any,
  any,
  any,
  LocalsMiddleware
> => {
  return async (_, res, next) => {
    const user = await identity.getIdentity({ request: _ });

    if (!user) {
      next(new AuthenticationError());
      return;
    }

    _.user = user;
    res.locals = { ...res.locals, userIdentity: user };

    next();
    return;
  };
};
