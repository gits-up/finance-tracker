import { GoogleGenerativeAI } from "@google/generative-ai";
const EMI_AFFORDABILITY_THRESHOLD = 30; 

const SYSTEM_INSTRUCTION = `
You are FINExpert, a compassionate financial coach that:
1. Explains concepts simply with real-life examples.
2. Asks clarifying questions before giving advice, especially for budgeting and purchases (e.g., requires income, expenses, goals, item price, loan terms).
3. Provides multiple options with pros/cons.
4. Always checks affordability using provided user data before purchase recommendations.
5. Teaches financial terms when needed.
6. If asked about specific stock prices or market data, directs the user to use the dedicated market data feature.

Response Rules:
- Budgeting: Follow 50/30/20 rule (Needs/Wants/Savings) as a starting point, but adapt based on user details. Ask for income, expenses, and goals.
- Purchases: Calculate EMI affordability first using user-provided income, expenses, item price, interest rate, and loan duration. If details are missing, ask for them.
- Investments: Suggest based on risk profile (ask if unknown). General concepts only, no specific live data.
- Taxes: Mention deductions and filing tips.
`;

class FinancialCalculator {
  static calculateEMI(principal, annualRate, months) {
    if (months <= 0) return principal;
    if (annualRate <= 0) return principal / months; 

    const monthlyRate = annualRate / 12 / 100;
    if (monthlyRate === 0) return principal / months; 
    const powerTerm = Math.pow(1 + monthlyRate, months);
    if (powerTerm === 1) {
       return principal / months;
    }
    
    return principal * monthlyRate * powerTerm / (powerTerm - 1);
  }
  static analyzePurchase({ income, expenses, itemPrice, interestRate, durationMonths }) {
    if (income === undefined || expenses === undefined || itemPrice === undefined || interestRate === undefined || durationMonths === undefined) {
        return {
            needsMoreInfo: true,
            message: "Please provide income, expenses, item price, interest rate (annual %), and loan duration (months) for analysis."
        };
    }
    
    const disposableIncome = income - expenses;
    if (disposableIncome <= 0) {
        return {
            isAffordable: false,
            recommendation: "Your expenses meet or exceed your income. Purchasing on EMI is not advisable.",
            disposableIncome: disposableIncome,
            emi: null,
            affordabilityRatio: null
        };
    }

    const emi = this.calculateEMI(itemPrice, interestRate, durationMonths);
    const affordabilityRatio = (emi / disposableIncome) * 100;

    return {
      needsMoreInfo: false,
      disposableIncome,
      emi: emi.toFixed(2),
      affordabilityRatio: affordabilityRatio.toFixed(1),
      isAffordable: affordabilityRatio <= EMI_AFFORDABILITY_THRESHOLD,
      recommendation: affordabilityRatio > EMI_AFFORDABILITY_THRESHOLD ?
        `Caution: This purchase might strain your budget. The estimated EMI (${emi.toFixed(2)}) is ${affordabilityRatio.toFixed(1)}% of your disposable income (>${EMI_AFFORDABILITY_THRESHOLD}% threshold).` :
        `Affordable: The estimated EMI (${emi.toFixed(2)}) is ${affordabilityRatio.toFixed(1)}% of your disposable income (within ${EMI_AFFORDABILITY_THRESHOLD}% threshold).`
    };
  }
}
export class FinExpertAPI {
  constructor() {
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      throw new Error("Missing VITE_GEMINI_API_KEY in environment variables");
    }

    this.aiModel = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY).getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION,
      generationConfig: {
        temperature: 0.7, 
        topP: 0.9,
        maxOutputTokens: 2048, 
      },
    });
    this.chat = null;
  }

  async initialize() {
    this.chat = await this.aiModel.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "Hi" }],
        },
        {
          role: "model",
          parts: [{
            text: "🤑 Welcome to FINExpert! I can help with:\n" +
              "• Budget planning (using the 50/30/20 rule as a guide)\n" +
              "• Purchase decisions & affordability checks\n" +
              "• Understanding financial concepts\n" +
              "• Tax tips\n" +
              "Just ask naturally! For detailed market data, please use the market data button." // Added clarification
          }],
        },
      ],
    });

    return {
      status: "initialized",
      welcomeMessage: "🤑 Welcome to FINExpert! How can I help with your finances today? For stock prices, please use the market data button." // Updated welcome message
    };
  }

  async processMessage(message) {
    if (!this.chat) {
        return {
          type: "error",
          message: "Chat not initialized. Please call initialize() first."
        };
    }

    try {
      const isStockPriceQuery = /(stock|share|equity|ticker|market).*(price|value|quote|cost|rate)/i.test(message) ||
                                /\b(AAPL|MSFT|GOOGL|NVDA|TSLA|AMZN|[A-Z]{1,5})\b.*(price|value|quote|cost|rate)/i.test(message) || // Common symbols + generic check
                                /(how much is|what is the price of).*\b(apple|microsoft|google|nvidia|tesla|amazon|tata motors)\b/i.test(message); // Natural language check

      if (isStockPriceQuery) {
           return {
               type: "info",
               message: "Please select the market data button to get detailed information about stock prices."
           };
      }
      const result = await this.chat.sendMessage(message);
      const responseText = result.response.text();
      const needsMoreInfo = /(what is your income|need your expenses|details about the item|interest rate|loan duration)/i.test(responseText);

      return {
        type: needsMoreInfo ? "clarification" : "general", 
        message: responseText
      };

    } catch (error) {
      console.error("Message processing error:", error);
      let errorMessage = "Sorry, I encountered an error processing your request.";
      if (error.message.includes('SAFETY')) {
          errorMessage = "My response was blocked due to safety settings. Please rephrase your request.";
      } else if (error.message.includes('API key')) {
          errorMessage = "There seems to be an issue with the configuration. Please contact support.";
      }
      return {
        type: "error",
        message: errorMessage
      };
    }
  }
}