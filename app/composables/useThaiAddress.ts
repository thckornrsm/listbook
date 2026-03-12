// composables/useThaiAddress.ts
import subDistricts from '~/assets/address-db.json'
import districts from '~/assets/districts.json'
import provinces from '~/assets/provinces.json'

export interface AddressEntry {
  subdistrict: string
  district: string
  province: string
  zipcode: string
}

const provinceMap = new Map<number, string>(
  (provinces as any[]).map((p: any) => [p.id, p.name_th])
)

const districtMap = new Map<number, { name_th: string; province_id: number }>(
  (districts as any[]).map((d: any) => [d.id, { name_th: d.name_th, province_id: d.province_id }])
)

const addressDB: AddressEntry[] = (subDistricts as unknown as any[]).map((item: any) => {
  const districtInfo = districtMap.get(item.district_id)
  const provinceName = districtInfo ? provinceMap.get(districtInfo.province_id) ?? '' : ''
  return {
    subdistrict: item.name_th ?? '',
    district: districtInfo?.name_th ?? '',
    province: provinceName,
    zipcode: String(item.zip_code ?? '')
  }
})

export function useThaiAddress() {
  const searchBySubdistrict = (query: string): AddressEntry[] => {
    if (!query || query.trim().length < 2) return []
    const q = query.trim()
    return addressDB.filter((item) => item.subdistrict.includes(q)).slice(0, 15)
  }

  return { searchBySubdistrict }
}

