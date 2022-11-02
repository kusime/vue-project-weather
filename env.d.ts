/// <reference types="vite/client" />
interface City {
  city: string | string[];
  country: string | string[];
}

interface Position {
  lat: LocationQueryValue | LocationQueryValue[];
  lon: LocationQueryValue | LocationQueryValue[];
}

interface StoreUnit extends City, Position {
  id: string | number;
}
