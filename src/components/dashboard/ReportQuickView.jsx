import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from '../common/Modal';
import { Button } from '../common/Button';

const ReportQuickView = ({ report, onClose }) => {
  if (!report) return null;

  return (
    <Modal open onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Report Details</ModalTitle>
          <ModalDescription>
            Quick summary of the incident report.
          </ModalDescription>
        </ModalHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right font-semibold">Type:</span>
            <span className="col-span-3">{report.incident_type}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right font-semibold">Date:</span>
            <span className="col-span-3">{new Date(report.created_at).toLocaleString()}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right font-semibold">Description:</span>
            <p className="col-span-3">{report.description.substring(0, 100)}...</p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right font-semibold">Status:</span>
            <span className="col-span-3">{report.status}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right font-semibold">Severity:</span>
            <span className="col-span-3">{report.severity}</span>
          </div>
        </div>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ReportQuickView;