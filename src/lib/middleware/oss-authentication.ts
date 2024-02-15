import { Application } from 'express';
import authorizationMiddleware from './authorization-middleware';
import { LogProvider } from '../logger';
import { ApiTokenType } from '../types/models/api-token';
import { ApiUser, IApiRequest } from '../server-impl';

function ossAuthHook(
    app: Application,
    getLogger: LogProvider,
    baseUriPath: string,
): void {
    app.use(`${baseUriPath}/api/client`, (req: IApiRequest, res, next) => {
        if (!req.user) {
            req.user = new ApiUser({
                tokenName: 'unauthed-default-client',
                permissions: [],
                environment: 'default',
                type: ApiTokenType.CLIENT,
                project: '*',
                secret: 'a',
            });
        }
        next();
    });

    app.use(
        `${baseUriPath}/api/admin`,
        authorizationMiddleware(getLogger, baseUriPath),
    );
    app.use(
        `${baseUriPath}/logout`,
        authorizationMiddleware(getLogger, baseUriPath),
    );
}
export default ossAuthHook;
