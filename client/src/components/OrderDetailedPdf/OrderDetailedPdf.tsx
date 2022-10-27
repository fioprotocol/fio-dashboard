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
  'data: image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNDk3cHgiIGhlaWdodD0iMjQycHgiIHZpZXdCb3g9IjAgMCA0OTcgMjQyIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA2MiAoOTEzOTApIC0gaHR0cHM6Ly9za2V0Y2guY29tIC0tPgogICAgPHRpdGxlPkxvZ28vQ29sb3IvRGFyazwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPgogICAgICAgIDxwb2x5Z29uIGlkPSJwYXRoLTEiIHBvaW50cz0iMC4wMDAzNzY5ODk5MzQgMC42Mzc5MzEwMzQgMTAxLjM2ODEwMyAwLjYzNzkzMTAzNCAxMDEuMzY4MTAzIDExNy45MTA1OTQgMC4wMDAzNzY5ODk5MzQgMTE3LjkxMDU5NCI+PC9wb2x5Z29uPgogICAgPC9kZWZzPgogICAgPGcgaWQ9IkxvZ28vQ29sb3IvRGFyayIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9Ikdyb3VwLTEyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjAwMDAwMCwgLTEuMDAwMDAwKSI+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik00MDIuMDk4Mjc2LDg4LjI5MjI0MTQgQzQwNy43NzkzMSw4Ni4zNTI1ODYyIDQxMy43NjIwNjksODUuNDIxNTUxNyA0MTkuNzYyMDY5LDg1LjU0MjI0MTQgTDQzOC4xNTg2MjEsODUuNTQyMjQxNCBDNDQ0LjE1LDg1LjQxMjkzMSA0NTAuMTI0MTM4LDg2LjM0Mzk2NTUgNDU1Ljc5NjU1Miw4OC4yOTIyNDE0IEM0NjAuNjI0MTM4LDg5Ljk0NzQxMzggNDY0LjkwODYyMSw5Mi44NjEyMDY5IDQ2OC4yMTg5NjYsOTYuNzMxODk2NiBDNDcxLjYyNDEzOCwxMDAuOTY0NjU1IDQ3NC4wMjkzMSwxMDUuODk1NjkgNDc1LjI1MzQ0OCwxMTEuMTg4NzkzIEM0NzYuODkxMzc5LDExNy45MDQzMSA0NzcuNjY3MjQxLDEyNC44MDk0ODMgNDc3LjU0NjU1MiwxMzEuNzIzMjc2IEM0NzcuNjkzMTAzLDEzOC42Mjg0NDggNDc2Ljk1MTcyNCwxNDUuNTMzNjIxIDQ3NS4zMzk2NTUsMTUyLjI0OTEzOCBDNDc0LjA4OTY1NSwxNTcuNTMzNjIxIDQ3MS42NSwxNjIuNDY0NjU1IDQ2OC4yMDE3MjQsMTY2LjY1NDMxIEM0NjEuODIyNDE0LDE3NC4wMTYzNzkgNDUxLjg0ODI3NiwxNzcuNjk3NDE0IDQzOC4yNTM0NDgsMTc3LjcxNDY1NSBMNDE5Ljg2NTUxNywxNzcuNzE0NjU1IEM0MTMuODMxMDM0LDE3Ny44NDM5NjYgNDA3LjgyMjQxNCwxNzYuOTM4NzkzIDQwMi4wOTgyNzYsMTc1LjA0MjI0MSBDMzk3LjI3OTMxLDE3My40MjE1NTIgMzkyLjk3NzU4NiwxNzAuNTU5NDgzIDM4OS42MTU1MTcsMTY2Ljc1Nzc1OSBDMzg2LjIyNzU4NiwxNjIuNTc2NzI0IDM4My44MzEwMzQsMTU3LjY3MTU1MiAzODIuNjI0MTM4LDE1Mi40MzAxNzIgQzM4MC45ODYyMDcsMTQ1LjcyMzI3NiAzODAuMjEwMzQ1LDEzOC44MjY3MjQgMzgwLjMzMTAzNCwxMzEuOTMwMTcyIEMzODAuMzMxMDM0LDExNS44NDM5NjYgMzgzLjQ3NzU4NiwxMDQuMTExMjA3IDM4OS43NzkzMSw5Ni43MTQ2NTUyIEMzOTMuMTA2ODk3LDkyLjg2MTIwNjkgMzk3LjM5MTM3OSw4OS45NTYwMzQ1IDQwMi4yMDE3MjQsODguMjkyMjQxNCBMNDAyLjA5ODI3Niw4OC4yOTIyNDE0IFogTTQ4MS44NDgyNzYsODIuNDQ3NDEzOCBDNDcxLjgyMjQxNCw3MS43MjMyNzU5IDQ1Ny4yNjIwNjksNjYuMzY5ODI3NiA0MzguMTU4NjIxLDY2LjM2OTgyNzYgTDQxOS43NjIwNjksNjYuMzY5ODI3NiBDNDExLjE0MTM3OSw2Ni4xODg3OTMxIDQwMi41NDY1NTIsNjcuNTUwODYyMSAzOTQuNCw3MC4zODcwNjkgQzM4Ny40MjU4NjIsNzIuOTA0MzEwMyAzODEuMTUsNzcuMDMzNjIwNyAzNzYuMDcyNDE0LDgyLjQ0NzQxMzggQzM2Ni4wMDM0NDgsOTMuMTYyOTMxIDM2MC45Nzc1ODYsMTA5LjY2MjkzMSAzNjAuOTc3NTg2LDEzMS45MzAxNzIgQzM2MC45Nzc1ODYsMTU0LjE5NzQxNCAzNjYuMDAzNDQ4LDE3MC41NTA4NjIgMzc2LjA3MjQxNCwxODEuMDA3NzU5IEMzODEuMTU4NjIxLDE4Ni4zNjEyMDcgMzg3LjQ0MzEwMywxOTAuNDM4NzkzIDM5NC40LDE5Mi45MDQzMSBDNDAyLjU1NTE3MiwxOTUuNzIzMjc2IDQxMS4xNDEzNzksMTk3LjA4NTM0NSA0MTkuNzYyMDY5LDE5Ni45MzAxNzIgTDQzOC4xNTg2MjEsMTk2LjkzMDE3MiBDNDQ2Ljc3OTMxLDE5Ny4wODUzNDUgNDU1LjM2NTUxNywxOTUuNzIzMjc2IDQ2My41MjA2OSwxOTIuOTA0MzEgQzQ3MC40Nzc1ODYsMTkwLjQzODc5MyA0NzYuNzYyMDY5LDE4Ni4zNjEyMDcgNDgxLjg0ODI3NiwxODEuMDA3NzU5IEM0ODcuMTE1NTE3LDE3NS4yNzUgNDkwLjk4NjIwNywxNjguMzk1NjkgNDkzLjEyNDEzOCwxNjAuOTEyOTMxIEM0OTUuODM5NjU1LDE1MS40OTA1MTcgNDk3LjEyNDEzOCwxNDEuNzE0NjU1IDQ5Ni45NDMxMDMsMTMxLjkwNDMxIEM0OTcuMTMyNzU5LDEyMi4wNTA4NjIgNDk1Ljg2NTUxNywxMTIuMjA2MDM0IDQ5My4xNjcyNDEsMTAyLjcyMzI3NiBDNDkxLjAwMzQ0OCw5NS4xODg3OTMxIDQ4Ny4xNSw4OC4yNDkxMzc5IDQ4MS44OTEzNzksODIuNDQ3NDEzOCBMNDgxLjg0ODI3Niw4Mi40NDc0MTM4IFogTTMwOS44ODI3NTksMTk2LjkwNDMxIEwzMjkuMDk4Mjc2LDE5Ni45MDQzMSBMMzI5LjA5ODI3Niw2Ni4yNjYzNzkzIEwzMDkuODgyNzU5LDY2LjI2NjM3OTMgTDMwOS44ODI3NTksMTk2LjkwNDMxIFogTTI3Ny41MDM0NDgsODUuNTQyMjQxNCBMMjc3LjUwMzQ0OCw2Ni4zNDM5NjU1IEwyMjMuNzE4OTY2LDY2LjM0Mzk2NTUgQzIxNi4yMTg5NjYsNjYuMTcxNTUxNyAyMDguNzI3NTg2LDY3LjMwMDg2MjEgMjAxLjYxNTUxNyw2OS42OTc0MTM4IEMxOTguNzQ0ODI4LDcwLjc1Nzc1ODYgMTk1Ljk4NjIwNyw3Mi4xMDI1ODYyIDE5My4zOTEzNzksNzMuNzIzMjc1OSBDMTg4LjczNjIwNyw3Ni42MDI1ODYyIDE4NC44NTY4OTcsODAuNTY4MTAzNCAxODIuMDgxMDM0LDg1LjI3NSBDMTgwLjY5MzEwMyw4Ny42Mjg0NDgzIDE3OS41ODEwMzQsOTAuMTI4NDQ4MyAxNzguNzYyMDY5LDkyLjczMTg5NjYgQzE3Ni45Njg5NjYsOTguNTkzOTY1NSAxNzYuMDg5NjU1LDEwNC42OTc0MTQgMTc2LjE2NzI0MSwxMTAuODI2NzI0IEwxNzYuMTY3MjQxLDE5Ni45MDQzMSBMMTk1LjM2NTUxNywxOTYuOTA0MzEgTDE5NS4zNjU1MTcsMTQzLjUyNSBMMjc2LjcwMTcyNCwxNDMuNTI1IEwyNzYuNzAxNzI0LDEyNS41MzM2MjEgTDE5NS4zMjI0MTQsMTI1LjUzMzYyMSBMMTk1LjMyMjQxNCwxMTAuNTQyMjQxIEMxOTUuMzIyNDE0LDEwOC44ODcwNjkgMTk1LjQ1MTcyNCwxMDcuMjMxODk3IDE5NS43MDE3MjQsMTA1LjU5Mzk2NiBDMTk1LjkyNTg2MiwxMDQuMDMzNjIxIDE5Ni4yNzkzMSwxMDIuNDgxODk3IDE5Ni43NDQ4MjgsMTAwLjk3MzI3NiBDMTk3LjczNjIwNyw5Ny45MTI5MzEgMTk5LjQ4NjIwNyw5NS4xNTQzMTAzIDIwMS44MTM3OTMsOTIuOTM4NzkzMSBDMjAzLjA4MTAzNCw5MS43MjMyNzU5IDIwNC40ODYyMDcsOTAuNjgwMTcyNCAyMDYuMDEyMDY5LDg5LjgxODEwMzQgQzIwNy42ODQ0ODMsODguODc4NDQ4MyAyMDkuNDM0NDgzLDg4LjExMTIwNjkgMjExLjI2MjA2OSw4Ny41MzM2MjA3IEMyMTUuODEzNzkzLDg2LjExMTIwNjkgMjIwLjU2Mzc5Myw4NS40MzAxNzI0IDIyNS4zMzEwMzQsODUuNTE2Mzc5MyBMMjc3LjUwMzQ0OCw4NS41NDIyNDE0IFoiIGlkPSJGaWxsLTEiIGZpbGw9IiNGRkZGRkYiPjwvcGF0aD4KICAgICAgICAgICAgPHBhdGggZD0iTTU3LjUyNzU4NjIsMTU2LjgxOTgyOCBMNTcuNTI3NTg2MiwyMzcuMTk5MTM4IEM1Ny41Mjc1ODYyLDI0MS40NjYzNzkgNTQuODQ2NTUxNywyNDMuNTA5NDgzIDUxLjUzNjIwNjksMjQxLjcwNzc1OSBMNi4wNzA2ODk2NiwyMTYuNzc2NzI0IEMyLjM4OTY1NTE3LDIxNC4yOTM5NjYgMC4xNDgyNzU4NjIsMjEwLjE3MzI3NiAwLjA0NDgyNzU4NjIsMjA1LjczMzYyMSBMMC4wNDQ4Mjc1ODYyLDEyNy4xOTA1MTcgQzAuNzA4NjIwNjksMTI3LjcyNSAxLjQxNTUxNzI0LDEyOC4xOTA1MTcgMi4xNTY4OTY1NSwxMjguNjA0MzEgTDU3LjUyNzU4NjIsMTU2LjgxOTgyOCBaIiBpZD0iRmlsbC0zIiBmaWxsPSIjNDI1Q0M3Ij48L3BhdGg+CiAgICAgICAgICAgIDxnIGlkPSJHcm91cC03IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjAwMDAwMCwgMC45ODUzNDUpIj4KICAgICAgICAgICAgICAgIDxtYXNrIGlkPSJtYXNrLTIiIGZpbGw9IndoaXRlIj4KICAgICAgICAgICAgICAgICAgICA8dXNlIHhsaW5rOmhyZWY9IiNwYXRoLTEiPjwvdXNlPgogICAgICAgICAgICAgICAgPC9tYXNrPgogICAgICAgICAgICAgICAgPGcgaWQ9IkNsaXAtNiI+PC9nPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTUuMDgzNjIwNjksMTE3LjQyNSBMOTYuMzU5NDgyOCw3MC42MjMyNzU5IEM5OS40MDI1ODYyLDY4LjcwMDg2MjEgMTAxLjI5MDUxNyw2NS4zNzMyNzU5IDEwMS4zNjgxMDMsNjEuNzY5ODI3NiBMMTAxLjM2ODEwMyw0Ljg4MTg5NjU1IEMxMDEuMzY4MTAzLDEuMzU2MDM0NDggOTkuMTA5NDgyOCwtMC4yNjQ2NTUxNzIgOTYuMzU5NDgyOCwxLjE0MDUxNzI0IEwxMi4yNDc0MTM4LDQ0LjI3ODQ0ODMgQzMuNTY2Mzc5MzEsNDguOTMzNjIwNyAtMC40NTA4NjIwNjksNTEuMTIzMjc1OSAwLjA0MDUxNzI0MTQsNjAuOTU5NDgyOCBMMC4wNDA1MTcyNDE0LDExMy42ODM2MjEgQzAuMDQwNTE3MjQxNCwxMTcuMDM3MDY5IDIuMzMzNjIwNjksMTE4LjgzODc5MyA1LjA4MzYyMDY5LDExNy40MjUiIGlkPSJGaWxsLTUiIGZpbGw9IiMwMDVDQjkiIG1hc2s9InVybCgjbWFzay0yKSI+PC9wYXRoPgogICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik01LjA4MzYyMDY5LDUzLjMwNDMxMDMgTDk2LjM1OTQ4MjgsMTAwLjEwNjAzNCBDOTkuNDExMjA2OSwxMDIuMDQ1NjkgMTAxLjI5MDUxNywxMDUuMzgxODk3IDEwMS4zNjgxMDMsMTA4Ljk5Mzk2NiBMMTAxLjM2ODEwMywxNjUuODQ3NDE0IEMxMDEuMzY4MTAzLDE2OS4zNzMyNzYgOTkuMTA5NDgyOCwxNzEuMDI4NDQ4IDk2LjM1OTQ4MjgsMTY5LjYyMzI3NiBMNS4wODM2MjA2OSwxMjIuODEyOTMxIEMyLjAyMzI3NTg2LDEyMC44OTA1MTcgMC4xMjY3MjQxMzgsMTE3LjU1NDMxIDAuMDQwNTE3MjQxNCwxMTMuOTMzNjIxIEwwLjA0MDUxNzI0MTQsNTcuMDcxNTUxNyBDMC4wNDA1MTcyNDE0LDUzLjU4ODc5MzEgMi4zMzM2MjA2OSw1MS44OTA1MTcyIDUuMDgzNjIwNjksNTMuMzA0MzEwMyIgaWQ9IkZpbGwtOCIgZmlsbD0iIzNDQjRFNSI+PC9wYXRoPgogICAgICAgICAgICA8cGF0aCBkPSJNNS4wODM2MjA2OSwxMTguNDEwMzQ1IEw2OC41NjYzNzkzLDg1Ljg1ODYyMDcgTDUuMDgzNjIwNjksNTMuMzA2ODk2NiBDNC4wMTQ2NTUxNyw1Mi42IDIuNjI2NzI0MTQsNTIuNiAxLjU1Nzc1ODYyLDUzLjMwNjg5NjYgQzAuNjM1MzQ0ODI4LDU0Ljk5NjU1MTcgMC4xMTgxMDM0NDgsNTYuODc1ODYyMSAwLjA0MDUxNzI0MTQsNTguODA2ODk2NiBMMC4wNDA1MTcyNDE0LDExMy45Mjc1ODYgQzAuMDc1LDExNS4xNDMxMDMgMC4zMjUsMTE2LjMzMjc1OSAwLjc4MTg5NjU1MiwxMTcuNDYyMDY5IEMxLjYxODEwMzQ1LDExOC44OTMxMDMgMy40NTQzMTAzNCwxMTkuMzc1ODYyIDQuODg1MzQ0ODMsMTE4LjUzOTY1NSBDNC45NDU2ODk2NiwxMTguNDk2NTUyIDUuMDE0NjU1MTcsMTE4LjQ1MzQ0OCA1LjA4MzYyMDY5LDExOC40MTAzNDUiIGlkPSJGaWxsLTEwIiBmaWxsPSIjMDBBMERGIj48L3BhdGg+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4K';

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
  logo: {
    width: '76px',
    height: '100%',
  },
  orderContainer: {
    padding: '50px 70px',
    color: colorsToJs['dark-jungle-green'],
  },
  title: {
    marginTop: '15px',
    marginBottom: '15px',
    fontFamily: 'Proxima Nova Semibold',
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
      <h5 style={styles.detailedTitle}>{title}</h5>
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
        <a href={siteLink}>
          <img src={fioLogoSrc} alt="fio-logo" style={styles.logo} />
        </a>
      </div>
      <div style={styles.orderContainer}>
        <h4 style={styles.title}>My Order</h4>
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
                      {item.txId && (
                        <div style={styles.txIdContainer}>
                          <div style={styles.txIdTitle}>Transaction ID</div>
                          <a
                            href={`${process.env.REACT_APP_FIO_BLOCKS_TX_URL}${item.txId}`}
                            target="_blank"
                            rel="noreferrer"
                            style={styles.txIdLink}
                          >
                            {`${process.env.REACT_APP_FIO_BLOCKS_TX_URL}${item.txId}`}
                          </a>
                        </div>
                      )}
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
