import React from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";

type PdfViewerProps = {
  pdfPath: string;
};

const PdfViewer: React.FC<PdfViewerProps> = ({ pdfPath }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer fileUrl={`${pdfPath}`} />
      </Worker>
    </div>
  );
};

export default PdfViewer;
