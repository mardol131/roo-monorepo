export type Guests = {
  adults: number;
  children: number;
  ztp: boolean;
  pets: boolean;
};

export type EventData = {
  name: string;
  icon: string;
  date: {
    start: Date;
    end: Date;
  };
  location: {
    id: string;
    name: string;
  };
  guests: Guests;
};

export type Event = {
  id: string;
  data: EventData;
};
