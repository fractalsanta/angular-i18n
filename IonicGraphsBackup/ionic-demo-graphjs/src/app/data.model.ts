export interface ProvincialDamLevel {
  levels: DamMeasure[];
  province: string;
  capital?: CityInformation;
  fsc: number;
  waterInStorage: number;
  percentageFull: number;
}
export interface CityInformation {
  name: string;
  latitude: number;
  longitude: number;
}

export interface DamMeasure {
  date: string;
  measurement: number;
}
