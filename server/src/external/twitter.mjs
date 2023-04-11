import logger from '../logger.mjs';

export const getTwitterHandlePosts = async twitterHandle => {
  try {
    const response = await fetch(
      `https://${process.env.TWITTER_HOST}/user/tweets?username=${twitterHandle}&limit=${process.env.TWITTER_POSTS_LIMIT}&include_replies=false`,
      {
        headers: {
          'X-RapidAPI-Host': process.env.TWITTER_HOST,
          'X-RapidAPI-Key': process.env.TWITTER_RAPID_API_KEY,
        },
      },
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    logger.error(error);
  }
};

export const verifyTwitterHandle = async (fch, twitterHandle) => {
  try {
    const twitterRes = await getTwitterHandlePosts(twitterHandle);

    if (twitterRes.detail && /not found/i.test(twitterRes.detail)) {
      throw new Error(twitterRes.detail);
    }

    if (!twitterRes.results) {
      logger.error(twitterRes);
      throw new Error('No results from twitter response');
    }

    return twitterRes.results.some(tweet => tweet.text.includes(fch));
  } catch (error) {
    logger.error(error);
  }
};
