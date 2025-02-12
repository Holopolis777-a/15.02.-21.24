import React from 'react';
import { TicketComment } from '../../../../../types/ticket';
import { formatDistanceToNow } from '../../../../../utils/dateUtils';
import { Lock, Paperclip, Download } from 'lucide-react';

interface CommentItemProps {
  comment: TicketComment;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`p-6 ${comment.isInternal ? 'bg-yellow-50' : ''}`}>
      <div className="flex space-x-3">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <p className="text-sm font-medium text-gray-900">
                {comment.author?.firstName} {comment.author?.lastName}
              </p>
              <span className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(comment.createdAt))}
              </span>
              {comment.isInternal && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  <Lock className="w-3 h-3 mr-1" />
                  Intern
                </span>
              )}
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
            {comment.content}
          </div>

          {comment.attachments && comment.attachments.length > 0 && (
            <div className="mt-4 space-y-2">
              {comment.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Paperclip className="w-4 h-4 text-gray-400" />
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
                    className="p-1 text-gray-400 hover:text-gray-500"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;