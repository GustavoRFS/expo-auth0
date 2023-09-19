const handleDomainUrl = (url: string) => {
  if (!(url.includes("http://") || url.includes("https://"))) {
    return `https://${url}`;
  }
  return url;
};

export default handleDomainUrl;
