export type EventData = {
  name: string;
  date: {
    start: Date;
    end: Date;
  };
  location: {
    id: string;
    name: string;
  };
};
