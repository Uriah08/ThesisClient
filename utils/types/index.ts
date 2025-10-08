export type User = {
  username: string;
  email: string;
  id: string;
  first_name?: string;
  last_name?: string;
  birthday?: string;
  address?: string;
  is_complete?: boolean;
  profile_picture?: string;
};

export type ForecastItem = {
  datetime: string;
  description: string;
  icon: string;
  temperature: number;
  pop: number;
  wind_speed: number;
  clouds: number;
};

export type Farm = {
  id: number;
  name: string;
  description: string;
  image_url: string | null;
  members: number[];
  owner: number;
  owner_name: string;
  create_at: Date
};

export type WeatherData = {
  city: {
    country: string;
    name: string;
  };
  first_item: {
    datetime: string;
    description: string;
    icon: string;
    temperature: number;
    pop: number;
    wind_speed: number;
    clouds: number;
  };
  future_forecast: {
    datetime: string;
    description: string;
    icon: string;
    temperature: number;
    pop: number;
    wind_speed: number;
    clouds: number;
  }[];
};

export interface Notification {
  id: number;
  title: string;
  type: "announcement" | "reminder" | "weather" | "people";
  body: string;
  data: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface Recipient {
  id: number;
  notification: Notification;
  user: string;
  read: boolean;
  read_at: string | null;
  created_at: string;
}

export type FarmSession = {
  id: number;
  farm: number;
  farm_name: string;
  name: string;
  description: string;
  status: string;
  start_time: string | null;
  end_time: string | null;
  created_at: string;
};
