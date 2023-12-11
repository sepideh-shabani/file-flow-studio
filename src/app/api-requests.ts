import { blob } from "stream/consumers";

const SERVER_ENDPOINT = process.env.SERVER_ENDPOINT;

type loginDataType = {
    grant_type?: string;
    username: string;
    password: string;
    scope?: string;
    client_id?: string;
    client_secret?: string;
};

export type UploadPDFResponse = {
  docx_path: string;
  file_id: string;
  message: "pdf is too long" | "number of words is too long" | "success";
  pdf_file_path_original: string;
  pdf_path: string;
  text: string;
  text_path: string;
};

async function handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("Content-Type") || "";
    const isJson = contentType.includes("application/json");
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
        const message = isJson
            ? data.message || response.statusText
            : response.statusText;
        throw new Error(message);
    }

    return data as T;
}

export function getToken() {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'access_token') {
      return value;
    }
  }
  return '';
}

export async function apiGetToken(loginData: loginDataType) {
    const formData = new URLSearchParams(loginData);

    const response = await fetch(`http://159.69.11.168:8000/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
    });

    return handleResponse(response);
}

export async function apiUploadPDF(pdfFile:File) {
  const token = getToken();

  const formData = new FormData();
  formData.append('pdf_file', pdfFile);

  try {
    const response = await fetch('http://159.69.11.168:8000/pdf', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Upload failed');
    }

    const responseData: UploadPDFResponse = await response.json();
    return responseData;
  } catch (error) {
    throw new Error('Error uploading PDF');
  }
}

export async function apiDownload(downloadData) {
  const token = getToken();

  try {
    const response = await fetch('http://159.69.11.168:8000/download', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(downloadData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Download failed');
    }

    const responseData: string = await response.json();
    return responseData;
  } catch (error) {
    throw new Error('Error Download');
  }
}

export async function apiViewer(viewerData) {
  const token = getToken();

  try {
    const response = await fetch('http://159.69.11.168:8000/viewer', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(viewerData),
    })

    return response; // Return the response object

  } catch (error) {
    throw new Error('Error Download');
  }
}


export async function apiGetFiles() {
  const token = getToken();

  try {
    const response = await fetch('http://159.69.11.168:8000/files', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'files failed');
    }

    const responseData: string = await response.json();
    return responseData;
  } catch (error) {
    throw new Error('Error files');
  }
}