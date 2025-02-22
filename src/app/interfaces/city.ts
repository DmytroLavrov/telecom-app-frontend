export interface ICity {
  _id: string;
  name: string;
  dayRate: number;
  nightRate: number;
  discounts: IDiscount[];
}

interface IDiscount {
  _id: string;
  duration: number;
  discountRate: number;
}

export interface INewCity {
  name: string;
  dayRate: number;
  nightRate: number;
  discounts: INewDiscount[];
}

interface INewDiscount {
  duration: number;
  discountRate: number;
}
