import React from 'react';

import { useCMEditViewDataManager, useRBAC } from '@strapi/helper-plugin';
import { Button } from '@strapi/design-system/Button';
import { Typography } from '@strapi/design-system/Typography';

import Eye from '@strapi/icons/Eye';

function MagicLink() {
  const { slug, initialData } = useCMEditViewDataManager();
  if (slug !== 'api::form.form' || !initialData || !initialData.id) {
    return null;
  }
  const [loading, setLoading] = React.useState(false);
  const signIn = React.useCallback(async () => {
    try {
      const localToken = localStorage.getItem('jwtToken');
      const sessionToken = sessionStorage.getItem('jwtToken');
      const token = localToken || sessionToken;
      if (!token) {
        return null;
      }
      setLoading(true);
      const { url } = await fetch('/magic-link/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.split('"')[1]}`,
        },
        body: JSON.stringify({
          id: initialData.id,
        }),
      }).then(res => res.json());
      setLoading(false);
      if (typeof url === 'string') {
        window.open(url, '_blank');
      }
    } catch (e) {

    }
  }, []);
  return (
    <Button
      loading={loading}
      startIcon={<Eye />}
      onClick={signIn}
    >
      Sign In to Form Dashboard
    </Button>
  );
};

export default MagicLink;