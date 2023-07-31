import { FIO_ADDRESS_DELIMITER } from '../config/constants';

export const isDomain = fioName => fioName.indexOf(FIO_ADDRESS_DELIMITER) < 0;
