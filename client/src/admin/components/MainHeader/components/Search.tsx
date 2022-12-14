import React, { useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router';
import { useDispatch } from 'react-redux';

import { ADMIN_ROUTES } from '../../../../constants/routes';
import { adminSearch } from '../../../../redux/admin/actions';

import classes from '../MainHeader.module.scss';

const Search: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');

  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleSearch = () => {
    dispatch(adminSearch(searchValue));
    if (location.pathname !== ADMIN_ROUTES.ADMIN_SEARCH_RESULT) {
      history.push(ADMIN_ROUTES.ADMIN_SEARCH_RESULT);
    }
  };

  return (
    <div className="d-flex align-items-center">
      <InputGroup>
        <Form.Control
          placeholder="Search"
          aria-label="Search"
          defaultValue={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          onKeyPress={(event: React.KeyboardEvent) => {
            if (event.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        <Button
          className={classes.searchButton}
          disabled={!searchValue}
          variant="outline-light"
          onClick={handleSearch}
        >
          Search
        </Button>
      </InputGroup>
    </div>
  );
};

export default Search;
