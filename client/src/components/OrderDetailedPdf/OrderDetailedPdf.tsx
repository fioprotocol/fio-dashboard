import React from 'react';

import { useContext } from './OrderDetailedPdfContext';

import { ROUTES } from '../../constants/routes';
import { getPagePrintScreenDimensions } from '../../util/screen';

import { OrderDetailed, AnyObject } from '../../types';

import colorsToJs from '../../assets/styles/colorsToJs.module.scss';

type DetailsContainerProps = {
  title: string;
  children: React.ReactNode;
  withMarginLeft?: boolean;
  hasFullwidth?: boolean;
};

type Props = {
  orderItem: OrderDetailed;
  isPrint?: boolean;
};

const fioLogoSrc =
  'data: image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjE5NCIgdmlld0JveD0iMCAwIDQwMCAxOTQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMF8zMzg5XzI2ODUpIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yNDkuNDE2IDUyLjAzMjhWMTU3LjE4SDI2NC44ODFWNTIuMDMyOEgyNDkuNDE2Wk0xNTcuNTE2IDgzLjY3OTFDMTU3LjY5MiA4Mi40MjM1IDE1Ny45ODUgODEuMTc5OCAxNTguMzYxIDc5Ljk1OTRDMTU5LjE1OSA3Ny40OTUzIDE2MC41NjcgNzUuMjc3NiAxNjIuNDMyIDczLjQ5NEMxNjMuNDUzIDcyLjUyMDEgMTY0LjU5MSA3MS42NzUzIDE2NS44MTIgNzAuOTgzQzE2Ny4xNjEgNzAuMjMyIDE2OC41NjkgNjkuNjEwMiAxNzAuMDM2IDY5LjE0MDhDMTczLjcwOSA2OC4wMDI2IDE3Ny41MzQgNjcuNDUxMSAxODEuMzcxIDY3LjUyMTVMMjIzLjM1NSA2Ny41NDVWNTIuMDkxNEgxODAuMDY4QzE3NC4wMjUgNTEuOTUwNiAxNjguMDA2IDUyLjg1NDEgMTYyLjI4IDU0Ljc5MDJDMTU5Ljk2OCA1NS42NDY4IDE1Ny43NTEgNTYuNzI2MyAxNTUuNjYyIDU4LjAyODhDMTUxLjkwNyA2MC4zNTIxIDE0OC43ODYgNjMuNTQzNyAxNDYuNTU2IDY3LjMyMkMxNDUuNDQyIDY5LjIyMjkgMTQ0LjUzOCA3MS4yMjk0IDE0My44ODEgNzMuMzI5OEMxNDIuNDM4IDc4LjA0NjggMTQxLjczNCA4Mi45NjMzIDE0MS43OTIgODcuODkxNlYxNTcuMThIMTU3LjI0NlYxMTQuMjExSDIyMi43MDlWOTkuNzMxSDE1Ny4yMTFWODcuNjY4NkMxNTcuMjExIDg2LjMzMSAxNTcuMzE2IDg1LjAwNSAxNTcuNTE2IDgzLjY3OTFaIiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMzk2Ljk0NiA4MS4zNjc1QzM5NS4xOTggNzUuMzAxIDM5Mi4xIDY5LjcxNTcgMzg3Ljg2NCA2NS4wNDU2SDM4Ny44MjlDMzc5Ljc2OCA1Ni40MjEyIDM2OC4wNDUgNTIuMTE0OSAzNTIuNjYyIDUyLjExNDlIMzM3Ljg2NkMzMzAuOTE5IDUxLjk2MjMgMzI0LjAwOCA1My4wNjUzIDMxNy40NDkgNTUuMzQxN0MzMTEuODI4IDU3LjM3MTcgMzA2Ljc4MyA2MC42OTIzIDMwMi42OTkgNjUuMDQ1NkMyOTQuNTkxIDczLjY3IDI5MC41NDMgODYuOTUyOCAyOTAuNTQzIDEwNC44ODJDMjkwLjU0MyAxMjIuODEyIDI5NC41OTEgMTM1Ljk2NSAzMDIuNjk5IDE0NC4zNzlDMzA2Ljc5NCAxNDguNjg1IDMxMS44NTIgMTUxLjk3IDMxNy40NDkgMTUzLjk1M0MzMjQuMDA4IDE1Ni4yMyAzMzAuOTE5IDE1Ny4zMjEgMzM3Ljg2NiAxNTcuMTkySDM1Mi42NjJDMzU5LjYwOSAxNTcuMzIxIDM2Ni41MiAxNTYuMjMgMzczLjA3OSAxNTMuOTUzQzM3OC42NzYgMTUxLjk3IDM4My43MzQgMTQ4LjY4NSAzODcuODI5IDE0NC4zNzlDMzkyLjA3NiAxMzkuNzY3IDM5NS4xODYgMTM0LjIyOSAzOTYuOTExIDEyOC4yMDlDMzk5LjA5MyAxMjAuNjE3IDQwMC4xMjYgMTEyLjc1NiAzOTkuOTg1IDEwNC44NTlDNDAwLjEzOCA5Ni45MjY2IDM5OS4xMTcgODkuMDA2MiAzOTYuOTQ2IDgxLjM2NzVaTTM4Mi41OTUgMTIxLjIyN0MzODEuNTg2IDEyNS40ODcgMzc5LjYyNyAxMjkuNDUzIDM3Ni44NDYgMTMyLjgzMkMzNzEuNzE4IDEzOC43NTggMzYzLjY4IDE0MS43MTUgMzUyLjc0NCAxNDEuNzI3SDMzNy45NDhDMzMzLjA5IDE0MS44MzIgMzI4LjI1NiAxNDEuMTA1IDMyMy42NDQgMTM5LjU3OUMzMTkuNzYgMTM4LjI3NyAzMTYuMjk5IDEzNS45NjUgMzEzLjYgMTMyLjkxNEMzMTAuODY2IDEyOS41NDcgMzA4Ljk0MiAxMjUuNTkyIDMwNy45NjggMTIxLjM4QzMwNi42NTQgMTE1Ljk4MiAzMDYuMDIgMTEwLjQzMiAzMDYuMTI2IDEwNC44ODJDMzA2LjEyNiA5MS45Mjc5IDMwOC42NiA4Mi40ODIyIDMxMy43MjkgNzYuNTMzMUMzMTYuNDA0IDczLjQzNTQgMzE5Ljg1NCA3MS4xMDAzIDMyMy43MjYgNjkuNzUwOUMzMjguMzAzIDY4LjE5MDMgMzMzLjAzMSA2Ny40MzkzIDMzNy44NjYgNjcuNTQ0OUgzNTIuNjYyQzM1Ny40ODUgNjcuNDM5MyAzNjIuMjk2IDY4LjE5MDMgMzY2Ljg2IDY5Ljc1MDlDMzcwLjc0NCA3MS4wODg1IDM3NC4xOTQgNzMuNDM1NCAzNzYuODU4IDc2LjU0NDlDMzc5LjYwMyA3OS45NTk0IDM4MS41MzkgODMuOTI1NSAzODIuNTI1IDg4LjE4NDlDMzgzLjgzOSA5My41OTQyIDM4NC40NzMgOTkuMTQ0MyAzODQuMzY3IDEwNC43MThDMzg0LjQ4NSAxMTAuMjY4IDM4My44ODYgMTE1LjgzIDM4Mi41OTUgMTIxLjIyN1oiIGZpbGw9IiNGRkZGRkYiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik00Ni4zMDIgMTI0LjkyNFYxODkuNjEzQzQ2LjMwMiAxOTMuMDUxIDQ0LjE0MyAxOTQuNjkzIDQxLjQ3OTQgMTkzLjIzOEw0Ljg4MTM4IDE3My4xNzNDMS45MjQ0NCAxNzEuMTc5IDAuMTE3NDE2IDE2Ny44NTggMC4wMzUyNzgzIDE2NC4yOTFWMTAxLjA2OUMwLjU3NTAzOCAxMDEuNTAzIDEuMTM4MjYgMTAxLjg3OCAxLjczNjY5IDEwMi4yMDdMNDYuMzAyIDEyNC45MjRaIiBmaWxsPSIjNzY1Q0Q2Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMC4wMzUyMDE3IDQ2LjA4MzhWNDguNTU5NkMtMC4wMTE3MzM5IDQ3LjY1NjEgLTAuMDExNzMzOSA0Ni44MzQ3IDAuMDM1MjAxNyA0Ni4wODM4WiIgZmlsbD0iIzc2NUNENiIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTgxLjU4NTggMy40MTkzM1Y0OS4yMDQ5QzgxLjUyNzEgNTIuMTAzMiA4MC4wMDE3IDU0Ljc5MDMgNzcuNTYxMSA1Ni4zMzkyTDU1LjE5NjMgNjcuODAzMkg1NS4xODQ1TDQuMDk1MTQgNDEuNjI0OUM0LjAyNDc0IDQxLjU3OCAzLjk1NDM0IDQxLjU0MjcgMy44ODM5MyA0MS41MDc1QzMuNjk2MTkgNDEuNDEzNiAzLjUwODQ1IDQxLjM1NSAzLjMyMDcgNDEuMjk2M0MzLjE5MTYzIDQxLjI3MjggMy4wNjI1NiA0MS4yMzc2IDIuOTQ1MjIgNDEuMjI1OUMyLjgyNzg4IDQxLjIwMjQgMi43MTA1NCA0MS4yMDI1IDIuNTkzMiA0MS4yMDI1QzIuMjQxMTkgNDEuMjE0MiAxLjkwMDkgNDEuMjk2MyAxLjU4NDA5IDQxLjQzNzFDMS40Nzg0OCA0MS40OTU4IDEuMzcyODggNDEuNTQyNyAxLjI3OTAxIDQxLjYxMzFDMS4yNzkwMSA0MS42MTMxIDEuMjc5MDEgNDEuNjI0OSAxLjI1NTU0IDQxLjYyNDlMMS4yMjAzNCA0MS42NjAxQzIuNjk4ODEgMzguOTczIDUuNTczNjEgMzcuNDI0MSA5Ljg1NjQ5IDM1LjEyNDNMNzcuNTYxMSAwLjQwMzcwNUM3OS43NjcxIC0wLjcyMjc0OSA4MS41ODU4IDAuNTc5NzIyIDgxLjU4NTggMy40MTkzM1oiIGZpbGw9IiM3NjVDRDYiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik04MS41ODU3IDg2LjQyNDhWMTMyLjE4N0M4MS41ODU3IDEzNS4wMjcgNzkuNzY3IDEzNi4zNTIgNzcuNTYxIDEzNS4yMjZMNC4wOTUwNCA5Ny41NDg1QzIuNDI4ODMgOTYuNTA0MiAxLjE5Njc3IDk0LjkzMTkgMC41Mzk2NzMgOTMuMTI0OEMwLjU5ODM0MiA5My4yMTg3IDAuNjQ1Mjc4IDkzLjMxMjYgMC43MTU2ODEgOTMuMzk0N0MwLjc2MjYxNyA5My40NTM0IDAuODA5NTUyIDkzLjUxMiAwLjg2ODIyMiA5My41NzA3QzAuODc5OTU2IDkzLjU5NDEgMC44OTE2OSA5My42MDU5IDAuOTE1MTU4IDkzLjYyOTRDMC45NjIwOTMgOTMuNjc2MyAxLjAwOTAzIDkzLjczNSAxLjA2NzcgOTMuNzgxOUMxLjEyNjM3IDkzLjg1MjMgMS4xOTY3NyA5My44OTkyIDEuMjY3MTcgOTMuOTU3OUMxLjM3Mjc4IDk0LjAyODMgMS40NjY2NSA5NC4wOTg4IDEuNTgzOTkgOTQuMTQ1N0MyLjI3NjI5IDk0LjUwOTQgMy4xNTYzMyA5NC40ODYgNC4wOTUwNCA5NC4wMDQ5TDU1LjE4NDQgNjcuODE0OEg1NS4xOTYyTDc3LjU2MSA3OS4yNjcxQzgwLjAxMzQgODAuODI3NyA4MS41MjcgODMuNTE0OCA4MS41ODU3IDg2LjQyNDhaIiBmaWxsPSIjQTA4QUVFIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNTUuMTg0NiA2Ny44MTQ5TDQuMDk1MjEgOTQuMDA1QzMuMTU2NSA5NC40ODYgMi4yNzY0NSA5NC41MDk1IDEuNTg0MTUgOTQuMTQ1OEMxLjQ2NjgxIDk0LjA5ODggMS4zNzI5NCA5NC4wMjg0IDEuMjY3MzQgOTMuOTU4QzEuMTk2OTMgOTMuODk5MyAxLjEyNjUzIDkzLjg1MjQgMS4wNjc4NiA5My43ODJDMS4wMDkxOSA5My43MzUxIDAuOTYyMjU2IDkzLjY3NjQgMC45MTUzMjEgOTMuNjI5NUMwLjg5MTg1MyA5My42MDYgMC44ODAxMTkgOTMuNTk0MiAwLjg2ODM4NSA5My41NzA3QzAuODA5NzE2IDkzLjUxMjEgMC43NjI3OCA5My40NTM0IDAuNzE1ODQ0IDkzLjM5NDhDMC42NDU0NDEgOTMuMzEyNiAwLjU5ODUwNSA5My4yMTg4IDAuNTM5ODM2IDkzLjEyNDlDMC4yMjMwMjEgOTIuNTYxNyAwLjAzNTI3ODMgOTEuODM0MiAwLjAzNTI3ODMgOTAuOTg5M1Y0NC42Mjg3QzAuMDM1Mjc4MyA0My4yNDQxIDAuNDkyOSA0Mi4yMTE1IDEuMjIwNCA0MS42NkMxLjIzMjE0IDQxLjY0ODMgMS4yNDM4NyA0MS42MzY2IDEuMjU1NiA0MS42MzY2QzEuMjU1NiA0MS42MzY2IDEuMjY3MzQgNDEuNjEzMSAxLjI3OTA3IDQxLjYxMzFDMS4zNzI5NCA0MS41NDI3IDEuNDc4NTUgNDEuNDk1NyAxLjU4NDE1IDQxLjQzN0MxLjkwMDk3IDQxLjI5NjIgMi4yNDEyNSA0MS4yMTQyIDIuNTkzMjcgNDEuMjAyNEMyLjcxMDYxIDQxLjIwMjQgMi44Mjc5NSA0MS4yMDI0IDIuOTQ1MjkgNDEuMjI1OEMzLjA2MjYyIDQxLjIzNzYgMy4xOTE3IDQxLjI3MjggMy4zMjA3NyA0MS4yOTYyQzMuNTA4NTEgNDEuMzU0OSAzLjY5NjI1IDQxLjQxMzYgMy44ODQgNDEuNTA3NEMzLjk1NDQgNDEuNTQyNiA0LjAyNDggNDEuNTc3OSA0LjA5NTIxIDQxLjYyNDhMNTUuMTg0NiA2Ny44MTQ5WiIgZmlsbD0iIzhCNzNFMiIvPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzMzODlfMjY4NSI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMTk0IiBmaWxsPSJ3aGl0ZSIvPgo8L2NsaXBQYXRoPgo8L2RlZnM+Cjwvc3ZnPgo=';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    fontFamily: 'Proxima Nova Regular',
    fontSize: '16px',
    backgroundColor: colorsToJs['white'],
  },
  header: {
    display: 'flex',
    justifyContent: 'spaceBetween',
    background: colorsToJs['main-background'],
    boxShadow: '0 6px 4px -2px rgb(0 0 0 / 20%)',
    padding: '5px 25px',
    height: '80px',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '76px',
    height: 'auto',
  },
  orderContainer: {
    padding: '50px 70px',
    color: colorsToJs['baltic-sea'],
  },
  title: {
    marginTop: '15px',
    marginBottom: '15px',
    fontFamily: 'Proxima Nova Semibold',
    fontSize: '1.125rem',
  },
  subtitle: {
    marginTop: '0',
    marginBottom: '0',
    fontSize: '0.875rem',
    fontFamily: 'Proxima Nova Thin',
  },
  details: {
    marginTop: '30px',
    display: 'flex',
    flexDirection: 'row' as const,
    width: '100%',
    color: colorsToJs['black-cow'],
  },
  detailsWithMarginBottom: {
    marginBottom: '30px',
  },
  detailedContainer: {
    padding: '35px 30px 30px 30px',
    backgroundColor: colorsToJs['bianca'],
    borderRadius: '10px',
    width: '555px',
  },
  detailedContainerFullWidth: {
    width: '1135px',
  },
  detailedContainerWithMarginLeft: {
    marginLeft: '25px',
  },
  detailedTitle: {
    width: '100%',
    borderBottom: `1.5px solid ${colorsToJs['black-cow']}`,
    paddingBottom: '1rem',
    margin: '0',
    fontSize: '1.125rem',
    fontFamily: 'Proxima Nova Semibold',
  },
  detailedItem: {
    width: '100%',
    padding: '1rem 0',
    borderBottom: `0.5px solid ${colorsToJs['black-cow']}`,
    display: 'flex',
    justifyContent: 'space-between',
  },
  detailedItemLast: {
    borderBottom: '0',
    padding: '1rem 0 0 0',
  },
  type: {
    flexBasis: '20%',
  },
  description: {
    flexBasis: '34%',
    WordBreak: 'break-word',
  },
  debit: {
    flexBasis: '20%',
  },
  credit: {
    flexBasis: '20%',
  },
  link: {
    display: 'block',
    paddingTop: '30px',
    marginTop: '30px',
    borderTop: `1px solid ${colorsToJs['silver']}`,
  },
  detailedWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  detailedItemContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row' as const,
    justifyContent: 'space-between',
  },
  txIdContainer: {
    marginTop: '15px',
    display: 'flex',
    flexDirection: 'row' as const,
    width: '100%',
    justifyContent: 'space-between',
  },
  txIdTitle: {
    flexBasis: '20%',
  },
  txIdLink: {
    flexBasis: '78%',
    display: 'inline-block',
    WordBreak: 'break-all',
  },
};

const isLastChild = (arr: AnyObject[], index: number) =>
  arr.length === index + 1;

const DetailsContainer: React.FC<DetailsContainerProps> = props => {
  const { title, children, withMarginLeft, hasFullwidth } = props;
  let detailedContainerStyle = styles.detailedContainer;

  if (withMarginLeft) {
    detailedContainerStyle = {
      ...detailedContainerStyle,
      ...styles.detailedContainerWithMarginLeft,
    };
  }

  if (hasFullwidth) {
    detailedContainerStyle = {
      ...detailedContainerStyle,
      ...styles.detailedContainerFullWidth,
    };
  }

  return (
    <div style={detailedContainerStyle}>
      <div style={styles.detailedTitle}>{title}</div>
      {children}
    </div>
  );
};

export const OrderDetailedPdf: React.FC<Props> = props => {
  const { orderItem, isPrint } = props;
  const { orderDetails, paymentDetails, transactionDetails } = useContext(
    orderItem,
  );

  const termsLink = `${window.location.origin}${ROUTES.TERMS_OF_SERVICE}`;
  const siteLink = `${window.location.origin}`;

  return (
    <div
      style={{
        ...styles.container,
        width: getPagePrintScreenDimensions({ isPrint }).width,
        height: getPagePrintScreenDimensions({ isPrint }).height,
      }}
    >
      <div style={styles.header}>
        <div style={styles.logoContainer}>
          <a href={siteLink}>
            <img src={fioLogoSrc} alt="fio-logo" style={styles.logo} />
          </a>
        </div>
      </div>
      <div style={styles.orderContainer}>
        <div style={styles.title}>My Order</div>
        <p style={styles.subtitle}>
          Please find your order information listed below.
        </p>
        <div style={styles.details}>
          <DetailsContainer title={orderDetails.title}>
            {orderDetails.items.map((item, i) => {
              let detailedStyles = styles.detailedItem;
              if (isLastChild(orderDetails.items, i)) {
                detailedStyles = {
                  ...detailedStyles,
                  ...styles.detailedItemLast,
                };
              }

              return (
                <div style={detailedStyles} key={item.value}>
                  <div>{item.title}</div>
                  <div>{item.value}</div>
                </div>
              );
            })}
          </DetailsContainer>
          <DetailsContainer title={paymentDetails.title} withMarginLeft={true}>
            {paymentDetails.items.map((item, i) => {
              let detailedStyles = styles.detailedItem;
              if (isLastChild(paymentDetails.items, i)) {
                detailedStyles = {
                  ...detailedStyles,
                  ...styles.detailedItemLast,
                };
              }
              return (
                <div style={detailedStyles} key={item.value}>
                  <div>{item.title}</div>
                  <div>{item.value}</div>
                </div>
              );
            })}
          </DetailsContainer>
        </div>
        <div style={{ ...styles.details, ...styles.detailsWithMarginBottom }}>
          <DetailsContainer
            title={transactionDetails.title}
            hasFullwidth={true}
          >
            <div style={styles.detailedItem}>
              <div style={styles.type}>Type</div>
              <div style={styles.description}>Description</div>
              <div style={styles.debit}>Debit</div>
              <div style={styles.credit}>Credit</div>
            </div>
            {transactionDetails.regItems &&
              transactionDetails.regItems.map((item, i) => {
                let detailedStyles = styles.detailedItem;
                if (isLastChild(transactionDetails.regItems, i)) {
                  detailedStyles = {
                    ...detailedStyles,
                    ...styles.detailedItemLast,
                  };
                }
                return (
                  <div style={detailedStyles} key={item.description}>
                    <div style={styles.detailedWrapper}>
                      <div style={styles.detailedItemContainer}>
                        <div style={styles.type}>{item.type}</div>
                        <div style={styles.description}>{item.description}</div>
                        <div style={styles.debit}>{item.debit}</div>
                        <div style={styles.credit}>{item.credit}</div>
                      </div>
                      {item.txIds?.length > 0 &&
                        item.txIds.map(txId => (
                          <div key={txId} style={styles.txIdContainer}>
                            <div style={styles.txIdTitle}>Transaction ID</div>
                            <a
                              href={`${process.env.REACT_APP_FIO_BLOCKS_TX_URL}${txId}`}
                              target="_blank"
                              rel="noreferrer"
                              style={styles.txIdLink}
                            >
                              {`${process.env.REACT_APP_FIO_BLOCKS_TX_URL}${txId}`}
                            </a>
                          </div>
                        ))}
                    </div>
                  </div>
                );
              })}
          </DetailsContainer>
        </div>
        <a
          href={termsLink}
          target="_blank"
          rel="noopener noreferrer"
          style={styles.link}
        >
          Terms of Service ({termsLink})
        </a>
      </div>
    </div>
  );
};
