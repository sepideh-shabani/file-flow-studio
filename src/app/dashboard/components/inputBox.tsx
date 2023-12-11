import { UploadPDFResponse, apiUploadPDF, apiViewer } from "@/app/api-requests";
import { useState, Dispatch, SetStateAction } from "react";

type InputBoxType = {
  mode: string;
  handleModeChange: (newMode: "file" | "text") => void;
  setUploadedPdf: Dispatch<SetStateAction<UploadPDFResponse | undefined>>;
  setPdfBlob: Dispatch<SetStateAction<Blob | null>>;
};

const InputBox = ({
  mode,
  handleModeChange,
  setUploadedPdf,
  setPdfBlob,
}: InputBoxType) => {
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file =
      e.target.files && e.target.files.length > 0 ? e.target.files[0] : null;

    if (file) {
      setLoading(true);

      try {
        const response = await apiUploadPDF(file);
        setUploadedPdf(response);

        const viewerResponse = await apiViewer({
          id: {
            file_ID: response.file_id,
          },
          mode: {
            mode: "pdf",
          },
          origin: {
            origin: false,
          },
        });
        if (viewerResponse.ok) {
          const pdfBlob = await viewerResponse.blob();
          setPdfBlob(pdfBlob);
        } else {
          console.error("Error:", viewerResponse.statusText);
        }
      } catch (error) {
        console.error("Error uploading PDF:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div className="mb-4">
        <label className="mr-4">
          <input
            type="radio"
            value="file"
            checked={mode === "file"}
            onChange={() => handleModeChange("file")}
          />
          File
        </label>
        <label>
          <input
            type="radio"
            value="text"
            checked={mode === "text"}
            onChange={() => handleModeChange("text")}
          />
          Text
        </label>
      </div>

      {mode === "file" && (
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Upload File
          </label>
          <input
            type="file"
            className="w-full border rounded py-2 px-3 text-gray-800"
            onChange={handleFileChange}
          />
          {loading && <p>Loading...</p>}
        </div>
      )}
    </>
  );
};

export default InputBox;
