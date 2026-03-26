import dataJson from '../../dvhcvn.json';

export interface AdministrativeUnit {
  id: string;
  name: string;
  type: string;
}

export interface Province extends AdministrativeUnit {
  level2s: District[];
}

export interface District extends AdministrativeUnit {
  level3s: Ward[];
}

export interface Ward extends AdministrativeUnit {}

export const useAdministrativeUnits = () => {
  const data = dataJson.data || [];

  const getProvinces = (): AdministrativeUnit[] => {
    return data.map(p => ({
      id: p.level1_id,
      name: p.name,
      type: p.type
    }));
  };

  const getDistricts = (provinceId: string): AdministrativeUnit[] => {
    const province = data.find(p => p.level1_id === provinceId);
    return province ? province.level2s.map((d: any) => ({
      id: d.level2_id,
      name: d.name,
      type: d.type
    })) : [];
  };

  const getWards = (provinceId: string, districtId: string): AdministrativeUnit[] => {
    const province = data.find(p => p.level1_id === provinceId);
    if (!province) return [];
    const district = province.level2s.find((d: any) => d.level2_id === districtId);
    return district ? district.level3s.map((w: any) => ({
      id: w.level3_id,
      name: w.name,
      type: w.type
    })) : [];
  };

  return {
    provinces: getProvinces(),
    getDistricts,
    getWards
  };
};
