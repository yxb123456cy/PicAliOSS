import { useSettingsStore } from '@/entrypoints/popup/store/settings';
// 格式化链接;
export const formatLink = (url: string, filename?: string) => {
    const store = useSettingsStore();

    // 从store中获取格式化链接格式;
    const format = store.linkFormat || 'markdown'; // 若为undefined，默认使用Markdown格式

    if (format === 'markdown') {
        // 格式化为Markdown格式;
        return `![${filename || 'image'}](${url})`;
    } else if (format === 'html') {
        // 格式化为HTML格式;
        return `<img src="${url}" alt="${filename || 'image'}" />`;
    }

    return url;
};
