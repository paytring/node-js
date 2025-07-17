export interface OrderData {
  amount: number;
  key: string;
  receipt_id: string | number;
  cname: string;
  phone: number;
  email: string;
  callback_url: string;
  [key: string]: any;
}

export interface Order {
  order_id: string;
  amount: number;
  receipt_id: string | number;
  status: string;
  created_at: string;
  [key: string]: any;
}

export interface HashData {
  [key: string]: any;
}

export interface PaytringResponse<T = any> {
  status: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

export interface VpaValidationResponse {
  valid: boolean;
  name?: string;
  [key: string]: any;
}

export declare class Paytring {
  constructor(apiKey: string, apiSecret: string);

  order: {
    create(orderData: OrderData): Promise<PaytringResponse<Order>>;
    fetch(orderId: string): Promise<PaytringResponse<Order>>;
    fetchAdvance(orderId: string): Promise<PaytringResponse<Order>>;
  };

  upi: {
    vpa: {
      validate(vpa: string): Promise<PaytringResponse<VpaValidationResponse>>;
    };
  };

  hash: {
    verify(hashData: HashData): boolean;
  };
}

export default Paytring;
