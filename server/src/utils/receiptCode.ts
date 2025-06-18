import { prisma } from '../lib/prisma';

/**
 * Generates a unique 8-character receipt code
 * Format: 2 letters + 6 numbers (e.g., "AB123456")
 */
export async function generateReceiptCode(): Promise<string> {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  
  // Keep trying until we find a unique code
  while (true) {
    // Generate 2 random letters
    const letterPart = Array.from({ length: 2 }, () => 
      letters[Math.floor(Math.random() * letters.length)]
    ).join('');
    
    // Generate 6 random numbers
    const numberPart = Array.from({ length: 6 }, () => 
      numbers[Math.floor(Math.random() * numbers.length)]
    ).join('');
    
    const code = letterPart + numberPart;
    
    // Check if the code already exists
    const existingReceipt = await prisma.receipts.findUnique({
      where: { receipt_code: code },
    });
    
    if (!existingReceipt) {
      return code;
    }
  }
} 