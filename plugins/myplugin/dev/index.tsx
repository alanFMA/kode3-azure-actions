import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { mypluginPlugin, MypluginPage } from '../src/plugin';

createDevApp()
  .registerPlugin(mypluginPlugin)
  .addPage({
    element: <MypluginPage />,
    title: 'Root Page',
    path: '/myplugin'
  })
  .render();
