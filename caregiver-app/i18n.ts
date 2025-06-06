import i18n from 'i18n-js';
import { I18nManager } from 'react-native';

// English translations
const en = {
  backgroundCheck: {
    title: 'Background Check',
    status: {
      pending: 'Pending Verification',
      processing: 'Processing',
      completed: 'Completed',
      failed: 'Failed',
      unknown: 'Unknown',
    },
    score: 'Overall Score: {{score}}%',
    startCheck: 'Start Background Check',
    processing: 'Your background check is being processed...',
    completed: 'Your background check has been completed!',
    nextCheck: 'Next check due: {{date}}',
    documents: {
      title: 'Required Documents',
      id: 'ID Document',
      degree: 'Education Certificate',
      certification: 'Professional Certification',
      reference: 'Reference Letter',
      health: 'Health Clearance',
    },
  },
  documentUpload: {
    upload: 'Upload Document',
  },
};

// Chinese translations
const zh = {
  backgroundCheck: {
    title: '背景调查',
    status: {
      pending: '待验证',
      processing: '处理中',
      completed: '已完成',
      failed: '失败',
      unknown: '未知',
    },
    score: '总评分: {{score}}%',
    startCheck: '开始背景调查',
    processing: '您的背景调查正在处理中...',
    completed: '您的背景调查已完成！',
    nextCheck: '下次检查日期: {{date}}',
    documents: {
      title: '所需文件',
      id: '身份证明',
      degree: '学历证书',
      certification: '专业认证',
      reference: '推荐信',
      health: '健康证明',
    },
  },
  documentUpload: {
    upload: '上传文件',
  },
};

// Initialize i18n
i18n.fallbacks = true;
i18n.translations = { en, zh };
i18n.locale = I18nManager.isRTL ? 'zh' : 'en';

export default i18n;
