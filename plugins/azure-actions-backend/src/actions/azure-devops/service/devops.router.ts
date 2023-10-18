/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { errorHandler } from '@backstage/backend-common';
import * as express from 'express';
import Router from 'express-promise-router';
import { azureAxiosInstance } from '../domain/axios';
import { AzureOrganizationService } from '../domain/organization';
import { BackstageConfigIntegrations } from '../../backstage-config';
import { AzureEntitlementsService } from '../domain/entitlements';
import { PluginEnvironment } from '../../types';
import { parseEntityRef } from '@backstage/catalog-model';
import { handleUserIdentity } from '../../middlewares/authenticated';
import { AzureServiceConnectionService } from '../domain/service-connection';
import {
  AzurePipelineService,
  AzureRepoService,
  AzureVariableGroupService,
} from '../domain';

export default async function createRouter({
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

  router.get('/organizations/test', async (_, res) => {
    logger.info(`${_.method} ${_.url}`);

    try {
      res.json('ok');
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  });
  router.get(
    '/organizations',
    handleUserIdentity({ identity }),
    async (_, res) => {
      logger.info(`${_.method} ${_.url}`);

      try {
        const orgServiceAwait = await orgService.list();
        res.json(orgServiceAwait);
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

  router.get(
    '/variablegroups/:organization/:project',

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
