import React from 'react';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import SubmitButton from '../common/SubmitButton/SubmitButton';
import classes from './CreateAccountForm.module.scss';

type State = {
  pageIsActive: boolean;
};

type OwnProps = {
  onNext?: (page: number) => void;
  onPrev: (page: number) => void;
  activePage: number;
  actionDisabled?: boolean;
  loading?: boolean;
  children: React.ReactNode[];
};

type PageProps = {
  children: React.ReactElement;
  bottomText?: string | React.ReactNode;
  hideNext?: boolean;
  hideBack?: boolean;
};

type Props = OwnProps;

export default class Wizard extends React.Component<Props, State> {
  static Page: React.FC<PageProps> = props => props.children;
  state = {
    pageIsActive: true,
  };

  componentDidUpdate(prevProps: Props, prevState: State): void {
    if (prevProps.activePage !== this.props.activePage) {
      // appear animation
      this.setState({ pageIsActive: false }, () =>
        setTimeout(() => this.setState({ pageIsActive: true }), 10),
      );
      window.scrollTo(0, 0);
    }
  }

  next = () =>
    this.props.onNext(
      Math.min(this.props.activePage + 1, this.props.children.length - 1),
    );

  previous = () => this.props.onPrev(Math.max(this.props.activePage - 1, 0));

  render(): React.ReactElement {
    const { activePage, actionDisabled, loading, children } = this.props;
    const { pageIsActive } = this.state;

    const page =
      React.Children.toArray(children)[activePage] ||
      React.Children.toArray(children)[0];
    const isLastPage = activePage === React.Children.count(children) - 1;
    const {
      props: { bottomText, hideNext, hideBack },
    } = page as { props: PageProps };

    return (
      <>
        <div
          className={classnames(
            classes.page,
            pageIsActive ? classes.active : null,
          )}
        >
          {page}
        </div>
        {activePage > 0 && !hideBack && (
          <FontAwesomeIcon
            icon="arrow-left"
            className={classes.arrow}
            onClick={this.previous}
          />
        )}
        {!isLastPage && !hideNext && (
          <SubmitButton
            text="NEXT"
            disabled={loading || actionDisabled}
            loading={loading}
            withTopMargin={true}
            withBottomMargin={true}
          />
        )}
        {bottomText}
      </>
    );
  }
}
