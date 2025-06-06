import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

interface BackgroundCheckStatus {
  status: string;
  documents: Array<{
    type: string;
    status: string;
    verificationDate: string;
  }>;
  overallScore: number | null;
}

export function useBackgroundCheck() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [status, setStatus] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Array<{
    type: string;
    status: string;
    verificationDate: string;
  }>>([]);
  const [overallScore, setOverallScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getBackgroundCheckStatus = async () => {
    try {
      const response = await axios.get('/api/background-check/status', {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      const data = response.data;
      setStatus(data.status);
      setDocuments(data.documents || []);
      setOverallScore(data.overallScore);
    } catch (error) {
      console.error('Error getting background check status:', error);
    }
  };

  const startCheck = async () => {
    try {
      setIsLoading(true);
      await axios.post('/api/background-check/start', {}, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      await getBackgroundCheckStatus();
    } catch (error) {
      console.error('Error starting background check:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadDocument = async (file: any, type: string) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('document', {
        uri: file.uri,
        type: file.type,
        name: file.fileName || 'document',
      });
      formData.append('documentType', type);

      await axios.post('/api/background-check/upload', formData, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      await getBackgroundCheckStatus();
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      getBackgroundCheckStatus();
    }
  }, [user?.token]);

  return {
    status,
    documents,
    overallScore,
    isLoading,
    startCheck,
    uploadDocument,
  };
}
