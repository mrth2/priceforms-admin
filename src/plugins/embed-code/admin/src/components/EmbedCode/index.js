import React from 'react';

import { useCMEditViewDataManager } from '@strapi/helper-plugin';
import Code from '@strapi/icons/Code';
import { Button } from '@strapi/design-system/Button';
import ModalEmbed from '../ModalEmbed';

function EmbedCode() {
  const { slug, initialData } = useCMEditViewDataManager();
  if (slug !== 'api::form.form' || !initialData || !initialData.id) {
    return null;
  }
  const [modalIsOpen, setIsOpen] = React.useState(true);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <>
      <Button
        startIcon={<Code />}
        onClick={openModal}
      >
        Get Embed Code
      </Button>
      {modalIsOpen && (
        <ModalEmbed initialData={initialData} closeModal={closeModal} />
      )}
    </>
  );
};

export default EmbedCode;