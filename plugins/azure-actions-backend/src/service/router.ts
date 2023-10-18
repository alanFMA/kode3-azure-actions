import { errorHandler } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { PluginEnvironment } from '../actions/types';
import { BackstageConfigIntegrations } from '../actions/backstage-config';
import { azureAxiosInstance, AzureOrganizationService, AzurePipelineService, AzureRepoService, AzureVariableGroupService } from '../actions/azure-devops';
import { parseEntityRef } from '@backstage/catalog-model';
import { AzureEntitlementsService } from '../actions/azure-devops/domain/entitlements';
import { AzureServiceConnectionService } from '../actions/azure-devops/domain/service-connection';
import { handleUserIdentity } from '../actions/middlewares/authenticated';

export interface RouterOptions {
  logger: Logger;
}

export async function createRouter({
  logger,
  config,
  identity,
}: Pick<
  PluginEnvironment,
  'logger' | 'config' | 'identity'
>): Promise<express.Router> {
  const pat =
    config.get<BackstageConfigIntegrations>('integrations')?.azure?.[0]?.token;
  const defaultOrg =
    config.get<BackstageConfigIntegrations>('integrations')?.azure?.[0]
      ?.organization ?? '';
  const axiosService = azureAxiosInstance(pat || '');
  const orgService = new AzureOrganizationService(axiosService, defaultOrg);
  const entitlementsService = new AzureEntitlementsService(axiosService);
  const serviceConnectionService = new AzureServiceConnectionService(
    axiosService,
  );
  const repositoryService = new AzureRepoService(axiosService);
  const pipelineService = new AzurePipelineService(axiosService);
  const variableGroupsService = new AzureVariableGroupService(axiosService);

  const router = Router();
  router.use(express.json());

  router.get(
    '/organizations',
    handleUserIdentity({ identity }),
    async (_, res) => {
      logger.info(`${_.method} ${_.url}`);

      try {
        res.json(await orgService.list());
      } catch (error) {
        console.error(error);
        res.status(500).send(error);
      }
    },
  );
  router.get(
    '/projects/:organization',
    handleUserIdentity({ identity }),
    async (_, res) => {
      logger.info(`${_.method} ${_.url}`);
      const {
        params: { organization },
      } = _;
      const {
        locals: { userIdentity },
      } = res;

      const userEntity = parseEntityRef(userIdentity?.identity.userEntityRef, {
        defaultKind: 'z',
        defaultNamespace: 'z',
      });

      const entitlements = await entitlementsService.userEntitlements({
        organization,
        select: 'Projects',
        $filter: `name eq '${userEntity.name}'`,
      });
      try {
        res.json(
          entitlements.data.members[0].projectEntitlements.map(
            ({ projectRef: { id, name } }) => ({
              projectName: name,
              projectId: id,
            }),
          ),
        );
      } catch (error) {
        console.error(error);
        res.status(500).send(error);
      }
    },
  );

  router.get(
    [
      '/service?-connections/:organization/:project',
      '/service?-endpoints/:organization/:project',
    ],
    handleUserIdentity({ identity }),
    async (_, res) => {
      logger.info(`${_.method} ${_.url}`);
      const {
        params: { organization, project },
        query,
      } = _;

      const entitlements = await serviceConnectionService.list(
        { organization, project },
        query,
      );
      try {
        res.json(entitlements.data);
      } catch (error) {
        console.error(error);
        res.status(500).send(error);
      }
    },
  );

  router.get(
    '/repositories/:organization/:project',

    handleUserIdentity({ identity }),
    async (_, res) => {
      logger.info(`${_.method} ${_.url}`);
      const {
        params: { organization, project },
      } = _;

      const repositories = await repositoryService.list({
        organization,
        project,
      });
      try {
        res.json(repositories.data);
      } catch (error) {
        console.error(error);
        res.status(500).send(error);
      }
    },
  );

  router.get(
    '/pipelines/:organization/:project',

    handleUserIdentity({ identity }),
    async (_, res) => {
      logger.info(`${_.method} ${_.url}`);
      const {
        params: { organization, project },
      } = _;

      const pipelines = await pipelineService.list({ organization, project });
      try {
        res.json(pipelines.data);
      } catch (error) {
        console.error(error);
        res.status(500).send(error);
      }
    },
  );

  router.get('/variablegroups/:organization/:project',
    handleUserIdentity({ identity }),
    async (_, res) => {
      logger.info(`${_.method} ${_.url}`);
      const {
        params: { organization, project },
      } = _;

      const variableGroups = await variableGroupsService.list({
        organization,
        project,
      });
      try {
        res.json(variableGroups.data);
      } catch (error) {
        console.error(error);
        res.status(500).send(error);
      }
    },
  );

  // router.get(
  //   '/:organization/:project/:repository',
  //   async (_, res) => {
  //     logger.info(`${_.method} ${_.url}`);
  //     const {
  //       organization,
  //       project,
  //       repository
  //      } = _.params

  //     try {
  //       if(!service){
  //         res.status(503).send('Azure DevOps Service is Unavailable, check app-config.yaml#integrations.azure')
  //         return
  //       }

  //       const gitApi = await service.getGitApi(organization as Organization)
  //       const repoInfo = await gitApi.getRepository(repository, project)

  //       if(!repoInfo || !repoInfo.id){
  //         res.status(404).send('Not Found!')
  //         return
  //       }

  //       res.json({
  //         _links: repoInfo?._links,
  //         id: repoInfo?.id,
  //         name: repoInfo?.name,
  //         defaultBranch: repoInfo?.defaultBranch
  //       } as IRepositoryInfo)
  //     } catch (error) {
  //       console.error(error)
  //       res.status(500).send(error)
  //     }
  //   },
  // );

  router.use(errorHandler());
  return router;
}
