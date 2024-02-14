import url from 'url';

export const getEndpoint = (urlReq: string | undefined) => {
  const urlObj = url.parse(urlReq ?? '', true);
  const pathSegments = urlObj.pathname?.split('/');
  const apiRequestPath = pathSegments?.[2];
  const id = pathSegments?.[3];

  return {
    path: apiRequestPath,
    id
  };
};
