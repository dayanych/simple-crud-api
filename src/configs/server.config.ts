import dotenv from 'dotenv';

dotenv.config();

export const getServerConfig = () => {
  return {
    port: process.env.PORT ? +process.env.PORT : 4000,
  }
};
