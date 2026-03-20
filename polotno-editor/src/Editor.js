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
  width: 800,
  height: 600,
  pages: [
    {
      id: 'page-1', // ✅ required
      children: [
        {
          id: 'text-1', // ✅ required
          type: 'text',
          text: 'Welcome to Polotno',
          x: 80,
          y: 100,
          fontSize: 50,
          fill: 'black',
        },
        {
          id: 'text-2', // ✅ required
          type: 'text',
          text: 'Edit this template',
          x: 80,
          y: 180,
          fontSize: 24,
          fill: 'gray',
        },
      ],
    },
  ],
};



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

    return (
        <>
            <div
                style={{
                position: 'fixed',
                top: 60,
                right: 120, // 👈 shift left from extreme edge
                zIndex: 9999,
                background: 'white',
                padding: '8px',
                borderRadius: '6px',
                }}
            >
                <button onClick={saveDesign}>Save Design (JSON)</button>
                <button onClick={addImageFromURL}>Add Image</button>
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