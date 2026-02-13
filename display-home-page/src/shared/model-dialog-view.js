import { Dialog } from 'primereact/dialog';
import React, { useEffect, useState } from 'react';

const ModelDialogView = (props) => {
  console.log('Show dialog clicked: ', props);
  const [visible, setVisible] = useState(props.showDialog);
  const onHide = () => {
    // setVisible(true);
    props.onModelHide();
  }
  useEffect(() => {
    console.log('hey');
    //setVisible(true)
  }, [visible])
  return (
    <Dialog
      header="Header"
      visible={visible}
      onHide={onHide}
      style={{ width: "50vw" }}
      breakpoints={{ "960px": "75vw", "641px": "100vw" }}
    >
      <p className="m-0">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
        minim veniam, quis nostrud exercitation ullamco laboris nisi ut
        aliquip ex ea commodo consequat. Duis aute irure dolor in
        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
        culpa qui officia deserunt mollit anim id est laborum.
      </p>
    </Dialog>
  );
};

export default ModelDialogView;