import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Button, IconButton, Colors, ActivityIndicator } from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';
import { useTranslation } from 'react-i18next';

interface DocumentUploadProps {
  onUpload: (file: any, type: string) => Promise<void>;
  type: string;
  title: string;
  required?: boolean;
  maxSize?: number; // in MB
  allowedTypes?: string[];
  onUploadSuccess?: () => void;
  onUploadError?: (error: string) => void;
}

const DocumentUpload = ({ 
  onUpload, 
  type, 
  title, 
  required = false,
  maxSize = 5,
  allowedTypes = ['jpg', 'jpeg', 'png', 'pdf'],
  onUploadSuccess,
  onUploadError
}: DocumentUploadProps) => {
  const { t } = useTranslation();
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    try {
      setUploading(true);
      setError(null);

      const result = await launchImageLibrary({
        mediaType: 'mixed',
        includeBase64: true,
        selectionLimit: 1,
        quality: 0.8,
      });

      if (!result.assets || !result.assets[0]) {
        return;
      }

      const file = result.assets[0];
      const fileSizeMB = file.fileSize ? file.fileSize / (1024 * 1024) : 0;
      const fileType = file.type?.split('/')[1]?.toLowerCase() || '';

      // Validate file size
      if (fileSizeMB > maxSize) {
        setError(t('documentUpload.error.tooLarge', { maxSize }));
        throw new Error('File too large');
      }

      // Validate file type
      if (!allowedTypes.includes(fileType)) {
        setError(t('documentUpload.error.invalidType', { 
          allowedTypes: allowedTypes.join(', ') 
        }));
        throw new Error('Invalid file type');
      }

      await onUpload(file, type);
      setUploadedFile(file.uri);
      onUploadSuccess?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      onUploadError?.(errorMessage);
      Alert.alert(
        t('documentUpload.error.title'),
        errorMessage
      );
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    Alert.alert(
      t('documentUpload.confirmRemove.title'),
      t('documentUpload.confirmRemove.message'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.remove'),
          style: 'destructive',
          onPress: () => {
            setUploadedFile(null);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.title}>
        {title}
        {required && <Text style={styles.required}>*</Text>}
      </Text>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {uploadedFile ? (
        <View style={styles.previewContainer}>
          <Image
            source={{ uri: uploadedFile }}
            style={styles.previewImage}
          />
          <IconButton
            icon="close"
            onPress={handleRemove}
            style={styles.removeButton}
          />
          <Text style={styles.fileInfo}>
            {t('documentUpload.fileInfo', {
              size: Math.round(fileSizeMB * 100) / 100,
              type: fileType
            })}
          </Text>
        </View>
      ) : (
        <Button
          mode="outlined"
          onPress={handleUpload}
          style={styles.uploadButton}
          disabled={uploading}
          loading={uploading}
        >
          {uploading ? (
            <ActivityIndicator color={Colors.blue500} />
          ) : (
            <>
              {t('documentUpload.upload')}
              {required && <Text style={styles.required}>*</Text>}
            </>
          )}
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
    color: Colors.grey900,
  },
  required: {
    color: Colors.red500,
    fontWeight: 'bold',
  },
  errorText: {
    color: Colors.red500,
    fontSize: 12,
    marginBottom: 8,
  },
  previewContainer: {
    position: 'relative',
    marginBottom: 8,
    backgroundColor: Colors.grey100,
    borderRadius: 8,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.red500,
    zIndex: 1,
  },
  fileInfo: {
    fontSize: 12,
    color: Colors.grey600,
    textAlign: 'center',
    marginTop: 4,
  },
  uploadButton: {
    width: '100%',
  },
});

export default DocumentUpload;
