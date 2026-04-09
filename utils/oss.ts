import OSS from 'ali-oss';
import { useSettingsStore, type OssConfig } from '@/entrypoints/popup/store/settings';

let ossClient: OSS | null = null;

// 获取阿里云OSS客户端;
export const getOssClient = (configOverride?: OssConfig) => {
    let config = configOverride;

    if (!config) {
        const settingsStore = useSettingsStore();
        config = settingsStore.ossConfig;
    }

    if (!config || !config.accessKeyId || !config.accessKeySecret || !config.bucket || !config.region) {
        throw new Error('OSS Config is missing required fields');
    }

    if (!ossClient || configOverride) {
        ossClient = new OSS({
            region: config.region,
            accessKeyId: config.accessKeyId,
            accessKeySecret: config.accessKeySecret,
            bucket: config.bucket,
            secure: true,
        });
    }

    return ossClient;
};

// 测试阿里云OSS连接;
export const testOssConnection = async (config: OssConfig) => {
    try {
        const client = getOssClient(config);
        // list buckets or just put an empty file to test
        // actually `listBuckets` requires full permission, `list` is safer if the key only has bucket permissions
        await client.listV2({ "max-keys": 1 });
        return { success: true, message: '配置成功' };
    } catch (error: any) {
        return { success: false, message: error.message || '连接失败' };
    }
};

// 上传图片到阿里云OSS;
export const uploadImageToOss = async (file: File, renamePattern?: string) => {
    const client = getOssClient();
    const settingsStore = useSettingsStore();
    const config = settingsStore.ossConfig;

    // Create unique filename
    const ext = file.name.split('.').pop() || '';
    const timestamp = Date.now();
    let filename = `${timestamp}_${file.name}`; // Default format

    try {
        const result = await client.put(filename, file);

        let url = result.url;
        // Apply custom domain if configured
        if (config.customDomain) {
            let cleanDomain = config.customDomain.replace(/\/$/, '');
            if (!cleanDomain.startsWith('http')) {
                cleanDomain = `https://${cleanDomain}`;
            }
            url = `${cleanDomain}/${result.name}`;
        }

        return { success: true, url, name: result.name };
    } catch (error: any) {
        console.error('OSS Upload Error', error);
        throw new Error(error.message || '上传失败');
    }
};

// 列出阿里云OSS中的图片;
export const listOssImages = async (maxKeys: number = 50, continuationToken?: string) => {
    const client = getOssClient();
    const settingsStore = useSettingsStore();
    const config = settingsStore.ossConfig;

    const options: any = {
        'max-keys': maxKeys
    };
    if (continuationToken) {
        options['continuation-token'] = continuationToken;
    }

    const result = await client.listV2(options);

    const objects = result.objects || [];
    const images = objects.map((obj: any) => {
        let url = obj.url;
        if (!url) {
            url = client.generateObjectUrl(obj.name);
        }
        if (config.customDomain) {
            let cleanDomain = config.customDomain.replace(/\/$/, '');
            if (!cleanDomain.startsWith('http')) {
                cleanDomain = `https://${cleanDomain}`;
            }
            url = `${cleanDomain}/${obj.name}`;
        }
        return {
            name: obj.name,
            url: url,
            lastModified: obj.lastModified,
            size: obj.size
        };
    });

    return {
        images,
        nextContinuationToken: result.nextContinuationToken,
        isTruncated: result.isTruncated
    };
};

// 删除选中的阿里云OSS中的图片;
export const deleteOssImage = async (name: string) => {
    const client = getOssClient();
    await client.delete(name);
};
