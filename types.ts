
export enum Species {
  DOG = '개',
  CAT = '고양이',
}

export interface PatientInfo {
  species: Species;
  breed: string;
  customBreed: string;
  name: string;
  ageYears: string;
  ageMonths: string;
  sex: '암' | '수' | '';
  isNeutered: boolean;
  testDate: string;
  specialNotes: string;
  vetNotes: string;
}
