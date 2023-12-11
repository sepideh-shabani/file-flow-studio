import React, { useEffect, useState } from "react";
import PdfViewer from "@/components/PdfViewer";

type OriginalPdfViewerProps = {
  pdfBlob: Blob | undefined;
};

const OriginalPdfViewer = ({ pdfBlob }: OriginalPdfViewerProps) => {
  const [pdfUrl, setPdfUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchDataUrl = async () => {
      if (pdfBlob instanceof Blob) {
        const dataUrl = await getDataUrlFromBlob(pdfBlob);
        setPdfUrl(dataUrl);
      } else if (typeof pdfBlob === "string") {
        setPdfUrl(pdfBlob);
      }
    };

    fetchDataUrl();
  }, [pdfBlob]);

  const getDataUrlFromBlob = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          // Modify the data URL if needed
          const modifiedDataUrl = modifyDataUrlIfNeeded(reader.result);
          resolve(modifiedDataUrl);
        } else {
          reject(new Error("Failed to convert Blob to data URL"));
        }
      };
      reader.readAsDataURL(blob);
    });
  };

  const modifyDataUrlIfNeeded = (dataUrl: string): string => {
    // Implement modifications if required by the PdfViewer component
    return dataUrl;
  };

  return (
    <div className="h-full bg-gray-100">
      <PdfViewer pdfPath={pdfUrl || ""} />
    </div>
  );
};

export default OriginalPdfViewer;
