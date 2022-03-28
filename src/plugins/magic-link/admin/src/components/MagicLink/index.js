import React from 'react';

import { useCMEditViewDataManager, useRBAC } from '@strapi/helper-plugin';
import { Button } from '@strapi/design-system/Button';
import { Typography } from '@strapi/design-system/Typography';

import Eye from '@strapi/icons/Eye';

function MagicLink() {
  const { slug } = useCMEditViewDataManager();
  if (slug !== 'api::form.form') {
    return null;
  }
  return (
    <Button
      variant="primary"
      startIcon={<Eye />}
    >
      Sign In to Form Dashboard
    </Button>
  );
};

export default MagicLink;