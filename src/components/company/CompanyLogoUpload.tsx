import React, { useRef, useState } from 'react';
import { uploadCompanyLogo } from '../../utils/fileUpload';

interface CompanyLogoUploadProps {
  onUploadSuccess: (logoUrl: string) => void;
  onUploadError: (error: string) => void;
}

const CompanyLogoUpload: React.FC<CompanyLogoUploadProps> = ({
  onUploadSuccess,
  onUploadError,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const base64Logo = await uploadCompanyLogo(file);
      setPreviewUrl(base64Logo);
      onUploadSuccess(base64Logo);
    } catch (error) {
      onUploadError(error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Firmenlogo
      </label>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <div className="flex items-start space-x-4">
        <div>
          <button
            type="button"
            onClick={handleClick}
            disabled={isUploading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logo wird hochgeladen...
              </>
            ) : (
              'Logo hochladen'
            )}
          </button>
          <p className="mt-2 text-sm text-gray-500">
            PNG, JPG bis zu 1MB
          </p>
        </div>
        {previewUrl && (
          <div className="relative">
            <img 
              src={previewUrl} 
              alt="Logo Vorschau" 
              className="h-20 w-20 object-contain border rounded"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyLogoUpload;
