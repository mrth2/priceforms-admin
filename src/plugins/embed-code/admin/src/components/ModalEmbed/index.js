import React from 'react';
import Duplicate from '@strapi/icons/Duplicate';
import { ModalLayout, ModalBody, ModalHeader, ModalFooter } from '@strapi/design-system/ModalLayout';
import { Typography } from '@strapi/design-system/Typography';
import { Stack } from '@strapi/design-system/Stack';
import { Box } from '@strapi/design-system/Box';
import { Flex } from '@strapi/design-system/Flex';
import { Grid } from '@strapi/design-system/Grid';
import { Icon } from '@strapi/design-system/Icon';
import { NumberInput } from '@strapi/design-system/NumberInput';
import { ToggleInput } from '@strapi/design-system/ToggleInput';
import { Button } from '@strapi/design-system/Button';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

function ModalEmbed({ initialData, closeModal }) {
  const [showFormAsModal, setShowFormAsModal] = React.useState(true);
  const containerDiv = `<div id="priceform-embed"></div>`;

  const [useFullWidth, setUseFullWidth] = React.useState(true);
  const [useFullHeight, setUseFullHeight] = React.useState(false);

  const [width, setWidth] = React.useState('100%');
  const [height, setHeight] = React.useState(800);

  const onUseFullWidth = React.useCallback(() => {
    // toggle off
    if (useFullWidth) {
      setUseFullWidth(false);
      if (width === '100%') {
        setWidth(800);
      }
    }
    // toggle on
    else {
      setUseFullWidth(true);
      setWidth('100%');
    }
  }, [useFullWidth, width]);
  const onUseFullHeight = React.useCallback(() => {
    // toggle off
    if (useFullHeight) {
      setUseFullHeight(false);
      if (height === '100%') {
        setHeight(800);
      }
    }
    // toggle on
    else {
      setUseFullHeight(true);
      setHeight('100%');
    }
  }, [useFullHeight, height]);

  const styleId = Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5);

  const modalModeStyle = `
    .backdrop_${styleId} {
      align-items: center;
      bottom: -1000px;
      display: flex;
      justify-content: center;
      left: -1000px;
      padding: 1030px;
      pointer-events: none;
      position: fixed;
      right: -1000px;
      top: -1000px;
      transition: background-color 300ms ease-in-out, z-index 300ms step-end;
      z-index: -1;
    }
    .backdrop_${styleId}.open_${styleId} {
      background-color: rgba(119, 119, 119, 0.7);
      pointer-events: auto;
      transition: background-color 300ms ease-in-out;
      z-index: 1100;
    }
    .lightbox_${styleId} {
      background-color: white;
      box-shadow: 0 0 12px rgb(0 0 0 / 30%), 0 1px 5px rgb(0 0 0 / 20%);
      max-height: 100%;
      max-width: 100%;
      position: relative;
    }
    .iframeWrapper_${styleId} {
      -webkit-overflow-scrolling: touch;
      overflow: auto;
      max-height: 100%;
      max-width: 100%;
    }
  `

  const iframeScript = `
    var iframe = document.createElement('iframe');
    iframe.src = 'http${FRONTEND_DOMAIN.includes('local') ? '' : 's'}://${initialData.subDomain}.${FRONTEND_DOMAIN}/embed';
    iframe.allowFullscreen = true;
    iframe.frameBorder = 0;
    iframe.width = "${width}";
    iframe.height = "${height}";
  `;

  const modalModeScript = `
    const style = document.createElement('style');
    style.type = "text/css";
    style.innerHTML = "${modalModeStyle.replace(/([\s\n])/g, '')}";
    document.head.appendChild(style);

    var backdrop = document.createElement('div');
    backdrop.classList.add('backdrop_${styleId}');
    
    var lightbox = document.createElement('div');
    lightbox.classList.add('lightbox_${styleId}');

    var iframeWrapper = document.createElement('div');
    iframeWrapper.classList.add('iframeWrapper_${styleId}');

    iframeWrapper.appendChild(iframe);

    lightbox.appendChild(iframeWrapper);
    backdrop.appendChild(lightbox);

    document.body.appendChild(backdrop);

    setTimeout(() => backdrop.classList.add('open_${styleId}'), 2000);
  `;

  const customModeScript = `
    var container = document.getElementById('priceform-embed');
    container && (container.innerHTML = iframe.outerHTML);
  `;

  const cleanScript = (s, keepNewLine = true) => {
    return s
      .split(/\n/g)
      .filter(v => v.trim())
      .map(v => (keepNewLine ? '\t' : '') + v.trim())
      .join(keepNewLine ? '\n' : '');
  }

  const embedScript =
    `<script>
    (() => {
      ${cleanScript(iframeScript)}
      ${cleanScript(showFormAsModal ? modalModeScript : customModeScript)}
    })();
</script>`;


  function copyContainer() {
    navigator.clipboard.writeText(containerDiv);
  }

  function copyScript() {
    navigator.clipboard.writeText(cleanScript(embedScript, false));
  }

  return (
    <ModalLayout onClose={closeModal} labelledBy="title">
      <ModalHeader>
        <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
          Configure Embed Code
        </Typography>
      </ModalHeader>
      <ModalBody>
        <Grid gridCols={2} gap={2}>
          <Stack spacing={2}>
            <ToggleInput
              checked={useFullWidth}
              label="Use full width"
              hint="Set width as 100%"
              onLabel="Yes" offLabel="No"
              onChange={onUseFullWidth}
            />
            {!useFullWidth && (
              <NumberInput
                label="Width"
                name="width"
                value={width}
                onValueChange={(value) => setWidth(value)}
                step={5}
                placeholder="Enter width of the form"
                hint="Default: 100%"
              />
            )}
          </Stack>
          <Stack spacing={2}>
            <ToggleInput
              checked={useFullHeight}
              label="Use full height"
              hint="Set height as 100%"
              onLabel="Yes" offLabel="No"
              onChange={onUseFullHeight}
            />
            {!useFullHeight && (
              <NumberInput
                label="Height"
                name="height"
                value={height}
                onValueChange={(value) => setHeight(value)}
                step={5}
                placeholder="Enter height of the form"
                hint="Default: 800px"
              />
            )}
          </Stack>
        </Grid>
        <ToggleInput
          checked={showFormAsModal}
          label="Show form as:"
          onLabel="Modal" offLabel="On Page"
          onChange={() => setShowFormAsModal(!showFormAsModal)}
        />
        <br />
        <Stack spacing={4}>
          {!showFormAsModal && (
            <>
              <Flex gap={2}>
                <Icon color="primary600" as={Duplicate} onClick={copyContainer} style={{ cursor: 'pointer' }} />
                Copy this div to any place you want the form to display
              </Flex>
              <SyntaxHighlighter language="htmlbars" style={docco}>
                {containerDiv}
              </SyntaxHighlighter>
            </>
          )}
          <Flex gap={2}>
            <Icon color="primary600" as={Duplicate} onClick={copyScript} style={{ cursor: 'pointer' }} />
            Copy this code and place right before closing
            <Box background="primary600" padding={1} hasRadius>
              <Typography textColor="neutral0">
                {`</body>`}
              </Typography>
            </Box>
            tag
          </Flex>
          <SyntaxHighlighter language="htmlbars" style={docco}>
            {embedScript}
          </SyntaxHighlighter>
        </Stack>
      </ModalBody>
      <ModalFooter
        endActions={<Button onClick={closeModal}>Finish</Button>}
      />
    </ModalLayout>
  )
}

export default ModalEmbed