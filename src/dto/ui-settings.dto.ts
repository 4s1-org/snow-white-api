export interface IUiSettingsDto {
  traffic: {
    isActive: boolean
  }
  date: {
    isActive: boolean
    fontSize: number
  }
  weather: {
    isActive: boolean
  }
  timetable: {
    isActive: boolean
  }
  fuelPrice: {
    isActive: boolean
    showE5: boolean
    showE10: boolean
    showDiesel: boolean
    interval: number
  }
}
