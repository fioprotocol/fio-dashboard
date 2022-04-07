import apis from '../';

export const emailAvailable = async (
  email: string,
): Promise<{ error?: string }> => {
  const result: { error?: string } = {};
  try {
    const res = await apis.auth.available(email);

    if (!res) {
      result.error = 'Not available';
    }
  } catch (e) {
    result.error = e.message || 'Not available';
  }
  return result;
};
