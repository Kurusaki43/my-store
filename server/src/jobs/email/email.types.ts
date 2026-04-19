export type OrderItem = { name: string; quantity: number; price: number };

export type WelcomeEmailData = { type: 'welcome'; to: string; name: string };
export type PasswordResetEmailData = {
  type: 'password-reset';
  to: string;
  name: string;
  resetLink: string;
};
export type OrderConfirmEmailData = {
  type: 'order-confirm';
  to: string;
  orderId: string;
  items: OrderItem[];
  total: number;
};

export type EmailJobData = WelcomeEmailData | PasswordResetEmailData | OrderConfirmEmailData;
