import React, { useCallback, useState } from 'react';
import { Upload, FileText, X, Plus } from 'lucide-react';
import { Document } from '../App';

interface FileUploadProps {
  documents: Document[];
  onDocumentsChange: (documents: Document[]) => void;
  onNext: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  documents,
  onDocumentsChange,
  onNext,
}) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const pdfFiles = files.filter(file => file.type === 'application/pdf');
    
    const newDocuments: Document[] = pdfFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    onDocumentsChange([...documents, ...newDocuments]);
  }, [documents, onDocumentsChange]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const pdfFiles = files.filter(file => file.type === 'application/pdf');
    
    const newDocuments: Document[] = pdfFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    onDocumentsChange([...documents, ...newDocuments]);
  };

  const removeDocument = (id: string) => {
    onDocumentsChange(documents.filter(doc => doc.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Upload Documents</h2>
          <p className="text-blue-200">
            Upload 3-10 related PDF documents for analysis
          </p>
        </div>

        <div
          className={`
            border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300
            ${dragActive 
              ? 'border-blue-400 bg-blue-400/10' 
              : 'border-white/30 hover:border-white/50'
            }
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-16 h-16 text-white/60 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Drop PDF files here
          </h3>
          <p className="text-white/60 mb-6">
            or click to browse your files
          </p>
          <label className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors duration-200">
            <Plus className="w-5 h-5 mr-2" />
            Choose Files
            <input
              type="file"
              multiple
              accept=".pdf"
              onChange={handleFileInput}
              className="hidden"
            />
          </label>
        </div>

        {documents.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-white mb-4">
              Uploaded Documents ({documents.length})
            </h3>
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between bg-white/5 rounded-lg p-4 border border-white/10"
                >
                  <div className="flex items-center">
                    <FileText className="w-8 h-8 text-red-400 mr-3" />
                    <div>
                      <p className="text-white font-medium">{doc.name}</p>
                      <p className="text-white/60 text-sm">{formatFileSize(doc.size)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeDocument(doc.id)}
                    className="p-2 text-white/60 hover:text-red-400 transition-colors duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {documents.length >= 3 && (
              <div className="mt-8 text-center">
                <button
                  onClick={onNext}
                  className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors duration-200"
                >
                  Continue to Persona Definition
                </button>
              </div>
            )}

            {documents.length < 3 && (
              <div className="mt-6 p-4 bg-orange-500/20 border border-orange-500/30 rounded-lg">
                <p className="text-orange-200 text-center">
                  Please upload at least 3 documents to continue
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};