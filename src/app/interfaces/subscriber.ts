interface IBaseSubscriber {
  phoneNumber: string;
  edrpou: string;
  address: string;
}

export interface ISubscriber extends IBaseSubscriber {
  _id: string;
  callsCount?: number;
}

export interface INewSubscriber extends IBaseSubscriber {}

export interface ISubscriberDetails {
  subscriber: ISubscriber;
  calls: ISubscriberCallDetail[];
}

interface ISubscriberCallDetail {
  _id: string;
  city: string;
  duration: number;
  timeOfDay: TimeOfDay;
  cost: number;
  date: string;
}

type TimeOfDay = 'day' | 'night';

export interface ISubscriberCard extends IBaseSubscriber {
  _id: string;
  callsCount: number;
}
