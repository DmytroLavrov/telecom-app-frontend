export interface ICall {
  _id: string;
  subscriber: string;
  city: string;
  date: number;
  duration: number;
  timeOfDay: TimeOfDay;
  cost: number;
}

export interface INewCall {
  subscriber: string;
  city: string;
  date: number | string;
  duration: number;
}

type TimeOfDay = 'day' | 'night';
