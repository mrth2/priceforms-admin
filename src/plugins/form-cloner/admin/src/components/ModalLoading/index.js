import React from 'react';

import { ModalLayout, ModalBody, ModalHeader } from '@strapi/design-system/ModalLayout';
import { Typography } from '@strapi/design-system/Typography';
import { Loader } from '@strapi/design-system/Loader';

function ModalLoading({ form }) {
  console.log(form);
  return (
    <ModalLayout>
      <ModalHeader>
        <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
          Duplicating <span style={{ textTransform: 'capitalize' }}>{form.subDomain}</span> form...
        </Typography>
      </ModalHeader>
      <ModalBody>
        <div style={{ minHeight: 250, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Loader />
        </div>
      </ModalBody>
    </ModalLayout>
  )
}

export default ModalLoading
