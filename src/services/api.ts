import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://video-e-audio.onrender.com/api';

interface DownloadRequest {
  url: string;
  format: string;
  quality?: string;
  savePath?: string;
}

interface DownloadResponse {
  message: string;
  id: number;
}

export const downloadVideo = async (downloadData: DownloadRequest): Promise<DownloadResponse> => {
  try {
    const response = await axios.post(`${API_URL}/download`, downloadData);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data || 'Erro no servidor');
    }
    throw error;
  }
};

export const getDownloads = async () => {
  try {
    const response = await axios.get(`${API_URL}/downloads`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data || 'Erro ao buscar downloads');
    }
    throw error;
  }
};

export const downloadFile = (filePath: string) => {
  window.open(`${API_URL}/download-file?filePath=${filePath}`, '_blank');
};
