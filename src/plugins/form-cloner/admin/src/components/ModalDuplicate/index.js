import React from 'react';

import { ModalLayout, ModalBody, ModalHeader, ModalFooter } from '@strapi/design-system/ModalLayout';
import { Typography } from '@strapi/design-system/Typography';
import { Loader } from '@strapi/design-system/Loader';
import { TextInput } from '@strapi/design-system/TextInput';
import { Button } from '@strapi/design-system/Button';
import { Alert } from '@strapi/design-system/Alert';

function ModalDuplicate({ form, closeModal }) {
  console.log(form);
  const [isLoading, setIsLoading] = React.useState(false);
  const [subDomain, setSubDomain] = React.useState('');
  const [error, setError] = React.useState(null);

  const cloneForm = React.useCallback(() => {
    if (!subDomain) {
      setError('Please enter a subdomain');
      return;
    }
    setError(null);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, [isLoading, subDomain]);
  return (
    <ModalLayout onClose={closeModal}>
      <ModalHeader>
        <Typography fontWeight="bold" as="h2" id="title">
          Duplicating <span style={{ textTransform: 'capitalize', color: 'red' }}>"{form.subDomain}"</span> Form to
          {subDomain ? ` "${subDomain}"` : ':'}
        </Typography>
      </ModalHeader>
      <ModalBody>
        {isLoading ? (
          <div style={{ minHeight: 250, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Loader />
          </div>
        ) : (
          <>
            {error && (
              <Alert closeLabel="Close alert" title={error} variant="danger" style={{ marginBottom: 20 }}>{error}</Alert>
            )}
            < TextInput
              placeholder="Enter new subdomain"
              label="Subdomain"
              name="subdomain"
              hint={`Eg: "newform" to have it running via newform.priceforms.net`}
              value={subDomain}
              onChange={e => setSubDomain(e.target.value)}
            />
          </>
        )}
      </ModalBody>
      <ModalFooter
        startActions={<Button onClick={closeModal} variant="ghost">Cancel</Button>}
        endActions={<Button onClick={cloneForm}>Duplicate</Button>}
      />
    </ModalLayout>
  )
}

export default ModalDuplicate
