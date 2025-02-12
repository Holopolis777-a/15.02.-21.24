import React from 'react';
import { Paperclip, Download } from 'lucide-react';
import { TicketAttachment } from '../../../../types/ticket';

interface TicketAttachmentsProps {
  attachments: TicketAttachment[];
}

const TicketAttachments: React.FC<TicketAttachmentsProps> = ({ attachments }) => {
  if (attachments.length === 0) return null;

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Paperclip className="w-5 h-5 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900">Anhänge</h3>
      </div>

      <div className="space-y-3">
        {attachments.map((attachment) => (
          <div
            key={attachment.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Paperclip className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {attachment.fileName}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(attachment.fileSize)}
                </p>
              </div>
            </div>
            <a
              href={attachment.fileUrl}
              download
              className="p-2 text-gray-400 hover:text-gray-500"
            >
              <Download className="w-5 h-5" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketAttachments;