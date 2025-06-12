import * as dotenv from 'dotenv';
dotenv.config();

export default {
  expo: {
    name: "Finance",
    slug: "finance",
    version: "1.0.0",
    scheme: "finance",
    experiments: {
      newArchEnabled: true,
    },
    extra: {
      API_URL: process.env.API_URL,
      eas: {
        projectId: "5f04141f-510a-4842-838b-d9fce0060cc5", // Add this too if using EAS
      },
    },
    android: {
      package: "com.vishwarajsinh.finance", // 👈 REQUIRED!
    },
  },
};
