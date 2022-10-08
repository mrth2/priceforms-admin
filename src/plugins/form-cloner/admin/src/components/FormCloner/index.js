import React from 'react';

import { useCMEditViewDataManager } from '@strapi/helper-plugin';
import Duplicate from '@strapi/icons/Duplicate'
import { Button } from '@strapi/design-system/Button';
import ModalDuplicate from '../ModalDuplicate';

function FormCloner() {
  const { slug, initialData } = useCMEditViewDataManager();
  if (slug !== 'api::form.form' || !initialData || !initialData.id) {
    return null;
  }

  const [modalIsOpen, setModalIsOpen] = React.useState(false);

  return (
    <>
      <Button
        startIcon={<Duplicate />}
        variant="secondary"
        onClick={() => setModalIsOpen(true)}
      >
        Duplicate This Form
      </Button>
      {modalIsOpen && (
        <ModalDuplicate form={initialData} closeModal={() => setModalIsOpen(false)} />
      )}
    </>
  );
};

export default FormCloner;