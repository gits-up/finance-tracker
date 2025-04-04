import { FinExpertAPI } from "./finance-expert";

let finExpertInstance = null;

export const initializeFinExpert = async () => {
  if (!finExpertInstance) {
    finExpertInstance = new FinExpertAPI();
    await finExpertInstance.initialize();
  }
  return finExpertInstance;
};

export const getFinancialAdvice = async (message) => {
  if (!finExpertInstance) {
    await initializeFinExpert();
  }
  return await finExpertInstance.processMessage(message);
};