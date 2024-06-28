export interface IProduct {
    id: number;
    name: string;
    imageUrl: string;
    count: number;
    size: {
      width: number;
      height: number;
    };
    weight: string;
    comments: IComment[];
  }
  
  export interface IProductState {
    items: IProduct[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  }
  export interface IComment {
    id: number;
    productId: number;
    description: string;
    date: string; 
  }