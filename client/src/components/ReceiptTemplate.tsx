import React from 'react';
import { MenuItem } from '../types';

interface ReceiptTemplateProps {
  items: Array<{
    menuItem: MenuItem;
    quantity: number;
  }>;
  receiptCode: string;
  pointsEarned: number;
  totals: {
    co2: number;
    water: number;
    land: number;
  };
  createdAt: string;
}

const ReceiptTemplate: React.FC<ReceiptTemplateProps> = ({
  items,
  receiptCode,
  pointsEarned,
  totals,
  createdAt,
}) => {
  const date = new Date(createdAt).toLocaleString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Calculate item totals
  const itemTotals = items.map(item => ({
    ...item,
    totalCo2: item.menuItem.co2_saved * item.quantity,
    totalWater: item.menuItem.water_saved * item.quantity,
    totalLand: item.menuItem.land_saved * item.quantity,
  }));

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Frutas Prohibidas - Sustainability Receipt</title>
      <style>
        @page {
          size: 80mm auto;
          margin: 0;
        }
        body {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          margin: 0;
          padding: 0;
          width: 80mm;
        }
        .receipt {
          width: 80mm;
          padding: 10px;
        }
        .receipt-header {
          text-align: center;
          margin-bottom: 10px;
        }
        .receipt-header h1 {
          font-size: 14px;
          margin: 0;
        }
        .receipt-header .subtitle {
          font-size: 10px;
          font-style: italic;
        }
        .date {
          font-size: 10px;
          text-align: center;
          margin-bottom: 10px;
        }
        .items {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 10px;
        }
        .items th, .items td {
          font-size: 10px;
          padding: 2px 0;
          text-align: left;
        }
        .items th {
          border-bottom: 1px solid #000;
        }
        .item-row {
          border-bottom: 1px dashed #ccc;
        }
        .item-total {
          font-size: 9px;
          color: #666;
          text-align: right;
          padding-right: 5px;
        }
        .totals {
          margin-bottom: 10px;
          border-top: 1px solid #000;
          border-bottom: 1px solid #000;
          padding: 5px 0;
        }
        .totals-label {
          font-size: 12px;
          font-weight: bold;
          text-align: center;
        }
        .totals-values {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
        }
        .receipt-footer {
          font-size: 9px;
          text-align: center;
        }
        .receipt-code {
          font-size: 12px;
          margin: 5px 0;
          font-weight: bold;
          letter-spacing: 1px;
        }
        .website {
          font-size: 8px;
        }
        .thank-you {
          font-size: 10px;
          margin-top: 5px;
        }
        .points {
          font-size: 11px;
          text-align: center;
          margin: 5px 0;
          font-weight: bold;
        }
        .divider {
          border-top: 1px dashed #000;
          margin: 5px 0;
        }
        @media print {
          body {
            width: 80mm;
          }
          .receipt {
            width: 80mm;
          }
        }
      </style>
    </head>
    <body>
      <div class="receipt">
        <header class="receipt-header">
          <h1>CUENTA DE LA SOSTENIBILIDAD<br><span class="subtitle">SUSTAINABILITY BILL</span></h1>
        </header>

        <div class="date">
          ${date}
        </div>

        <table class="items">
          <thead>
            <tr>
              <th>UND</th>
              <th>PRODUCTO</th>
              <th>CO₂ (kg)</th>
              <th>H₂O (L)</th>
              <th>TIERRA (m²)</th>
            </tr>
          </thead>
          <tbody>
            ${itemTotals.map(item => `
              <tr class="item-row">
                <td>${item.quantity}</td>
                <td>${item.menuItem.name}</td>
                <td>${item.menuItem.co2_saved}</td>
                <td>${item.menuItem.water_saved}</td>
                <td>${item.menuItem.land_saved}</td>
              </tr>
              <tr>
                <td colspan="5" class="item-total">
                  Total: CO₂ ${item.totalCo2.toFixed(2)}kg | H₂O ${item.totalWater.toFixed(0)}L | Tierra ${item.totalLand.toFixed(2)}m²
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <p class="totals-label">TOTAL DE AHORRO / TOTAL SAVING</p>
          <p class="totals-values">
            <span>${totals.co2.toFixed(2)} kg</span>
            <span>${totals.water.toFixed(0)} L</span>
            <span>${totals.land.toFixed(2)} m²</span>
          </p>
        </div>

        <div class="points">
          Puntos a ganar / Points to earn: ${pointsEarned}
        </div>

        <div class="divider"></div>

        <footer class="receipt-footer">
          <p>Register and enter this code in the Frutas Prohibidas web app to track lifetime eco-savings and earn rewards:</p>
          <p class="receipt-code">${receiptCode}</p>
          <p>Gracias por elegir comer de manera consciente en FRUTAS PROHIBIDAS</p>
          <p>Thank you for choosing to eat consciously at FRUTAS PROHIBIDAS</p>
          <p class="website">www.frutasprohibidas.com/sostenibilidad</p>
          <p class="thank-you">Your choice makes a difference!</p>
        </footer>
      </div>
    </body>
    </html>
  `;
};

export default ReceiptTemplate; 