import React from "react";
import {
  DialogContent,
  Dialog,
  Slide
} from '@material-ui/core';

const SoonModal = ({isOpen, closeModal}) => {
  console.log('SOONMODAL', {isOpen, closeModal})
  const fullScreen = window.innerWidth < 450;
  const Transition = (props) => <Slide direction="up" {...props} />;
  return (
    <Dialog
      open={isOpen}
      onClose={closeModal}
      fullWidth={true}
      maxWidth={'sm'}
      TransitionComponent={Transition}
      fullScreen={fullScreen}
    >
      <DialogContent>
        <img src={require(`../../assets/coming-soon.png`)} style={{ width: '100%' }} alt="" />
      </DialogContent>
    </Dialog>
  )
}

export default SoonModal;
