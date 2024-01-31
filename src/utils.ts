import buildFullPath from './buildFullPath';
import type {
  MergedRequestConfig,
  RawResponse,
  Response,
  TransformedRequestConfig,
} from './types';

declare const wx: any; // 微信小程序
declare const my: any; // 支付宝小程序
declare const dd: any; // 钉钉小程序
declare const tt: any; // 抖音小程序
declare const qq: any; // QQ小程序
declare const swan: any; // 百度小程序

export const isAlipay = typeof my === 'object' && my.request;

export const isDingDing = typeof dd === 'object' && dd.httpRequest;

/**
 * 获取跨平台的 SDK
 */
const getSDK = () => {
  let currentSdk;

  if (typeof wx === 'object') {
    currentSdk = wx;
  } else if (isDingDing) {
    currentSdk = dd;
  } else if (isAlipay) {
    currentSdk = my;
  } else if (typeof tt === 'object') {
    currentSdk = tt;
  } else if (typeof qq === 'object') {
    currentSdk = qq;
  } else if (typeof swan === 'object') {
    currentSdk = swan;
  }

  return currentSdk;
};

export const sdk = getSDK() ?? {
  request() {
    throw Error('platform sdk not found');
  },
  uploadFile() {
    throw Error('platform sdk not found');
  },
  downloadFile() {
    throw Error('platform sdk not found');
  },
};

export function getRequest() {
  if (isDingDing) {
    return sdk.httpRequest.bind(sdk);
  }

  return sdk.request.bind(sdk);
}

export const sdkRequest = getRequest();

export const sdkUpload = sdk.uploadFile.bind(sdk);

export const sdkDownload = sdk.downloadFile.bind(sdk);

export function transformConfig(config: MergedRequestConfig) {
  const { baseURL, url, method } = config;
  const transformedConfig: TransformedRequestConfig = Object.assign(
    {},
    config,
    {
      url: buildFullPath(baseURL, url),
    },
  );

  if (method === 'UPLOAD' && transformedConfig.data) {
    transformedConfig.formData = transformedConfig.data;
  }

  if ((!isAlipay && !isDingDing) || ['DOWNLOAD', 'UPLOAD'].includes(method!)) {
    transformedConfig.header = config.headers;
    delete transformedConfig.headers;
  }

  return transformedConfig;
}

const tryParseJSON = (text: string) => {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export function transformResponse(
  rawResponse: RawResponse,
  config: MergedRequestConfig,
) {
  const response = Object.assign({}, rawResponse, { config });

  if (!response.status && response.statusCode) {
    response.status = response.statusCode;
  }

  if (!response.headers && response.header) {
    response.headers = response.header;
  }

  if (
    response.config.method === 'UPLOAD' &&
    typeof response.data === 'string'
  ) {
    response.data = tryParseJSON(response.data);
  }

  return response as Response;
}
