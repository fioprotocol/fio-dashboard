import React from 'react';
import TwitterIcon from '@mui/icons-material/Twitter';

import classes from './TweetShare.module.scss';

type Props = {
  text: string;
  url: string;
  hashtags: string[];
  via: string;
  actionText: string;
  userfch: string;
};

const TweetButton: React.FC<Props> = ({
  text,
  url,
  hashtags,
  via,
  actionText,
  userfch,
}) => {
  const generateShareUrl = () => {
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(url);
    const encodedHashtags = encodeURIComponent(hashtags.join(','));

    return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}&hashtags=${encodedHashtags}&via=`;
  };

  return (
    <>
      <div className={classes.tweetShareSection}>
        <p className={classes.tweetShareActionText}>{actionText}</p>
        <div className={classes.tweetShareContainer}>
          <p className={classes.tweetShareText}>
            You can now send me crypto to my {userfch}{' '}
            <span className={classes.blueText}>$FIO</span> Crypto Handle. <br />
            <span className={classes.blueText}>#CRYPTOTWITTER</span> Get yours
            now <br />
            <span className={classes.blueText}>{url}</span>
          </p>
          <hr />
          <div className={classes.tweetShareBottom}>
            <a
              href={generateShareUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={classes.tweetShareButton}
            >
              <TwitterIcon
                fontSize="small"
                className={classes.tweetShareButtonIcon}
              />
              Tweet
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default TweetButton;
