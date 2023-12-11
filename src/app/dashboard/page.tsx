"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FileList from "./components/fileList";
import OriginalPdfViewer from "./components/originalPdfViewer";
import ChatBox from "./components/chatBox";
import InputBox from "./components/inputBox";
import { UploadPDFResponse } from "../api-requests";

const Dashboard = () => {
  const router = useRouter();

  useEffect(() => {
    const accessToken = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("access_token="));

    if (!accessToken) {
      router.push("/");
    }
  }, [router]);

  const [mode, setMode] = useState<"file" | "text">("file");
  const [uploadedPdf, setUploadedPdf] = useState<
    UploadPDFResponse | undefined
  >();
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  console.log("🚀 ~pdfBlob:", pdfBlob);

  const handleModeChange = (newMode: "file" | "text") => {
    setMode(newMode);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-12 gap-3 bg-white">
      <div className="col-span-1 md:col-span-2 bg-white rounded shadow-md p-2">
        <InputBox
          mode={mode}
          handleModeChange={handleModeChange}
          setUploadedPdf={setUploadedPdf}
          setPdfBlob={setPdfBlob}
        />
        <FileList />
      </div>
      <div className="col-span-1 md:col-span-5 bg-white  rounded shadow-md p-2">
        {mode === "file" && pdfBlob && <OriginalPdfViewer pdfBlob={pdfBlob} />}
        {mode === "text" && (
          <textarea
            rows={10}
            className="block p-2.5 w-full text-sm  bg-gray-50 rounded-lg border border-gray-300"
            placeholder="Write here..."
          ></textarea>
        )}
      </div>
      <div className="col-span-1 md:col-span-5 bg-white rounded shadow-md p-2">
        {/* {uploadedPdf && <OriginalPdfViewer url={uploadedPdf.pdf_path} />} */}
        <ChatBox />
      </div>
    </div>
  );
};

export default Dashboard;
