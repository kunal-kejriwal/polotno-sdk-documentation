import React, { useEffect } from 'react';
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from 'polotno';
import { Toolbar } from 'polotno/toolbar/toolbar';
import { PagesTimeline } from 'polotno/pages-timeline';
import { ZoomButtons } from 'polotno/toolbar/zoom-buttons';
import { SidePanel } from 'polotno/side-panel';
import { Workspace } from 'polotno/canvas/workspace';

import '@blueprintjs/core/lib/css/blueprint.css';

import { createStore } from 'polotno/model/store';

const store = createStore({
  key: 'MwhOw1b2N-3qa9JC0E2L', // you can create it here: https://polotno.com/cabinet/
  // you can hide back-link on a paid license
  // but it will be good if you can keep it for Polotno project support
  showCredit: true,
});

const designJSON = {
  "width": 800,
  "height": 600,
  "fonts": [],
  "pages": [
    {
      "id": "page-1",
      "children": [
        {
          "id": "bg-image",
          "type": "image",
          "opacity": 0.15,
          "x": 0,
          "y": 0,
          "width": 800,
          "height": 600,
          "src": "https://images.unsplash.com/photo-1528459105426-b9548367069b"
        },
        {
          "id": "VueUJSj5jj",
          "type": "image",
          "x": -16,
          "y": 0,
          "width": 800,
          "height": 653,
          "src": "https://images.unsplash.com/photo-1711322352942-cda9aeed0641"
        },
        {
          "id": "text-1",
          "type": "text",
          "x": 16,
          "y": 20,
          "width": 775,
          "text": "Hello. My name is {{name}}, and I welcome you to Polotno.",
          "fontSize": 50,
          "fontFamily": "Roboto",
          "align": "center"
        },
        {
          "id": "text-2",
          "type": "text",
          "x": 172,
          "y": 193,
          "width": 424,
          "text": "Catchy Offer: {{offer}}",
          "fontSize": 24,
          "fontFamily": "Roboto",
          "fill": "gray",
          "align": "center"
        }
      ],
      "width": "auto",
      "height": "auto",
      "background": "white",
      "bleed": 0,
      "duration": 5000
    }
  ],
  "audios": [],
  "unit": "px",
  "dpi": 72,
  "schemaVersion": 2
}

const dataset = [
  { name: 'Kunal', offer: '20% OFF' },
  { name: 'Misha', offer: '15% OFF' },
  { name: 'Antov', offer: 'Buy 1 Get 1' },
];


export const Editor = () => {

    useEffect(() => {
        store.loadJSON(designJSON);
        }, []);

    const exportImage = async () => {
    const dataURL = await store.toDataURL({
        pixelRatio: 2, // increase for higher resolution
    });

    // trigger download
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'design.png';
    link.click();
    };

    const exportPDF = async () => {
        await store.saveAsPDF();
    };

    const saveDesign = () => {
    const json = store.toJSON();

    // Pretty print for clean screenshot
    console.log('Saved Design JSON:');
    console.log(JSON.stringify(json, null, 2));
  };

    const addImageFromURL = () => {
        const page = store.activePage;

        const imageURL =
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e';

        page.addElement({
            type: 'image',
            src: imageURL,
            x: 100,
            y: 150,
            width: 300,
            height: 200,
        });
    };

    const replaceVariables = (template, data) => {
        let json = JSON.stringify(template);

        Object.keys(data).forEach((key) => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            json = json.replace(regex, data[key]);
        });

        return JSON.parse(json);
    };

    const generateVDP = async () => {

        const baseTemplate = store.toJSON();

        for (const record of dataset) {

            console.log(`Processing: ${record.name}`);

            const personalizedTemplate = replaceVariables(baseTemplate, record);

            await store.loadJSON(personalizedTemplate);

            // ✅ Allow render to complete
            await new Promise((resolve) => setTimeout(resolve, 200));

            // ✅ Correct export method
            await store.saveAsPDF({
                fileName: `${record.name}.pdf`,
            });

            console.log(personalizedTemplate.pages[0].children);

            // Prevent UI freeze
            await store.waitLoading();
        }

        // Restore original design
        await store.loadJSON(baseTemplate);
    };

    return (
        <>
            <div
                style={{
                position: 'fixed',
                top: 60,
                right: 120,
                zIndex: 9999,
                background: 'white',
                padding: '8px',
                borderRadius: '6px',
                }}
            >
                <button onClick={saveDesign}>Save Design (JSON)</button>
                <button onClick={addImageFromURL}>Add Image</button>
                <button onClick={generateVDP}>Generate VDP PDFs</button>
            </div>
            <PolotnoContainer style={{ width: '100vw', height: '100vh' }}>
            <SidePanelWrap>
                <SidePanel store={store} />
            </SidePanelWrap>
            <WorkspaceWrap>
                <Toolbar store={store} downloadButtonEnabled />
                <Workspace store={store} />
                <ZoomButtons store={store} />
                <PagesTimeline store={store} />
            </WorkspaceWrap>
            </PolotnoContainer>
        </>  
    );
};
