import React from 'react';
import classnames from 'classnames';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import classes from './CreateAccountForm.module.scss';

type State = {
  pageIsActive: boolean;
};

type OwnProps = {
  onNext?: (page: number) => void;
  onPrev?: (page: number) => void;
  activePage: number;
  actionDisabled?: boolean;
  loading?: boolean;
  children: React.ReactNode[];
};

type PageProps = {
  children: React.FunctionComponent;
  bottomText?: string | React.ReactNode;
  hideNext?: boolean;
  hideBack?: boolean;
};

type Props = OwnProps;

export default class Wizard extends React.Component<Props, State> {
  static Page: React.FunctionComponent<any> = props => props.children;
  state = {
    pageIsActive: true,
  };

  componentDidUpdate(prevProps: Props, prevState: State) {
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

  render() {
    const { activePage, actionDisabled, loading, children } = this.props;
    const { pageIsActive } = this.state;

    const page =
      React.Children.toArray(children)[activePage] ||
      React.Children.toArray(children)[0];
    const isLastPage = activePage === React.Children.count(children) - 1;
    const {
      props: { bottomText, hideNext, hideBack },
    }: { props?: PageProps } = page;

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
          <Button
            type="submit"
            className="w-100"
            disabled={loading || actionDisabled}
          >
            NEXT {loading && <FontAwesomeIcon icon={faSpinner} spin />}
          </Button>
        )}
        {bottomText}
      </>
    );
  }
}
