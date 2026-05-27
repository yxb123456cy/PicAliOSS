// 阿里云OSS地域类型定义
export interface OssRegion {
    id: number;
    address: string;
    name?: string;      // 可选的中文名称
}
// 带中文名称的完整版本 中国大陆 OSS 地域列表
export const ossChinaRegionsWithName: OssRegion[] = [
    { id: 1, address: 'oss-cn-hangzhou', name: '华东1（杭州）' },
    { id: 2, address: 'oss-cn-shanghai', name: '华东2（上海）' },
    { id: 3, address: 'oss-cn-qingdao', name: '华北1（青岛）' },
    { id: 4, address: 'oss-cn-beijing', name: '华北2（北京）' },
    { id: 5, address: 'oss-cn-zhangjiakou', name: '华北3（张家口）' },
    { id: 6, address: 'oss-cn-huhehaote', name: '华北5（呼和浩特）' },
    { id: 7, address: 'oss-cn-wulanchabu', name: '华北6（乌兰察布）' },
    { id: 8, address: 'oss-cn-shenzhen', name: '华南1（深圳）' },
    { id: 9, address: 'oss-cn-heyuan', name: '华南2（河源）' },
    { id: 10, address: 'oss-cn-guangzhou', name: '华南3（广州）' },
    { id: 11, address: 'oss-cn-chengdu', name: '西南1（成都）' },
    { id: 12, address: 'oss-cn-hongkong', name: '中国（香港）' }
];
// 工具函数：根据 address 查找 region
export const findRegionByAddress = (address: string): OssRegion | undefined => {
    return ossChinaRegionsWithName.find(region => region.address === address);
};
// 工具函数：获取所有 address 列表
export const getRegionAddresses = (): string[] => {
    return ossChinaRegionsWithName.map(region => region.address);
};