import apis from '../../api/index';

export const fioAddressAvailable = async fioAddress => {
  const result = {};
  try {
    const res = await apis.fio.fioAddressAvailable(fioAddress);
    console.log(res);
    if (!res) {
      result.error = 'Not available';
    }
  } catch (e) {
    console.log(e);
    result.error = e.message;
  }

  return result;
};
