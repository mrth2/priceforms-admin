import React from 'react';

import { useCMEditViewDataManager } from '@strapi/helper-plugin';
import Duplicate from '@strapi/icons/Duplicate'
import { Button } from '@strapi/design-system/Button';
import ModalLoading from '../ModalLoading';

function FormCloner() {
  const { slug, initialData } = useCMEditViewDataManager();
  if (slug !== 'api::form.form' || !initialData || !initialData.id) {
    return null;
  }

  const [isLoading, setIsLoading] = React.useState(false);

  const cloneForm = React.useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, [isLoading]);

  return (
    <>
      <Button
        startIcon={<Duplicate />}
        loading={isLoading}
        variant="secondary"
        onClick={cloneForm}
      >
        Duplicate This Form
      </Button>
      {isLoading && (
        <ModalLoading form={initialData} />
      )}
    </>
  );
};

export default FormCloner;