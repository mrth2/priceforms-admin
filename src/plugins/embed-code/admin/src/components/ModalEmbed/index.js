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
  const [height, setHeight] = React.useState(700);

  const onUseFullWidth = React.useCallback(() => {
    // toggle off
    if (useFullWidth) {
      setUseFullWidth(false);
      if (width === '100%') {
        setWidth(700);
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
        setHeight(700);
      }
    }
    // toggle on
    else {
      setUseFullHeight(true);
      setHeight('100%');
    }
  }, [useFullHeight, height]);

  const formUid = Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5);

  const modalModeStyle = `
    .backdrop_${formUid} {
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
    .backdrop_${formUid}.open_${formUid} {
      background-color: rgba(119, 119, 119, 0.7);
      pointer-events: auto;
      transition: background-color 300ms ease-in-out;
      z-index: 1100;
    }
    .lightbox_${formUid} {
      background-color: white;
      box-shadow: 0 0 12px rgb(0 0 0 / 30%), 0 1px 5px rgb(0 0 0 / 20%);
      max-height: 100%;
      max-width: 100%;
      position: relative;
      border-radius: 8px;
    }
    .iframeWrapper_${formUid} {
      -webkit-overflow-scrolling: touch;
      overflow: auto;
      width: min(90vw, 680px);
      max-height: 100%;
      max-width: 100%;
      border-radius: 8px;
    }
    .close_${formUid} {
      border: 3px solid dimgray;
      cursor: pointer;
      font-size: 0;
      height: 30px;
      position: absolute;
      right: -15px;
      top: -15px;
      width: 30px;
      border-radius: 100%;
    }
    .close_${formUid}:after {
      content: '+';
      font-size: 30px;
      font-weight: normal;
      line-height: 1em;
      text-align: center;
      color: dimgray;
      position: absolute;
      top: -2px;
      right: 4px;
      transform: rotate(45deg);
    }
  `

  const cleanScript = (s, keepNewLine = true) => {
    return s
      .split(/\n/g)
      .filter(v => v.trim())
      .map(v => (keepNewLine ? '\t' : '') + v.trim())
      .join(keepNewLine ? '\n' : '');
  }

  const iframeScript = `
    var iframe = document.createElement('iframe');
    iframe.src = 'http${FRONTEND_DOMAIN.includes('local') ? '' : 's'}://${initialData.subDomain}.${FRONTEND_DOMAIN}/embed';
    iframe.allowFullscreen = true;
    iframe.frameBorder = 0;
    iframe.width = "${width}";
    iframe.height = "${height}";
  `;

  const modalModeScript = `
    function openForm_${formUid}() {
      ${iframeScript}

      var style = document.createElement('style');
      style.type = "text/css";
      style.innerHTML = "${modalModeStyle.trim().replace(/([\n\t])/g, '').replace(/\s\s/g, '')}";
      document.head.appendChild(style);

      var backdrop = document.createElement('div');
      backdrop.classList.add('backdrop_${formUid}');
      
      var lightbox = document.createElement('div');
      lightbox.classList.add('lightbox_${formUid}');

      var iframeWrapper = document.createElement('div');
      iframeWrapper.classList.add('iframeWrapper_${formUid}');

      iframeWrapper.appendChild(iframe);

      var closeBtn = document.createElement('button');
      closeBtn.classList.add('close_${formUid}');
      closeBtn.type = 'button';
      closeBtn.role = 'button';
      closeBtn.innerText = 'Close';
      closeBtn.addEventListener('click', function() {
        backdrop.classList.remove('open_${formUid}');
      });

      lightbox.appendChild(iframeWrapper);
      lightbox.appendChild(closeBtn);
      backdrop.appendChild(lightbox);

      document.body.appendChild(backdrop);
      setTimeout(function() {
        backdrop.classList.add('open_${formUid}');
      }, 50);
    }
  `;

  const customModeScript = `
    (function () {
      ${iframeScript}

      var container = document.getElementById('priceform-embed');
      container && (container.innerHTML = iframe.outerHTML);
    })();
  `;

  const embedScript =
    `<script>
    ${cleanScript(showFormAsModal ? modalModeScript : customModeScript)}
</script>`;


  function copyContainer() {
    navigator.clipboard.writeText(containerDiv);
  }

  const functionOpenForm = `openForm_${formUid}();`;

  function copyFunctionOpenForm() {
    navigator.clipboard.writeText(functionOpenForm);
  }

  function copyScript() {
    navigator.clipboard.writeText(cleanScript(embedScript, false));
  }

  function selectAllElementText(el) {
    let sel, range;
    if (window.getSelection && document.createRange) { //Browser compatibility
      sel = window.getSelection()
      if (sel.toString() == '') { // no text selection
        window.setTimeout(function () {
          range = document.createRange() // range object
          range.selectNodeContents(el) // sets Range
          sel.removeAllRanges() // remove all ranges from selection
          sel.addRange(range) // add Range to a Selection.
        }, 1);
      }
    } else if (document.selection) { //older ie
      sel = document.selection.createRange()
      if (sel.text == '') { // no text selection
        range = document.body.createTextRange() // Creates TextRange object
        range.moveToElementText(el) // sets Range
        range.select() // make selection.
      }
    }
  }

  function copySyntaxCode(event) {
    let code
    if (event.target.tagName === 'PRE') {
      code = event.target.querySelector('code')
    }
    else if (event.target.tagName === 'CODE') {
      code = event.target
    }
    else {
      code = event.target.closest('code')
    }
    if (!code) return
    selectAllElementText(code)
  }

  function onClickEmbedContainer(event) {
    copySyntaxCode(event)
    copyContainer()
  }

  function onClickEmbedScript(event) {
    copySyntaxCode(event)

    copyScript()
  }

  function onClickFunctionOpenForm(event) {
    copySyntaxCode(event)
    copyFunctionOpenForm()
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
                hint="Default: 700px"
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
          {showFormAsModal ? (
            <>
              <Flex gap={2}>
                <Icon color="primary600" as={Duplicate} onClick={copyFunctionOpenForm} style={{ cursor: 'pointer' }} />
                Copy this function and trigger call on your own or bind to any button
              </Flex>
              <SyntaxHighlighter language="htmlbars" style={docco} onClick={onClickFunctionOpenForm}>
                {functionOpenForm}
              </SyntaxHighlighter>
            </>
          ) : (
            <>
              <Flex gap={2}>
                <Icon color="primary600" as={Duplicate} onClick={copyContainer} style={{ cursor: 'pointer' }} />
                Copy this div to any place you want the form to display
              </Flex>
              <SyntaxHighlighter language="htmlbars" style={docco} onClick={onClickEmbedContainer}>
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
          <SyntaxHighlighter language="htmlbars" style={docco} onClick={onClickEmbedScript}>
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